const API = import.meta.env.VITE_API_URL;

export type AiAction =
  | "summarize"
  | "rewrite"
  | "improve"
  | "translate"
  | "generateTitle"
  | "enhance";

export async function callAi(
  action: AiAction,
  content: string,
  language?: string
): Promise<string> {
  const response = await fetch(`${API}/ai`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action,
      content,
      language,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "AI request failed");
  }

  return data.result;
}
