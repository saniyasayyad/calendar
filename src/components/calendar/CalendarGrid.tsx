import { useMemo, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Maximize, Minimize } from "lucide-react";
import DayCell from "./DayCell";
import {
  getCalendarDays,
  getHolidays,
  isInRange,
  isRangeStart,
  isRangeEnd,
  isSameMonth,
  isSameDay,
  format,
  addMonths,
  subMonths,
  isWeekend,
  dateHasNote,
  type CalendarNote,
} from "@/lib/calendar-utils";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface CalendarGridProps {
  currentMonth: Date;
  onMonthChange: (month: Date) => void;
  rangeStart: Date | null;
  rangeEnd: Date | null;
  onDayClick: (day: Date) => void;
  notes: CalendarNote[];
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onGoToToday: () => void;
}

export default function CalendarGrid({
  currentMonth,
  onMonthChange,
  rangeStart,
  rangeEnd,
  onDayClick,
  notes,
  isFullscreen,
  onToggleFullscreen,
  onGoToToday,
}: CalendarGridProps) {
  const [hoveredDay, setHoveredDay] = useState<Date | null>(null);
  const [flipKey, setFlipKey] = useState(0);

  const today = useMemo(() => new Date(), []);
  const days = useMemo(() => getCalendarDays(currentMonth), [currentMonth]);
  const holidays = useMemo(
    () => getHolidays(currentMonth.getFullYear()),
    [currentMonth]
  );

  // When user has selected start but not end, use hover as preview end
  const effectiveEnd = rangeEnd ?? (rangeStart && hoveredDay ? hoveredDay : null);

  const navigate = useCallback(
    (dir: 1 | -1) => {
      setFlipKey((k) => k + 1);
      onMonthChange(dir === 1 ? addMonths(currentMonth, 1) : subMonths(currentMonth, 1));
    },
    [currentMonth, onMonthChange]
  );

  return (
    <div className="flex flex-col">
      {/* Month navigation header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-heading font-semibold text-foreground tracking-wide">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <button
            onClick={onGoToToday}
            className="px-3 py-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            aria-label="Go to today"
          >
            Today
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(1)}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
          <button
            onClick={onToggleFullscreen}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <Minimize className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Maximize className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Day grid with flip animation */}
      <div key={flipKey} className="grid grid-cols-7 gap-0.5 calendar-flip">
        {days.map((day) => {
          const dateKey = format(day, "yyyy-MM-dd");
          const holiday = holidays.get(dateKey);
          return (
            <DayCell
              key={dateKey}
              day={day}
              dayNumber={day.getDate()}
              isCurrentMonth={isSameMonth(day, currentMonth)}
              isToday={isSameDay(day, today)}
              isWeekendDay={isWeekend(day)}
              isHoliday={!!holiday}
              holidayName={holiday}
              isSelected={
                (rangeStart && isSameDay(day, rangeStart)) ||
                (rangeEnd && isSameDay(day, rangeEnd)) ||
                false
              }
              isRangeStart={isRangeStart(day, rangeStart, effectiveEnd)}
              isRangeEnd={isRangeEnd(day, rangeStart, effectiveEnd)}
              isInRange={isInRange(day, rangeStart, effectiveEnd)}
              hasNote={dateHasNote(notes, day)}
              onClick={onDayClick}
              onMouseEnter={setHoveredDay}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 text-xs text-muted-foreground font-body">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-calendar-today" /> Today
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-calendar-holiday" /> Holiday
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-calendar-note-indicator" /> Has Note
        </span>
      </div>
    </div>
  );
}
