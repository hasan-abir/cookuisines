export const durationStringToObj: (duration: string) => {
  hours: number;
  minutes: number;
  seconds: number;
} = (duration) => {
  const [hours, minutes, seconds] = duration
    .split(':')
    .map((time) => parseInt(time, 10));

  return { hours, minutes, seconds };
};
