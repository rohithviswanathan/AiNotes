const API = "http://localhost:5000";

export type AiAction = "summarize" | "rewrite" | "improve" | "translate" | "generateTitle";

export async function callAi(action: AiAction, content: string): Promise<string> {
  const response = await fetch(`${API}/ai`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, content }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "AI request failed");
  }

  return data.result;
}
