// World Technology Stack Encyclopedia
// Comprehensive catalog of technologies with Simple Icons slugs

export interface TechEntry {
  name: string;
  slug: string; // simpleicons.org slug
  category: string;
  subcategory: string;
}

export const TECH_CATEGORIES = [
  'Programming Languages',
  'Web Frontend',
  'Web Backend',
  'Mobile',
  'Databases',
  'Cloud & Hosting',
  'DevOps & CI/CD',
  'Containers & K8s',
  'Messaging & Queues',
  'AI & ML',
  'Testing',
  'Monitoring',
  'Security',
  'CMS & E-commerce',
  'Design & UI',
] as const;

export type TechCategory = typeof TECH_CATEGORIES[number];

export const TECH_ENCYCLOPEDIA: TechEntry[] = [
  // ─── PROGRAMMING LANGUAGES ────────────────────────────
  { name: 'JavaScript', slug: 'javascript', category: 'Programming Languages', subcategory: 'General Purpose' },
  { name: 'TypeScript', slug: 'typescript', category: 'Programming Languages', subcategory: 'General Purpose' },
  { name: 'Python', slug: 'python', category: 'Programming Languages', subcategory: 'General Purpose' },
  { name: 'Java', slug: 'java', category: 'Programming Languages', subcategory: 'General Purpose' },
  { name: 'C#', slug: 'csharp', category: 'Programming Languages', subcategory: 'General Purpose' },
  { name: 'C++', slug: 'cplusplus', category: 'Programming Languages', subcategory: 'General Purpose' },
  { name: 'C', slug: 'c', category: 'Programming Languages', subcategory: 'General Purpose' },
  { name: 'Go', slug: 'go', category: 'Programming Languages', subcategory: 'General Purpose' },
  { name: 'Rust', slug: 'rust', category: 'Programming Languages', subcategory: 'General Purpose' },
  { name: 'Kotlin', slug: 'kotlin', category: 'Programming Languages', subcategory: 'General Purpose' },
  { name: 'Swift', slug: 'swift', category: 'Programming Languages', subcategory: 'General Purpose' },
  { name: 'Ruby', slug: 'ruby', category: 'Programming Languages', subcategory: 'General Purpose' },
  { name: 'PHP', slug: 'php', category: 'Programming Languages', subcategory: 'General Purpose' },
  { name: 'Scala', slug: 'scala', category: 'Programming Languages', subcategory: 'General Purpose' },
  { name: 'Elixir', slug: 'elixir', category: 'Programming Languages', subcategory: 'General Purpose' },
  { name: 'Dart', slug: 'dart', category: 'Programming Languages', subcategory: 'General Purpose' },
  { name: 'R', slug: 'r', category: 'Programming Languages', subcategory: 'General Purpose' },
  { name: 'Haskell', slug: 'haskell', category: 'Programming Languages', subcategory: 'General Purpose' },
  { name: 'Lua', slug: 'lua', category: 'Programming Languages', subcategory: 'General Purpose' },
  { name: 'Perl', slug: 'perl', category: 'Programming Languages', subcategory: 'General Purpose' },
  { name: 'Clojure', slug: 'clojure', category: 'Programming Languages', subcategory: 'General Purpose' },
  { name: 'Julia', slug: 'julia', category: 'Programming Languages', subcategory: 'General Purpose' },
  { name: 'Erlang', slug: 'erlang', category: 'Programming Languages', subcategory: 'General Purpose' },
  { name: 'Nim', slug: 'nim', category: 'Programming Languages', subcategory: 'General Purpose' },
  { name: 'Zig', slug: 'zig', category: 'Programming Languages', subcategory: 'General Purpose' },
  { name: 'OCaml', slug: 'ocaml', category: 'Programming Languages', subcategory: 'General Purpose' },
  { name: 'Solidity', slug: 'solidity', category: 'Programming Languages', subcategory: 'Blockchain' },
  { name: 'GraphQL', slug: 'graphql', category: 'Programming Languages', subcategory: 'Query Language' },

  // ─── WEB FRONTEND ─────────────────────────────────────
  // Frameworks
  { name: 'React', slug: 'react', category: 'Web Frontend', subcategory: 'Frameworks' },
  { name: 'Angular', slug: 'angular', category: 'Web Frontend', subcategory: 'Frameworks' },
  { name: 'Vue.js', slug: 'vuedotjs', category: 'Web Frontend', subcategory: 'Frameworks' },
  { name: 'Svelte', slug: 'svelte', category: 'Web Frontend', subcategory: 'Frameworks' },
  { name: 'SolidJS', slug: 'solid', category: 'Web Frontend', subcategory: 'Frameworks' },
  { name: 'Qwik', slug: 'qwik', category: 'Web Frontend', subcategory: 'Frameworks' },
  { name: 'Preact', slug: 'preact', category: 'Web Frontend', subcategory: 'Frameworks' },
  { name: 'Alpine.js', slug: 'alpinedotjs', category: 'Web Frontend', subcategory: 'Frameworks' },
  { name: 'Lit', slug: 'lit', category: 'Web Frontend', subcategory: 'Frameworks' },
  { name: 'Ember.js', slug: 'emberdotjs', category: 'Web Frontend', subcategory: 'Frameworks' },
  // Meta-Frameworks
  { name: 'Next.js', slug: 'nextdotjs', category: 'Web Frontend', subcategory: 'Meta-Frameworks' },
  { name: 'Nuxt.js', slug: 'nuxtdotjs', category: 'Web Frontend', subcategory: 'Meta-Frameworks' },
  { name: 'SvelteKit', slug: 'svelte', category: 'Web Frontend', subcategory: 'Meta-Frameworks' },
  { name: 'Remix', slug: 'remix', category: 'Web Frontend', subcategory: 'Meta-Frameworks' },
  { name: 'Astro', slug: 'astro', category: 'Web Frontend', subcategory: 'Meta-Frameworks' },
  { name: 'Gatsby', slug: 'gatsby', category: 'Web Frontend', subcategory: 'Meta-Frameworks' },
  // CSS
  { name: 'Tailwind CSS', slug: 'tailwindcss', category: 'Web Frontend', subcategory: 'CSS' },
  { name: 'Bootstrap', slug: 'bootstrap', category: 'Web Frontend', subcategory: 'CSS' },
  { name: 'Sass', slug: 'sass', category: 'Web Frontend', subcategory: 'CSS' },
  { name: 'PostCSS', slug: 'postcss', category: 'Web Frontend', subcategory: 'CSS' },
  { name: 'Styled Components', slug: 'styledcomponents', category: 'Web Frontend', subcategory: 'CSS' },
  { name: 'CSS Modules', slug: 'cssmodules', category: 'Web Frontend', subcategory: 'CSS' },
  // UI Libraries
  { name: 'Shadcn/ui', slug: 'shadcnui', category: 'Web Frontend', subcategory: 'UI Libraries' },
  { name: 'Material UI', slug: 'mui', category: 'Web Frontend', subcategory: 'UI Libraries' },
  { name: 'Ant Design', slug: 'antdesign', category: 'Web Frontend', subcategory: 'UI Libraries' },
  { name: 'Chakra UI', slug: 'chakraui', category: 'Web Frontend', subcategory: 'UI Libraries' },
  { name: 'Mantine', slug: 'mantine', category: 'Web Frontend', subcategory: 'UI Libraries' },
  { name: 'Radix UI', slug: 'radixui', category: 'Web Frontend', subcategory: 'UI Libraries' },
  // State Management
  { name: 'Redux', slug: 'redux', category: 'Web Frontend', subcategory: 'State Management' },
  { name: 'Zustand', slug: 'zustand', category: 'Web Frontend', subcategory: 'State Management' },
  { name: 'MobX', slug: 'mobx', category: 'Web Frontend', subcategory: 'State Management' },
  { name: 'React Query', slug: 'reactquery', category: 'Web Frontend', subcategory: 'State Management' },
  { name: 'SWR', slug: 'swr', category: 'Web Frontend', subcategory: 'State Management' },
  { name: 'Pinia', slug: 'pinia', category: 'Web Frontend', subcategory: 'State Management' },
  // Build Tools
  { name: 'Vite', slug: 'vite', category: 'Web Frontend', subcategory: 'Build Tools' },
  { name: 'Webpack', slug: 'webpack', category: 'Web Frontend', subcategory: 'Build Tools' },
  { name: 'Rollup', slug: 'rollupdotjs', category: 'Web Frontend', subcategory: 'Build Tools' },
  { name: 'esbuild', slug: 'esbuild', category: 'Web Frontend', subcategory: 'Build Tools' },
  { name: 'Bun', slug: 'bun', category: 'Web Frontend', subcategory: 'Build Tools' },
  { name: 'Babel', slug: 'babel', category: 'Web Frontend', subcategory: 'Build Tools' },
  { name: 'SWC', slug: 'swc', category: 'Web Frontend', subcategory: 'Build Tools' },

  // ─── WEB BACKEND ──────────────────────────────────────
  // Node.js
  { name: 'Express.js', slug: 'express', category: 'Web Backend', subcategory: 'Node.js' },
  { name: 'NestJS', slug: 'nestjs', category: 'Web Backend', subcategory: 'Node.js' },
  { name: 'Fastify', slug: 'fastify', category: 'Web Backend', subcategory: 'Node.js' },
  { name: 'Hono', slug: 'hono', category: 'Web Backend', subcategory: 'Node.js' },
  { name: 'AdonisJS', slug: 'adonisjs', category: 'Web Backend', subcategory: 'Node.js' },
  { name: 'tRPC', slug: 'trpc', category: 'Web Backend', subcategory: 'Node.js' },
  // Python
  { name: 'Django', slug: 'django', category: 'Web Backend', subcategory: 'Python' },
  { name: 'Flask', slug: 'flask', category: 'Web Backend', subcategory: 'Python' },
  { name: 'FastAPI', slug: 'fastapi', category: 'Web Backend', subcategory: 'Python' },
  // Java/JVM
  { name: 'Spring Boot', slug: 'springboot', category: 'Web Backend', subcategory: 'Java/JVM' },
  { name: 'Quarkus', slug: 'quarkus', category: 'Web Backend', subcategory: 'Java/JVM' },
  { name: 'Ktor', slug: 'ktor', category: 'Web Backend', subcategory: 'Java/JVM' },
  // PHP
  { name: 'Laravel', slug: 'laravel', category: 'Web Backend', subcategory: 'PHP' },
  { name: 'Symfony', slug: 'symfony', category: 'Web Backend', subcategory: 'PHP' },
  // Ruby
  { name: 'Ruby on Rails', slug: 'rubyonrails', category: 'Web Backend', subcategory: 'Ruby' },
  // Go
  { name: 'Gin', slug: 'gin', category: 'Web Backend', subcategory: 'Go' },
  { name: 'Fiber', slug: 'fiber', category: 'Web Backend', subcategory: 'Go' },
  // Rust
  { name: 'Actix Web', slug: 'actix', category: 'Web Backend', subcategory: 'Rust' },
  { name: 'Axum', slug: 'rust', category: 'Web Backend', subcategory: 'Rust' },
  // .NET
  { name: 'ASP.NET Core', slug: 'dotnet', category: 'Web Backend', subcategory: '.NET' },
  { name: 'Blazor', slug: 'blazor', category: 'Web Backend', subcategory: '.NET' },
  // Other
  { name: 'Phoenix', slug: 'phoenixframework', category: 'Web Backend', subcategory: 'Elixir' },

  // ─── MOBILE ───────────────────────────────────────────
  { name: 'React Native', slug: 'react', category: 'Mobile', subcategory: 'Cross-Platform' },
  { name: 'Flutter', slug: 'flutter', category: 'Mobile', subcategory: 'Cross-Platform' },
  { name: 'Expo', slug: 'expo', category: 'Mobile', subcategory: 'Cross-Platform' },
  { name: 'Ionic', slug: 'ionic', category: 'Mobile', subcategory: 'Cross-Platform' },
  { name: 'Capacitor', slug: 'capacitor', category: 'Mobile', subcategory: 'Cross-Platform' },
  { name: 'Kotlin Multiplatform', slug: 'kotlin', category: 'Mobile', subcategory: 'Cross-Platform' },
  { name: 'SwiftUI', slug: 'swift', category: 'Mobile', subcategory: 'Native iOS' },
  { name: 'UIKit', slug: 'apple', category: 'Mobile', subcategory: 'Native iOS' },
  { name: 'Jetpack Compose', slug: 'jetpackcompose', category: 'Mobile', subcategory: 'Native Android' },
  { name: 'Android SDK', slug: 'android', category: 'Mobile', subcategory: 'Native Android' },

  // ─── DATABASES ────────────────────────────────────────
  // SQL
  { name: 'PostgreSQL', slug: 'postgresql', category: 'Databases', subcategory: 'SQL' },
  { name: 'MySQL', slug: 'mysql', category: 'Databases', subcategory: 'SQL' },
  { name: 'MariaDB', slug: 'mariadb', category: 'Databases', subcategory: 'SQL' },
  { name: 'SQLite', slug: 'sqlite', category: 'Databases', subcategory: 'SQL' },
  { name: 'SQL Server', slug: 'microsoftsqlserver', category: 'Databases', subcategory: 'SQL' },
  { name: 'Oracle DB', slug: 'oracle', category: 'Databases', subcategory: 'SQL' },
  { name: 'CockroachDB', slug: 'cockroachlabs', category: 'Databases', subcategory: 'SQL' },
  { name: 'PlanetScale', slug: 'planetscale', category: 'Databases', subcategory: 'SQL' },
  { name: 'Neon', slug: 'neon', category: 'Databases', subcategory: 'SQL' },
  { name: 'Supabase', slug: 'supabase', category: 'Databases', subcategory: 'SQL' },
  // NoSQL
  { name: 'MongoDB', slug: 'mongodb', category: 'Databases', subcategory: 'NoSQL' },
  { name: 'Redis', slug: 'redis', category: 'Databases', subcategory: 'NoSQL' },
  { name: 'DynamoDB', slug: 'amazondynamodb', category: 'Databases', subcategory: 'NoSQL' },
  { name: 'Cassandra', slug: 'apachecassandra', category: 'Databases', subcategory: 'NoSQL' },
  { name: 'Couchbase', slug: 'couchbase', category: 'Databases', subcategory: 'NoSQL' },
  { name: 'Neo4j', slug: 'neo4j', category: 'Databases', subcategory: 'NoSQL' },
  { name: 'Firebase', slug: 'firebase', category: 'Databases', subcategory: 'NoSQL' },
  // Analytics
  { name: 'ClickHouse', slug: 'clickhouse', category: 'Databases', subcategory: 'Analytics' },
  { name: 'Snowflake', slug: 'snowflake', category: 'Databases', subcategory: 'Analytics' },
  { name: 'BigQuery', slug: 'googlebigquery', category: 'Databases', subcategory: 'Analytics' },
  { name: 'DuckDB', slug: 'duckdb', category: 'Databases', subcategory: 'Analytics' },
  // Search
  { name: 'Elasticsearch', slug: 'elasticsearch', category: 'Databases', subcategory: 'Search' },
  { name: 'Meilisearch', slug: 'meilisearch', category: 'Databases', subcategory: 'Search' },
  { name: 'Algolia', slug: 'algolia', category: 'Databases', subcategory: 'Search' },
  { name: 'Typesense', slug: 'typesense', category: 'Databases', subcategory: 'Search' },
  // Vector
  { name: 'Pinecone', slug: 'pinecone', category: 'Databases', subcategory: 'Vector' },
  { name: 'Weaviate', slug: 'weaviate', category: 'Databases', subcategory: 'Vector' },
  { name: 'Chroma', slug: 'chroma', category: 'Databases', subcategory: 'Vector' },
  // ORM
  { name: 'Prisma', slug: 'prisma', category: 'Databases', subcategory: 'ORM' },
  { name: 'Drizzle', slug: 'drizzle', category: 'Databases', subcategory: 'ORM' },
  { name: 'TypeORM', slug: 'typeorm', category: 'Databases', subcategory: 'ORM' },
  { name: 'Sequelize', slug: 'sequelize', category: 'Databases', subcategory: 'ORM' },
  { name: 'Mongoose', slug: 'mongoose', category: 'Databases', subcategory: 'ORM' },

  // ─── CLOUD & HOSTING ──────────────────────────────────
  { name: 'AWS', slug: 'amazonwebservices', category: 'Cloud & Hosting', subcategory: 'Major Providers' },
  { name: 'Google Cloud', slug: 'googlecloud', category: 'Cloud & Hosting', subcategory: 'Major Providers' },
  { name: 'Azure', slug: 'microsoftazure', category: 'Cloud & Hosting', subcategory: 'Major Providers' },
  { name: 'DigitalOcean', slug: 'digitalocean', category: 'Cloud & Hosting', subcategory: 'Major Providers' },
  { name: 'Cloudflare', slug: 'cloudflare', category: 'Cloud & Hosting', subcategory: 'Major Providers' },
  { name: 'Vercel', slug: 'vercel', category: 'Cloud & Hosting', subcategory: 'Hosting' },
  { name: 'Netlify', slug: 'netlify', category: 'Cloud & Hosting', subcategory: 'Hosting' },
  { name: 'Railway', slug: 'railway', category: 'Cloud & Hosting', subcategory: 'Hosting' },
  { name: 'Render', slug: 'render', category: 'Cloud & Hosting', subcategory: 'Hosting' },
  { name: 'Fly.io', slug: 'flydotio', category: 'Cloud & Hosting', subcategory: 'Hosting' },
  { name: 'Heroku', slug: 'heroku', category: 'Cloud & Hosting', subcategory: 'Hosting' },
  { name: 'Hetzner', slug: 'hetzner', category: 'Cloud & Hosting', subcategory: 'Hosting' },
  { name: 'Vultr', slug: 'vultr', category: 'Cloud & Hosting', subcategory: 'Hosting' },

  // ─── DEVOPS & CI/CD ───────────────────────────────────
  { name: 'GitHub Actions', slug: 'githubactions', category: 'DevOps & CI/CD', subcategory: 'CI/CD' },
  { name: 'GitLab CI', slug: 'gitlab', category: 'DevOps & CI/CD', subcategory: 'CI/CD' },
  { name: 'Jenkins', slug: 'jenkins', category: 'DevOps & CI/CD', subcategory: 'CI/CD' },
  { name: 'CircleCI', slug: 'circleci', category: 'DevOps & CI/CD', subcategory: 'CI/CD' },
  { name: 'ArgoCD', slug: 'argo', category: 'DevOps & CI/CD', subcategory: 'CI/CD' },
  { name: 'Terraform', slug: 'terraform', category: 'DevOps & CI/CD', subcategory: 'IaC' },
  { name: 'Pulumi', slug: 'pulumi', category: 'DevOps & CI/CD', subcategory: 'IaC' },
  { name: 'Ansible', slug: 'ansible', category: 'DevOps & CI/CD', subcategory: 'IaC' },
  { name: 'Nginx', slug: 'nginx', category: 'DevOps & CI/CD', subcategory: 'Web Server' },
  { name: 'Caddy', slug: 'caddy', category: 'DevOps & CI/CD', subcategory: 'Web Server' },

  // ─── CONTAINERS & K8S ─────────────────────────────────
  { name: 'Docker', slug: 'docker', category: 'Containers & K8s', subcategory: 'Containers' },
  { name: 'Podman', slug: 'podman', category: 'Containers & K8s', subcategory: 'Containers' },
  { name: 'Kubernetes', slug: 'kubernetes', category: 'Containers & K8s', subcategory: 'Orchestration' },
  { name: 'Helm', slug: 'helm', category: 'Containers & K8s', subcategory: 'K8s Tools' },
  { name: 'Istio', slug: 'istio', category: 'Containers & K8s', subcategory: 'K8s Tools' },
  { name: 'Rancher', slug: 'rancher', category: 'Containers & K8s', subcategory: 'K8s Tools' },
  { name: 'Traefik', slug: 'traefikproxy', category: 'Containers & K8s', subcategory: 'K8s Tools' },

  // ─── MESSAGING & QUEUES ───────────────────────────────
  { name: 'Apache Kafka', slug: 'apachekafka', category: 'Messaging & Queues', subcategory: 'Event Streaming' },
  { name: 'RabbitMQ', slug: 'rabbitmq', category: 'Messaging & Queues', subcategory: 'Message Brokers' },
  { name: 'NATS', slug: 'nats', category: 'Messaging & Queues', subcategory: 'Message Brokers' },
  { name: 'Amazon SQS', slug: 'amazonsqs', category: 'Messaging & Queues', subcategory: 'Cloud Messaging' },
  { name: 'Redis Streams', slug: 'redis', category: 'Messaging & Queues', subcategory: 'Event Streaming' },
  { name: 'BullMQ', slug: 'bull', category: 'Messaging & Queues', subcategory: 'Job Queues' },
  { name: 'Celery', slug: 'celery', category: 'Messaging & Queues', subcategory: 'Job Queues' },

  // ─── AI & ML ──────────────────────────────────────────
  { name: 'TensorFlow', slug: 'tensorflow', category: 'AI & ML', subcategory: 'ML Frameworks' },
  { name: 'PyTorch', slug: 'pytorch', category: 'AI & ML', subcategory: 'ML Frameworks' },
  { name: 'Keras', slug: 'keras', category: 'AI & ML', subcategory: 'ML Frameworks' },
  { name: 'Scikit-learn', slug: 'scikitlearn', category: 'AI & ML', subcategory: 'ML Frameworks' },
  { name: 'OpenAI', slug: 'openai', category: 'AI & ML', subcategory: 'LLM Providers' },
  { name: 'Anthropic (Claude)', slug: 'anthropic', category: 'AI & ML', subcategory: 'LLM Providers' },
  { name: 'Google Gemini', slug: 'googlegemini', category: 'AI & ML', subcategory: 'LLM Providers' },
  { name: 'Hugging Face', slug: 'huggingface', category: 'AI & ML', subcategory: 'LLM Providers' },
  { name: 'LangChain', slug: 'langchain', category: 'AI & ML', subcategory: 'AI Tools' },
  { name: 'Ollama', slug: 'ollama', category: 'AI & ML', subcategory: 'AI Tools' },

  // ─── TESTING ──────────────────────────────────────────
  { name: 'Jest', slug: 'jest', category: 'Testing', subcategory: 'Unit' },
  { name: 'Vitest', slug: 'vitest', category: 'Testing', subcategory: 'Unit' },
  { name: 'Mocha', slug: 'mocha', category: 'Testing', subcategory: 'Unit' },
  { name: 'Playwright', slug: 'playwright', category: 'Testing', subcategory: 'E2E' },
  { name: 'Cypress', slug: 'cypress', category: 'Testing', subcategory: 'E2E' },
  { name: 'Selenium', slug: 'selenium', category: 'Testing', subcategory: 'E2E' },
  { name: 'Storybook', slug: 'storybook', category: 'Testing', subcategory: 'Visual' },
  { name: 'Testing Library', slug: 'testinglibrary', category: 'Testing', subcategory: 'Unit' },

  // ─── MONITORING ───────────────────────────────────────
  { name: 'Grafana', slug: 'grafana', category: 'Monitoring', subcategory: 'Dashboards' },
  { name: 'Prometheus', slug: 'prometheus', category: 'Monitoring', subcategory: 'Metrics' },
  { name: 'Datadog', slug: 'datadog', category: 'Monitoring', subcategory: 'APM' },
  { name: 'Sentry', slug: 'sentry', category: 'Monitoring', subcategory: 'Error Tracking' },
  { name: 'New Relic', slug: 'newrelic', category: 'Monitoring', subcategory: 'APM' },
  { name: 'OpenTelemetry', slug: 'opentelemetry', category: 'Monitoring', subcategory: 'Tracing' },
  { name: 'Jaeger', slug: 'jaeger', category: 'Monitoring', subcategory: 'Tracing' },

  // ─── SECURITY ─────────────────────────────────────────
  { name: 'Auth0', slug: 'auth0', category: 'Security', subcategory: 'Authentication' },
  { name: 'Clerk', slug: 'clerk', category: 'Security', subcategory: 'Authentication' },
  { name: 'Keycloak', slug: 'keycloak', category: 'Security', subcategory: 'Authentication' },
  { name: 'Vault', slug: 'vault', category: 'Security', subcategory: 'Secrets' },
  { name: 'Let\'s Encrypt', slug: 'letsencrypt', category: 'Security', subcategory: 'SSL' },
  { name: 'Snyk', slug: 'snyk', category: 'Security', subcategory: 'Scanning' },

  // ─── CMS & E-COMMERCE ────────────────────────────────
  { name: 'Strapi', slug: 'strapi', category: 'CMS & E-commerce', subcategory: 'CMS' },
  { name: 'Sanity', slug: 'sanity', category: 'CMS & E-commerce', subcategory: 'CMS' },
  { name: 'Contentful', slug: 'contentful', category: 'CMS & E-commerce', subcategory: 'CMS' },
  { name: 'WordPress', slug: 'wordpress', category: 'CMS & E-commerce', subcategory: 'CMS' },
  { name: 'Shopify', slug: 'shopify', category: 'CMS & E-commerce', subcategory: 'E-commerce' },
  { name: 'Stripe', slug: 'stripe', category: 'CMS & E-commerce', subcategory: 'Payments' },
  { name: 'PayPal', slug: 'paypal', category: 'CMS & E-commerce', subcategory: 'Payments' },

  // ─── DESIGN & UI ──────────────────────────────────────
  { name: 'Figma', slug: 'figma', category: 'Design & UI', subcategory: 'Design Tools' },
  { name: 'Framer', slug: 'framer', category: 'Design & UI', subcategory: 'Design Tools' },
  { name: 'Storybook', slug: 'storybook', category: 'Design & UI', subcategory: 'Design Tools' },
];
