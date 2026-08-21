const API = import.meta.env.VITE_API_URL;

export async function getNotes() {
  const response = await fetch(`${API}/notes`);

  if (!response.ok) {
    throw new Error("Failed to fetch notes");
  }

  return response.json();
}

export async function createNote(note: any) {
  const response = await fetch(`${API}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });

  if (!response.ok) {
    throw new Error("Failed to create note");
  }

  return response.json();
}

export async function updateNote(id: string, note: any) {
  const response = await fetch(`${API}/notes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });

  if (!response.ok) {
    throw new Error("Failed to update note");
  }

  return response.json();
}

export async function deleteNote(id: string) {
  const response = await fetch(`${API}/notes/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete note");
  }

  return response.json();
}