import moment from "moment";

const greetingsTimeline = [
  { startHour: 5, endHour: 12, text: "Good morning" },
  { startHour: 12, endHour: 17, text: "Good afternoon" },
  { startHour: 17, endHour: 22, text: "Good evening" },
  { startHour: 22, endHour: 5, text: "Good night" },
];

export function getGreeting() {
  const currentHour = new Date().getHours();

  const match = greetingsTimeline.find((timeSlot) => {
    if (timeSlot.startHour < timeSlot.endHour) {
      return (
        currentHour >= timeSlot.startHour && currentHour < timeSlot.endHour
      );
    } else {
      return (
        currentHour >= timeSlot.startHour || currentHour < timeSlot.endHour
      );
    }
  });

  return match ? match.text : "Welcome";
}

export const currentDate =
  `${moment().format("dddd")}, ${moment().format("LL")}`.toUpperCase();

export function formatLastSeen(
  lastSeenDate: Date | string | number,
  timeZone: string = "UTC",
): string {
  const now = new Date();
  const targetDate = new Date(lastSeenDate);

  if (isNaN(targetDate.getTime())) {
    return "not counted";
  }

  const diffInSeconds = Math.floor(
    (now.getTime() - targetDate.getTime()) / 1000,
  );

  if (diffInSeconds < 60) {
    return "Online now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);

  if (diffInMinutes < 60) {
    return diffInMinutes === 1
      ? "1 minute ago"
      : `${diffInMinutes} minutes ago`;
  }

  if (diffInHours < 24) {
    return diffInHours === 1 ? "1 hour ago" : `${diffInHours} hours ago`;
  }

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  const yesterdayDate = new Date(now);
  yesterdayDate.setDate(now.getDate() - 1);

  const yesterdayFormatted = formatter.format(yesterdayDate);
  const targetFormatted = formatter.format(targetDate);

  if (targetFormatted === yesterdayFormatted) {
    return "Yesterday";
  }

  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  }

  return new Intl.DateTimeFormat("en-US", {
    timeZone: timeZone,
    dateStyle: "medium",
  }).format(targetDate);
}
