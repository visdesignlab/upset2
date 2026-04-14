const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;
const YEAR_MS = 365.25 * DAY_MS;

const yearFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  timeZone: 'UTC',
});
const monthYearFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});
const dateFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});
const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'UTC',
});
const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
  timeZone: 'UTC',
});

function isStartOfUtcYear(value: number) {
  const date = new Date(value);
  return (
    date.getUTCMonth() === 0 &&
    date.getUTCDate() === 1 &&
    date.getUTCHours() === 0 &&
    date.getUTCMinutes() === 0 &&
    date.getUTCSeconds() === 0 &&
    date.getUTCMilliseconds() === 0
  );
}

function isStartOfUtcDay(value: number) {
  const date = new Date(value);
  return (
    date.getUTCHours() === 0 &&
    date.getUTCMinutes() === 0 &&
    date.getUTCSeconds() === 0 &&
    date.getUTCMilliseconds() === 0
  );
}

function getDateFormatter(domain: [number, number]) {
  const [min, max] = domain;
  const span = Math.abs(max - min);

  if (isStartOfUtcYear(min) && isStartOfUtcYear(max)) return yearFormatter;
  if (isStartOfUtcDay(min) && isStartOfUtcDay(max) && span >= YEAR_MS / 2) {
    return monthYearFormatter;
  }
  if (isStartOfUtcDay(min) && isStartOfUtcDay(max)) return dateFormatter;
  if (span >= DAY_MS * 30) return dateFormatter;
  if (span >= MINUTE_MS) return dateTimeFormatter;
  return timeFormatter;
}

export function createDateTickFormatter(domain: [number, number]) {
  const formatter = getDateFormatter(domain);
  return (value: number) => formatter.format(new Date(value));
}

export function formatDateValue(
  value: number | undefined,
  domain: [number, number],
): string {
  if (value === undefined || Number.isNaN(value)) return 'N/A';
  return createDateTickFormatter(domain)(value).toString();
}
