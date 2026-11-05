export interface ModelDef {
  id: string;
  label: string;
  provider: string;
  envKey: string;
  kind: 'google' | 'openai' | 'anthropic';
  baseUrl?: string;
}

const MODELS: ModelDef[] = [
  { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', provider: 'Google', envKey: 'GEMINI_API_KEY', kind: 'google' },
  { id: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro', provider: 'Google', envKey: 'GEMINI_API_KEY', kind: 'google' },
  { id: 'gpt-4o-mini', label: 'GPT-4o Mini', provider: 'OpenAI', envKey: 'OPENAI_API_KEY', kind: 'openai' },
  { id: 'gpt-4o', label: 'GPT-4o', provider: 'OpenAI', envKey: 'OPENAI_API_KEY', kind: 'openai' },
  { id: 'gpt-4.1', label: 'GPT-4.1', provider: 'OpenAI', envKey: 'OPENAI_API_KEY', kind: 'openai' },
  { id: 'claude-sonnet-4-5', label: 'Claude Sonnet 4.5', provider: 'Anthropic', envKey: 'ANTHROPIC_API_KEY', kind: 'anthropic' },
  { id: 'claude-haiku-4-5', label: 'Claude Haiku 4.5', provider: 'Anthropic', envKey: 'ANTHROPIC_API_KEY', kind: 'anthropic' },
  { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B (Groq)', provider: 'Groq', envKey: 'GROQ_API_KEY', kind: 'openai', baseUrl: 'https://api.groq.com/openai/v1' },
  { id: 'openai/gpt-oss-120b', label: 'GPT-OSS 120B (Groq)', provider: 'Groq', envKey: 'GROQ_API_KEY', kind: 'openai', baseUrl: 'https://api.groq.com/openai/v1' },
  { id: 'deepseek-chat', label: 'DeepSeek V3', provider: 'DeepSeek', envKey: 'DEEPSEEK_API_KEY', kind: 'openai', baseUrl: 'https://api.deepseek.com/v1' },
  { id: 'meta-llama/llama-3.3-70b-instruct', label: 'Llama 3.3 70B (OpenRouter)', provider: 'OpenRouter', envKey: 'OPENROUTER_API_KEY', kind: 'openai', baseUrl: 'https://openrouter.ai/api/v1' },
  { id: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet (OpenRouter)', provider: 'OpenRouter', envKey: 'OPENROUTER_API_KEY', kind: 'openai', baseUrl: 'https://openrouter.ai/api/v1' },
  // FreeLLMAPI (self-hosted free-tier router, OpenAI-compatible /v1)
  { id: 'auto', label: 'FreeLLM Auto Router', provider: 'FreeLLM', envKey: 'FREE_LLM_API_KEY', kind: 'openai', baseUrl: process.env.FREE_LLM_API_URL || 'http://localhost:3001/v1' },
  { id: 'fusion', label: 'FreeLLM Fusion (multi-model)', provider: 'FreeLLM', envKey: 'FREE_LLM_API_KEY', kind: 'openai', baseUrl: process.env.FREE_LLM_API_URL || 'http://localhost:3001/v1' },
];

const FALLBACK_ORDER = [
  'gemini-2.5-flash',
  'gpt-4o-mini',
  'claude-sonnet-4-5',
  'deepseek-chat',
  'llama-3.3-70b-versatile',
  'meta-llama/llama-3.3-70b-instruct',
  'auto',
  'gemini-2.5-pro',
  'gpt-4o',
  'claude-haiku-4-5',
  'gpt-4.1',
  'openai/gpt-oss-120b',
  'anthropic/claude-3.5-sonnet',
  'fusion',
];

export interface GenerateOptions {
  requested?: string | null;
  prompt: string;
  json?: boolean;
}

export interface GenerateResult {
  text: string;
  model: string;
  provider: string;
}

function stripJsonFences(text: string): string {
  const trimmed = text.trim();
  const match = trimmed.match(/^```(?:json)?\s*\n([\s\S]*?)\n```$/);
  return match ? match[1].trim() : trimmed;
}

export class AiModelGateway {
  private static singleton: AiModelGateway;

  static getInstance(): AiModelGateway {
    if (!AiModelGateway.singleton) {
      AiModelGateway.singleton = new AiModelGateway();
    }
    return AiModelGateway.singleton;
  }

  listModels() {
    return MODELS.map(m => ({
      id: m.id,
      label: m.label,
      provider: m.provider,
      available: !!process.env[m.envKey],
    }));
  }

  hasAnyProvider(): boolean {
    const keys = new Set(MODELS.map(m => m.envKey));
    return [...keys].some(k => !!process.env[k]);
  }

  private resolve(requested?: string | null): ModelDef[] {
    const available = FALLBACK_ORDER
      .map(id => MODELS.find(m => m.id === id))
      .filter((m): m is ModelDef => !!m && !!process.env[m.envKey]);

    const req = requested?.trim();
    if (!req) return available;

    const requestedDef = MODELS.find(m => m.id === req);
    if (!requestedDef) return available; // unknown id → normal fallback

    // Sticky provider: requesting a model pins fallback to that provider,
    // so a free-tier model (e.g. FreeLLM 'auto') can never fall back to paid providers.
    const pool = available.filter(m => m.provider === requestedDef.provider);
    const wanted = pool.find(m => m.id === req);
    if (wanted) return [wanted, ...pool.filter(m => m !== wanted)];
    if (pool.length > 0) return pool; // requested model unavailable, same provider
    return []; // provider not configured → callers fall back to their own mock data
  }

  async generateText(opts: GenerateOptions): Promise<GenerateResult> {
    const candidates = this.resolve(opts.requested);
    if (candidates.length === 0) {
      throw new Error('No AI provider is configured. Add an API key (GEMINI_API_KEY, OPENAI_API_KEY, ANTHROPIC_API_KEY, GROQ_API_KEY, DEEPSEEK_API_KEY or OPENROUTER_API_KEY).');
    }

    const errors: string[] = [];
    for (const model of candidates) {
      try {
        const text = await this.call(model, opts.prompt, !!opts.json);
        return { text, model: model.id, provider: model.provider };
      } catch (err) {
        errors.push(`${model.label}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
    throw new Error(`All AI providers failed. ${errors.join(' | ')}`);
  }

  private async call(model: ModelDef, prompt: string, json: boolean): Promise<string> {
    if (model.kind === 'google') return this.callGoogle(model, prompt, json);
    if (model.kind === 'anthropic') return this.callAnthropic(model, prompt);
    return this.callOpenAiCompatible(model, prompt, json);
  }

  private async callGoogle(model: ModelDef, prompt: string, json: boolean): Promise<string> {
    const apiKey = process.env[model.envKey]!;
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model.id}:generateContent`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          ...(json ? { generationConfig: { responseMimeType: 'application/json' } } : {}),
        }),
      }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
    const data: any = await res.json();
    const text = data?.candidates?.[0]?.content?.parts
      ?.map((p: any) => p.text || '')
      .join('');
    if (!text) throw new Error('Empty response from Gemini');
    return json ? stripJsonFences(text) : text;
  }

  private async callOpenAiCompatible(model: ModelDef, prompt: string, json: boolean): Promise<string> {
    const apiKey = process.env[model.envKey]!;
    const baseUrl = model.baseUrl || 'https://api.openai.com/v1';
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    };
    if (model.provider === 'OpenRouter') {
      headers['HTTP-Referer'] = process.env.FRONTEND_URL || 'http://localhost:3000';
      headers['X-Title'] = 'StackGen AI';
    }
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: model.id,
        messages: [
          ...(model.provider === 'OpenRouter' ? [{ role: 'system', content: 'You are a helpful assistant.' }] : []),
          { role: 'user', content: prompt },
        ],
        ...(json ? { response_format: { type: 'json_object' } } : {}),
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
    const data: any = await res.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) throw new Error('Empty response');
    return json ? stripJsonFences(text) : text;
  }

  private async callAnthropic(model: ModelDef, prompt: string): Promise<string> {
    const apiKey = process.env[model.envKey]!;
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: model.id,
        max_tokens: 8192,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
    const data: any = await res.json();
    const text = (data?.content || [])
      .filter((c: any) => c.type === 'text')
      .map((c: any) => c.text)
      .join('');
    if (!text) throw new Error('Empty response from Anthropic');
    return text;
  }
}

export const aiGateway = AiModelGateway.getInstance();
