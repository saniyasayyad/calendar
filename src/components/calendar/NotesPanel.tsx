import { useState } from "react";
import { Plus, Trash2, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { type CalendarNote } from "@/lib/calendar-utils";
import { cn } from "@/lib/utils";

interface NotesPanelProps {
  notes: CalendarNote[];
  rangeStart: Date | null;
  rangeEnd: Date | null;
  onAddNote: (text: string) => void;
  onDeleteNote: (id: string) => void;
  onNoteClick: (date: Date) => void;
}

export default function NotesPanel({
  notes,
  rangeStart,
  rangeEnd,
  onAddNote,
  onDeleteNote,
  onNoteClick,
}: NotesPanelProps) {
  const [text, setText] = useState("");

  const hasRange = rangeStart !== null;

  const formatRange = () => {
    if (!rangeStart) return "";
    const start = rangeStart;
    const end = rangeEnd ?? rangeStart;
    const [s, e] = start <= end ? [start, end] : [end, start];
    if (s.getTime() === e.getTime()) return format(s, "MMM d, yyyy");
    return `${format(s, "MMM d")} – ${format(e, "MMM d, yyyy")}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !hasRange) return;
    onAddNote(text.trim());
    setText("");
  };

  // Filter notes relevant to current month view
  const sortedNotes = [...notes].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="flex flex-col h-full bg-notes-bg rounded-xl p-5">
      <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
        Notes
      </h3>

      {/* Add note form */}
      <form onSubmit={handleSubmit} className="mb-4">
        {hasRange && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 slide-down">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>{formatRange()}</span>
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={hasRange ? "Add note for selected dates…" : "Select dates first…"}
            disabled={!hasRange}
            className={cn(
              "flex-1 px-3 py-2 text-sm rounded-lg border bg-card text-foreground",
              "placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-all duration-200"
            )}
          />
          <button
            type="submit"
            disabled={!hasRange || !text.trim()}
            className={cn(
              "p-2 rounded-lg bg-primary text-primary-foreground",
              "hover:opacity-90 transition-opacity",
              "disabled:opacity-40 disabled:cursor-not-allowed"
            )}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
        {sortedNotes.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No notes yet. Select a date range and add one!
          </p>
        ) : (
          sortedNotes.map((note) => {
            const s = new Date(note.rangeStart);
            const e = new Date(note.rangeEnd);
            const [start, end] = s <= e ? [s, e] : [e, s];
            const label =
              start.getTime() === end.getTime()
                ? format(start, "MMM d")
                : `${format(start, "MMM d")} – ${format(end, "MMM d")}`;

            return (
              <div
                key={note.id}
                onClick={() => onNoteClick(start)}
                className="group flex items-start gap-3 p-3 rounded-lg bg-card card-shadow slide-down cursor-pointer hover:bg-card/80 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground leading-relaxed">
                    {note.text}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{label}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteNote(note.id);
                  }}
                  className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-destructive/10 transition-all"
                  aria-label="Delete note"
                >
                  <Trash2 className="w-3.5 h-3.5 text-destructive" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
