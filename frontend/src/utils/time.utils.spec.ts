import { durationStringToObj } from './time.utils';

describe('Time utils', () => {
  beforeEach(() => {});

  it('should be created', () => {
    expect(durationStringToObj).toBeTruthy();
  });

  it('should return duration obj from string', () => {
    const hours = 1;
    const minutes = 59;
    const seconds = 0;
    const durationString = `0${hours}:${minutes}:${seconds}`;

    const obj = durationStringToObj(durationString);
    expect(obj.hours).toEqual(hours);
    expect(obj.minutes).toEqual(minutes);
    expect(obj.seconds).toEqual(seconds);
  });
});
