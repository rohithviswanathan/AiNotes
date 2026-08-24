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
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}/ai`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ action, content, language }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "AI request failed");
  return data.result;
}
