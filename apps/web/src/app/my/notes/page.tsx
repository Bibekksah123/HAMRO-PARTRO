import type { Metadata } from "next";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { notes } from "@merodin/db";
import { NoteManager } from "@/components/note-manager";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { createDatabase } from "@/lib/db";
import { createPageMetadata } from "@/lib/page-metadata";
import { requireCurrentUser } from "@/lib/supabase/current-user";

export const metadata: Metadata = createPageMetadata({
  title: "My Notes",
  description: "Create and search your private MeroDin notes.",
  noIndex: true,
});
export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const user = await requireCurrentUser();
  const rows = await createDatabase()
    .select()
    .from(notes)
    .where(eq(notes.userId, user.id))
    .orderBy(desc(notes.pinned), desc(notes.updatedAt))
    .limit(200);

  return (
    <>
      <SiteHeader />
      <main id="main" className="page-shell">
        <div className="page-content">
          <p className="section-kicker">
            <Link href="/my">My Space</Link> / Thoughts
          </p>
          <h1 className="page-title">Notes</h1>
          <p className="page-description">
            A small private place for lists, ideas, and details you want to
            keep.
          </p>
          <NoteManager
            notes={rows.map((note) => ({
              id: note.id,
              title: note.title,
              content: note.content,
              pinned: note.pinned,
              updatedAt: note.updatedAt.toISOString(),
            }))}
          />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
