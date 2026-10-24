const EASTERN = "America/Toronto";

/** "Monday, Oct 12 at 4:00 PM ET" (offer deadlines are always shown in Eastern time). */
export function formatOfferDeadline(date: Date | string): string {
  const value = typeof date === "string" ? new Date(date) : date;
  const day = value.toLocaleDateString("en-US", {
    timeZone: EASTERN,
    weekday: "long",
    month: "short",
    day: "numeric",
  });
  const time = value.toLocaleTimeString("en-US", {
    timeZone: EASTERN,
    hour: "numeric",
    minute: "2-digit",
  });
  return `${day} at ${time} ET`;
}

/** First word of a full name, for email greetings. */
export function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? fullName;
}

/** "A", "A and B", "A, B and C". */
export function joinNames(names: readonly string[]): string {
  if (names.length <= 1) return names[0] ?? "";
  return `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;
}
