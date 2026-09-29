"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  deleteReminder,
  saveReminder,
  toggleReminder,
} from "@/app/my/reminders/actions";

export type ReminderItem = {
  id: string;
  title: string;
  details: string;
  remindAt: string;
  repeat: "none" | "daily" | "weekly" | "monthly" | "yearly";
  completed: boolean;
};

const repeatLabels: Record<ReminderItem["repeat"], string> = {
  none: "Does not repeat",
  daily: "Repeats daily",
  weekly: "Repeats weekly",
  monthly: "Repeats monthly",
  yearly: "Repeats yearly",
};

function toNepalInput(iso: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kathmandu",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(iso));
  const value = (name: string) =>
    parts.find((part) => part.type === name)?.value ?? "00";
  return `${value("year")}-${value("month")}-${value("day")}T${value("hour")}:${value("minute")}`;
}

export function ReminderManager({
  reminders,
  newReminderAt,
}: {
  reminders: ReminderItem[];
  newReminderAt: string;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<ReminderItem | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    const result = await saveReminder(new FormData(event.currentTarget));
    setBusy(false);
    if (!result.ok) {
      setError(result.message ?? "We could not save this reminder.");
      return;
    }
    setEditing(null);
    setFormKey((key) => key + 1);
    setMessage("Reminder saved.");
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
      setError(result.message ?? "We could not update that reminder.");
      return;
    }
    setMessage("Reminder updated.");
    router.refresh();
  }

  function editReminder(reminder: ReminderItem) {
    setEditing(reminder);
    setFormKey((key) => key + 1);
    setMessage("");
    setError("");
  }

  return (
    <div className="personal-tools-layout">
      <section className="personal-panel" aria-labelledby="reminder-form-title">
        <div className="personal-panel-heading">
          <div>
            <p className="section-kicker">
              {editing ? "Update reminder" : "Plan a moment"}
            </p>
            <h2 id="reminder-form-title">
              {editing ? "Edit reminder" : "New reminder"}
            </h2>
          </div>
        </div>
        <form
          className="personal-form"
          id="new-reminder"
          key={formKey}
          onSubmit={submit}
        >
          <input name="id" type="hidden" value={editing?.id ?? ""} />
          <label className="personal-form-wide">
            Title
            <input
              defaultValue={editing?.title ?? ""}
              maxLength={120}
              name="title"
              required
            />
          </label>
          <label>
            Date and time <span>(Nepal time)</span>
            <input
              defaultValue={
                editing ? toNepalInput(editing.remindAt) : newReminderAt
              }
              name="remindAt"
              required
              type="datetime-local"
            />
          </label>
          <label>
            Repeat
            <select defaultValue={editing?.repeat ?? "none"} name="repeat">
              <option value="none">Does not repeat</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </label>
          <label className="personal-form-wide">
            Details <span>(optional)</span>
            <textarea
              defaultValue={editing?.details ?? ""}
              maxLength={1000}
              name="details"
              rows={3}
            />
          </label>
          <div className="personal-form-actions personal-form-wide">
            <button className="convert-button" disabled={busy} type="submit">
              {busy ? "Saving…" : editing ? "Save changes" : "Add reminder"}
              <span aria-hidden="true">→</span>
            </button>
            {editing && (
              <button
                className="plain-action"
                onClick={() => {
                  setEditing(null);
                  setFormKey((key) => key + 1);
                }}
                type="button"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
        <p className="data-source-note">
          Repeat choices are saved with your reminder. Browser and email
          notifications are not enabled yet.
        </p>
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

      <section className="personal-panel" aria-labelledby="reminder-list-title">
        <div className="personal-panel-heading">
          <div>
            <p className="section-kicker">Things to remember</p>
            <h2 id="reminder-list-title">Your reminders</h2>
          </div>
        </div>
        {reminders.length === 0 ? (
          <div className="personal-empty">
            <strong>No reminders yet.</strong>
            <span>Add a date above to keep a useful note close.</span>
          </div>
        ) : (
          <div className="reminder-list">
            {reminders.map((reminder) => (
              <article
                className={`reminder-row${reminder.completed ? "is-complete" : ""}`}
                key={reminder.id}
              >
                <button
                  aria-label={
                    reminder.completed
                      ? `Mark ${reminder.title} incomplete`
                      : `Mark ${reminder.title} complete`
                  }
                  aria-pressed={reminder.completed}
                  className="reminder-check"
                  disabled={busy}
                  onClick={() => runAction(toggleReminder, reminder.id)}
                  type="button"
                >
                  {reminder.completed ? "✓" : ""}
                </button>
                <div className="reminder-row-copy">
                  <strong>{reminder.title}</strong>
                  <span>
                    {new Intl.DateTimeFormat("en-NP", {
                      dateStyle: "medium",
                      timeStyle: "short",
                      timeZone: "Asia/Kathmandu",
                    }).format(new Date(reminder.remindAt))}{" "}
                    · Nepal time
                  </span>
                  {reminder.details && <p>{reminder.details}</p>}
                  {reminder.repeat !== "none" && (
                    <small>{repeatLabels[reminder.repeat]}</small>
                  )}
                </div>
                <div className="expense-row-actions">
                  <button
                    className="plain-action"
                    onClick={() => editReminder(reminder)}
                    type="button"
                  >
                    Edit
                  </button>
                  <button
                    className="plain-action danger-action"
                    disabled={busy}
                    onClick={() => runAction(deleteReminder, reminder.id)}
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
