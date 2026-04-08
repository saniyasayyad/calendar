import { useState, useCallback, useEffect } from "react";
import HeroSection from "./HeroSection";
import CalendarGrid from "./CalendarGrid";
import NotesPanel from "./NotesPanel";
import {
  format,
  loadNotes,
  saveNotes,
  type CalendarNote,
} from "@/lib/calendar-utils";

export default function WallCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [notes, setNotes] = useState<CalendarNote[]>(loadNotes);
  const [selectingEnd, setSelectingEnd] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Persist notes
  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  /**
   * Date range selection logic:
   * - First click: sets start date, enters "selecting end" mode
   * - Second click: sets end date, exits selection mode
   * - Clicking again resets and starts new selection
   */
  const handleDayClick = useCallback(
    (day: Date) => {
      if (!selectingEnd) {
        // First click — set start
        setRangeStart(day);
        setRangeEnd(null);
        setSelectingEnd(true);
      } else {
        // Second click — set end
        setRangeEnd(day);
        setSelectingEnd(false);
      }
    },
    [selectingEnd]
  );

  const handleAddNote = useCallback(
    (text: string) => {
      if (!rangeStart) return;
      const start = rangeStart;
      const end = rangeEnd ?? rangeStart;

      const note: CalendarNote = {
        id: crypto.randomUUID(),
        text,
        rangeStart: format(start, "yyyy-MM-dd"),
        rangeEnd: format(end, "yyyy-MM-dd"),
        createdAt: new Date().toISOString(),
      };
      setNotes((prev) => [...prev, note]);
    },
    [rangeStart, rangeEnd]
  );

  const handleDeleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Desktop: 3-column | Mobile: stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr_1fr] gap-6 lg:gap-8">
          {/* Hero image */}
          <div className="lg:row-span-1">
            <HeroSection currentMonth={currentMonth} />
          </div>

          {/* Calendar grid */}
          <div className="bg-card rounded-xl calendar-shadow p-6">
            <CalendarGrid
              currentMonth={currentMonth}
              onMonthChange={setCurrentMonth}
              rangeStart={rangeStart}
              rangeEnd={selectingEnd ? null : rangeEnd}
              onDayClick={handleDayClick}
              notes={notes}
              isFullscreen={isFullscreen}
              onToggleFullscreen={toggleFullscreen}
            />
          </div>

          {/* Notes panel */}
          <div className="lg:max-h-[600px]">
            <NotesPanel
              notes={notes}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              onAddNote={handleAddNote}
              onDeleteNote={handleDeleteNote}
            />
          </div>
        </div>

        {/* Selection hint */}
        {selectingEnd && (
          <div className="mt-4 text-center">
            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-secondary px-4 py-2 rounded-full slide-down">
              <span className="w-2 h-2 rounded-full bg-primary pulse-glow" />
              Click another date to complete the range
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
