import { createAuthClient } from "better-auth/react";

function getValidBaseUrl(): string {
  let url = process.env.NEXT_PUBLIC_API_URL?.trim();

  if (!url) {
    return "https://stackgen.dashboardkiller.online";
  }

  // Strip wrapping quotes if user pasted '"https://..."' in Vercel
  url = url.replace(/^["']|["']$/g, "").trim();

  // If protocol was omitted (e.g. 'api.example.com'), prepend https://
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }

  // Remove trailing slashes
  url = url.replace(/\/+$/, "");

  try {
    new URL(url);
    return url;
  } catch {
    return "https://stackgen.dashboardkiller.online";
  }
}

export const authClient = createAuthClient({
  baseURL: getValidBaseUrl(),
});
