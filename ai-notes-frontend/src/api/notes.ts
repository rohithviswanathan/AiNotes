const API = import.meta.env.VITE_API_URL;

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getNotes() {
  const res = await fetch(`${API}/notes`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to fetch notes");
  return res.json();
}

export async function createNote(note: any) {
  const res = await fetch(`${API}/notes`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(note),
  });
  if (!res.ok) throw new Error("Failed to create note");
  return res.json();
}

export async function updateNote(id: string, note: any) {
  const res = await fetch(`${API}/notes/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(note),
  });
  if (!res.ok) throw new Error("Failed to update note");
  return res.json();
}

export async function deleteNote(id: string) {
  const res = await fetch(`${API}/notes/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete note");
  return res.json();
}
