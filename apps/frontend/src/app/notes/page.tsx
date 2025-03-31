'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { PlusIcon } from "lucide-react";
import { ThemeToggle } from "../../components/theme-toggle";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { useAuth } from "../../context/AuthContext";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Note {
  noteId: string;
  content: string;
  created_at: string;
  updated_at: string;
  userId: string;
  user: {
    userId: string;
    name: string;
    emailId: string;
  };
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const storedUsername = user?.userId
    console.log("User in notes:", user, isAuthenticated)
    if (!isAuthenticated || !storedUsername) {
      setError("Please log in to view your notes");
      
      return;
    }
    setError(null);
    setUsername(storedUsername);
    fetchNotes(storedUsername);
  }, [isAuthenticated]);

  const fetchNotes = async (currentUsername: string) => {
    if (!currentUsername) {
      setError("Username is required to fetch notes");
      return;
    }
    try {
      const response = await fetch(`${NEXT_PUBLIC_API_URL}/notes/fetch/${currentUsername}/100/0`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      setError("Error fetching notes. Please try again later.");
      console.error("Error fetching notes:", error);
    }
  };

  const createNote = async () => {
    if (!username) {
      setError("Username is required to create a note");
      return;
    }
    try {
      const response = await fetch(`${NEXT_PUBLIC_API_URL}/notes/create_note`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: username,
          content: "",
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to create note');
      }
      const newNote = await response.json();
      setNotes([newNote, ...notes]);
      setSelectedNote(newNote);
      setContent("");
      setError(null);
    } catch (error) {
      setError("Error creating note. Please try again later.");
      console.error("Error creating note:", error);
    }
  };

  const updateNote = async () => {
    if (!selectedNote) return;
    if (!username) {
      setError("Username is required to update a note");
      return;
    }

    try {
      const response = await fetch(`${NEXT_PUBLIC_API_URL}/notes/update_note/${selectedNote.noteId}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to update note');
      }
      
      setNotes(
        notes.map((note) =>
          note.noteId === selectedNote.noteId
            ? { ...note, content }
            : note
        )
      );
      setError(null);
    } catch (error) {
      setError("Error updating note. Please try again later.");
      console.error("Error updating note:", error);
    }
  };

  const deleteNote = async (noteId: string) => {
    if (!username) {
      setError("Username is required to delete a note");
      return;
    }
    try {
      const response = await fetch(`${NEXT_PUBLIC_API_URL}/notes/delete/${noteId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error('Failed to delete note');
      }
      setNotes(notes.filter((note) => note.noteId !== noteId));
      if (selectedNote?.noteId === noteId) {
        setSelectedNote(null);
        setContent("");
      }
      setError(null);
    } catch (error) {
      setError("Error deleting note. Please try again later.");
      console.error("Error deleting note:", error);
    }
  };

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-[hsl(var(--background))]">
        <div className="text-center">
          <p className="text-[hsl(var(--destructive))] mb-4">{error}</p>
          <Button onClick={() => router.push("/")}>Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-[hsl(var(--background))]">
      {/* Sidebar */}
      <div className="w-80 border-r border-[hsl(var(--border))] flex flex-col">
        <div className="p-4 border-b border-[hsl(var(--border))] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold">Notes</h2>
            <ThemeToggle />
          </div>
          <Button size="icon" onClick={createNote}>
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-auto">
          {notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <p className="mb-4">No notes yet</p>
              <Button onClick={createNote}>Create your first note</Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notes.map((note) => (
                <div
                  key={note.noteId}
                  className={`p-4 cursor-pointer hover:bg-muted transition-colors group ${
                    selectedNote?.noteId === note.noteId ? "bg-muted" : ""
                  }`}
                  onClick={() => {
                    setSelectedNote(note);
                    setContent(note.content);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 mr-4">
                      <p className="line-clamp-2 text-sm">
                        {note.content || "Empty note"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(note.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNote(note.noteId);
                      }}
                    >
                      <span className="sr-only">Delete note</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {selectedNote ? (
          <>
            <div className="p-4 border-b border-[hsl(var(--border))]">
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date(selectedNote.updated_at).toLocaleString()}
              </p>
            </div>
            <div className="flex-1 p-4">
              <textarea
                className="w-full h-full p-4 text-lg bg-[hsl(var(--background))] border-none focus:outline-none resize-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onBlur={updateNote}
                placeholder="Start writing..."
                autoFocus
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a note or create a new one
          </div>
        )}
      </div>
    </div>
    </ProtectedRoute>
  );
} 