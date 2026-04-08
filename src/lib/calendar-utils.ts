import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  format,
  addMonths,
  subMonths,
  isWeekend,
} from "date-fns";

/** US federal holidays (static dates only for simplicity) */
export function getHolidays(year: number): Map<string, string> {
  const holidays = new Map<string, string>();
  holidays.set(`${year}-01-01`, "New Year's Day");
  holidays.set(`${year}-02-14`, "Valentine's Day");
  holidays.set(`${year}-07-04`, "Independence Day");
  holidays.set(`${year}-10-31`, "Halloween");
  holidays.set(`${year}-12-25`, "Christmas");
  holidays.set(`${year}-12-31`, "New Year's Eve");
  return holidays;
}

export function getCalendarDays(month: Date) {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 0 });
  return eachDayOfInterval({ start, end });
}

export function isInRange(day: Date, rangeStart: Date | null, rangeEnd: Date | null): boolean {
  if (!rangeStart || !rangeEnd) return false;
  const [start, end] = rangeStart <= rangeEnd ? [rangeStart, rangeEnd] : [rangeEnd, rangeStart];
  return isWithinInterval(day, { start, end });
}

export function isRangeStart(day: Date, rangeStart: Date | null, rangeEnd: Date | null): boolean {
  if (!rangeStart) return false;
  if (!rangeEnd) return isSameDay(day, rangeStart);
  const start = rangeStart <= rangeEnd ? rangeStart : rangeEnd;
  return isSameDay(day, start);
}

export function isRangeEnd(day: Date, rangeStart: Date | null, rangeEnd: Date | null): boolean {
  if (!rangeStart || !rangeEnd) return false;
  const end = rangeStart <= rangeEnd ? rangeEnd : rangeStart;
  return isSameDay(day, end);
}

export interface CalendarNote {
  id: string;
  text: string;
  rangeStart: string; // ISO date string
  rangeEnd: string;
  createdAt: string;
}

const STORAGE_KEY = "wall-calendar-notes";

export function loadNotes(): CalendarNote[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveNotes(notes: CalendarNote[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export function getNotesForDate(notes: CalendarNote[], date: Date): CalendarNote[] {
  return notes.filter((n) => {
    const s = new Date(n.rangeStart);
    const e = new Date(n.rangeEnd);
    const [start, end] = s <= e ? [s, e] : [e, s];
    return isWithinInterval(date, { start, end }) || isSameDay(date, start) || isSameDay(date, end);
  });
}

export function dateHasNote(notes: CalendarNote[], date: Date): boolean {
  return getNotesForDate(notes, date).length > 0;
}

export { isSameMonth, isSameDay, format, addMonths, subMonths, isWeekend };
