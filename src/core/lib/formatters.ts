export function formatSecondsToHHMMSS(totalSeconds: number | null | undefined): string {
  if (totalSeconds === undefined || totalSeconds === null) {
    return "--";
  }

  const secondsInt = Math.floor(totalSeconds);

  const hours = Math.floor(secondsInt / 3600);
  const minutes = Math.floor((secondsInt % 3600) / 60);
  const seconds = secondsInt % 60;

  const pad = (num: number) => num.toString().padStart(2, "0");

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function formatSmartDuration(totalSeconds: number | null | undefined): string {
  if (totalSeconds === undefined || totalSeconds === null) return "--";

  const secondsInt = Math.floor(totalSeconds);
  const hours = Math.floor(secondsInt / 3600);
  const minutes = Math.floor((secondsInt % 3600) / 60);
  const seconds = secondsInt % 60;

  const pad = (num: number) => num.toString().padStart(2, "0");

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
}