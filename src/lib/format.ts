const dateTimeFormatter = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

/** Format a date consistently (server and client) as e.g. "11 Jul 2026, 00:15". */
export function formatDateTime(date: Date): string {
  return dateTimeFormatter.format(date)
}
