"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      router.push("/");
      return;
    }
    setUsername(storedUsername);
    fetchNotes();
  }, [router]);

  const fetchNotes = async () => {
    try {
      const response = await fetch(`${API_URL}/notes/fetch/100/0`);
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const createNote = async () => {
    try {
      const response = await fetch(`${API_URL}/notes/create_note`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: username,
          content: "",
        }),
      });
      const newNote = await response.json();
      setNotes([newNote, ...notes]);
      setSelectedNote(newNote);
      setContent("");
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  const updateNote = async () => {
    if (!selectedNote) return;

    try {
      await fetch(`${API_URL}/notes/update_note/${selectedNote.noteId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
        }),
      });
      
      setNotes(
        notes.map((note) =>
          note.noteId === selectedNote.noteId
            ? { ...note, content }
            : note
        )
      );
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      await fetch(`${API_URL}/notes/delete/${noteId}`, {
        method: "DELETE",
      });
      setNotes(notes.filter((note) => note.noteId !== noteId));
      if (selectedNote?.noteId === noteId) {
        setSelectedNote(null);
        setContent("");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-80 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border flex items-center justify-between">
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
            <div className="p-4 border-b border-border">
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date(selectedNote.updated_at).toLocaleString()}
              </p>
            </div>
            <div className="flex-1 p-4">
              <textarea
                className="w-full h-full p-4 text-lg bg-background border-none focus:outline-none resize-none"
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
  );
} 