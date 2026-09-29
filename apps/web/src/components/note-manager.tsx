"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { deleteNote, saveNote, setNotePinned } from "@/app/my/notes/actions";

export type NoteItem = {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  updatedAt: string;
};

export function NoteManager({ notes }: { notes: NoteItem[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<NoteItem | null>(null);
  const [pinned, setPinned] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const visibleNotes = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return notes;
    return notes.filter((note) =>
      `${note.title} ${note.content}`.toLowerCase().includes(term),
    );
  }, [notes, query]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    const result = await saveNote(new FormData(event.currentTarget));
    setBusy(false);
    if (!result.ok) {
      setError(result.message ?? "We could not save this note.");
      return;
    }
    setEditing(null);
    setPinned(false);
    setFormKey((key) => key + 1);
    setMessage("Note saved.");
    router.refresh();
  }

  async function runAction(
    action: (id: string) => Promise<{ ok: boolean; message?: string }>,
    id: string,
  ) {
    setBusy(true);
    setError("");
    setMessage("");
    const result = await action(id);
    setBusy(false);
    if (!result.ok) {
      setError(result.message ?? "We could not update that note.");
      return;
    }
    setMessage("Note updated.");
    router.refresh();
  }

  async function pinNote(id: string, nextPinned: boolean) {
    setBusy(true);
    setError("");
    setMessage("");
    const result = await setNotePinned(id, nextPinned);
    setBusy(false);
    if (!result.ok) {
      setError(result.message ?? "We could not update that note.");
      return;
    }
    setMessage(nextPinned ? "Note pinned." : "Note unpinned.");
    router.refresh();
  }

  function editNote(note: NoteItem) {
    setEditing(note);
    setPinned(note.pinned);
    setFormKey((key) => key + 1);
    setError("");
    setMessage("");
  }

  return (
    <div className="personal-tools-layout notes-layout">
      <section className="personal-panel" aria-labelledby="note-editor-title">
        <div className="personal-panel-heading">
          <div>
            <p className="section-kicker">
              {editing ? "Edit a thought" : "Keep something close"}
            </p>
            <h2 id="note-editor-title">
              {editing ? "Update note" : "New note"}
            </h2>
          </div>
        </div>
        <form
          className="personal-form notes-form"
          id="new-note"
          key={formKey}
          onSubmit={submit}
        >
          <input name="id" type="hidden" value={editing?.id ?? ""} />
          <input
            name="pinned"
            type="hidden"
            value={pinned ? "true" : "false"}
          />
          <label className="personal-form-wide">
            Title <span>(optional)</span>
            <input
              defaultValue={editing?.title ?? ""}
              maxLength={160}
              name="title"
            />
          </label>
          <label className="personal-form-wide">
            Note
            <textarea
              defaultValue={editing?.content ?? ""}
              maxLength={10_000}
              name="content"
              rows={6}
            />
          </label>
          <label className="note-pin-toggle">
            <input
              checked={pinned}
              onChange={(event) => setPinned(event.target.checked)}
              type="checkbox"
            />
            Pin this note
          </label>
          <div className="personal-form-actions personal-form-wide">
            <button className="convert-button" disabled={busy} type="submit">
              {busy ? "Saving…" : editing ? "Save changes" : "Save note"}
              <span aria-hidden="true">→</span>
            </button>
            {editing && (
              <button
                className="plain-action"
                onClick={() => {
                  setEditing(null);
                  setPinned(false);
                  setFormKey((key) => key + 1);
                }}
                type="button"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        {message && (
          <p className="personal-status" role="status">
            {message}
          </p>
        )}
      </section>

      <section className="personal-panel" aria-labelledby="notes-list-title">
        <div className="personal-panel-heading notes-list-heading">
          <div>
            <p className="section-kicker">Your private notes</p>
            <h2 id="notes-list-title">Notes</h2>
          </div>
          <label className="note-search">
            <span className="sr-only">Search notes</span>
            <input
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search notes"
              type="search"
              value={query}
            />
          </label>
        </div>
        {visibleNotes.length === 0 ? (
          <div className="personal-empty">
            <strong>{query ? "No notes found." : "No notes yet."}</strong>
            <span>
              {query
                ? "Try another search, or create a new note."
                : "Create a short note above to keep an idea or detail nearby."}
            </span>
          </div>
        ) : (
          <div className="note-grid">
            {visibleNotes.map((note) => (
              <article
                className={`note-card${note.pinned ? "is-pinned" : ""}`}
                key={note.id}
              >
                <div className="note-card-top">
                  <strong>{note.title || "Untitled note"}</strong>
                  {note.pinned && (
                    <span aria-label="Pinned" className="note-pin-mark">
                      ◆
                    </span>
                  )}
                </div>
                <p>{note.content || "No text in this note yet."}</p>
                <small>
                  Updated{" "}
                  {new Intl.DateTimeFormat("en-NP", {
                    dateStyle: "medium",
                    timeZone: "Asia/Kathmandu",
                  }).format(new Date(note.updatedAt))}
                </small>
                <div className="expense-row-actions">
                  <button
                    className="plain-action"
                    onClick={() => editNote(note)}
                    type="button"
                  >
                    Edit
                  </button>
                  <button
                    className="plain-action"
                    disabled={busy}
                    onClick={() => pinNote(note.id, !note.pinned)}
                    type="button"
                  >
                    {note.pinned ? "Unpin" : "Pin"}
                  </button>
                  <button
                    className="plain-action danger-action"
                    disabled={busy}
                    onClick={() => runAction(deleteNote, note.id)}
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
