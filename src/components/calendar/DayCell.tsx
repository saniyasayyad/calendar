import { memo } from "react";
import { cn } from "@/lib/utils";

interface DayCellProps {
  day: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekendDay: boolean;
  isHoliday: boolean;
  holidayName?: string;
  isSelected: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isInRange: boolean;
  hasNote: boolean;
  onClick: (day: Date) => void;
  onMouseEnter: (day: Date) => void;
}

const DayCell = memo(function DayCell({
  day,
  dayNumber,
  isCurrentMonth,
  isToday,
  isWeekendDay,
  isHoliday,
  holidayName,
  isSelected,
  isRangeStart: isStart,
  isRangeEnd: isEnd,
  isInRange: inRange,
  hasNote,
  onClick,
  onMouseEnter,
}: DayCellProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(day)}
      onMouseEnter={() => onMouseEnter(day)}
      title={holidayName}
      className={cn(
        "relative flex flex-col items-center justify-center aspect-square rounded-lg day-cell-transition cursor-pointer select-none group",
        "text-sm font-body font-medium",
        // Base states
        !isCurrentMonth && "opacity-30",
        isCurrentMonth && !isSelected && !inRange && "hover:bg-calendar-hover",
        // Weekend styling
        isWeekendDay && isCurrentMonth && !isSelected && !inRange && "text-calendar-weekend",
        // Today indicator
        isToday && !isSelected && "ring-2 ring-calendar-today ring-inset",
        // Range styling — middle cells
        inRange && !isStart && !isEnd && "bg-calendar-range-bg",
        // Range endpoints
        (isStart || isEnd) && "bg-calendar-range text-primary-foreground",
        // Start gets left rounding, end gets right rounding
        isStart && inRange && "rounded-r-none",
        isEnd && inRange && "rounded-l-none",
        // Middle range cells: no rounding
        inRange && !isStart && !isEnd && "rounded-none",
        // Holiday dot
        isHoliday && isCurrentMonth && "font-semibold"
      )}
    >
      <span className="relative z-10">{dayNumber}</span>

      {/* Holiday dot */}
      {isHoliday && isCurrentMonth && (
        <span className={cn(
          "absolute bottom-1 w-1 h-1 rounded-full",
          isSelected ? "bg-primary-foreground" : "bg-calendar-holiday"
        )} />
      )}

      {/* Note indicator */}
      {hasNote && isCurrentMonth && (
        <span className={cn(
          "absolute top-1 right-1 w-1.5 h-1.5 rounded-full",
          isSelected ? "bg-primary-foreground" : "bg-calendar-note-indicator"
        )} />
      )}

      {/* Hover effect */}
      <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none bg-foreground/[0.03]" />
    </button>
  );
});

export default DayCell;
