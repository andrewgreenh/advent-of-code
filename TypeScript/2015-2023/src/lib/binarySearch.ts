interface SearchConfig {
  /**
   * Defaults to 0
   */
  min?: number;
  /**
   * Upper bound. max Value itself will never be the result itself
   * e.g. in an array, you can pass in array.length as max value
   */
  max: number;

  /**
   * Return null when no more halves are between two items
   * This ends the search
   *
   * defaults to: (min, max) => (max - min === 1) ? null : Math.floor((max + min) / 2)
   **/
  getHalf?: (min: number, max: number) => number | null;

  /**
   * Return true if target is below given number.
   * Return false if target is SAME OR ABOVE given number
   */
  isBelow: (num: number) => boolean;
}

export function binarySearch(config: SearchConfig): number {
  let {
    min = 0,
    max,
    isBelow,
    getHalf = function defaultHalf(min, max) {
      if (max - min === 1) return null;
      return Math.floor((max + min) / 2);
    },
  } = config;

  let half: number | null;
  while ((half = getHalf(min, max))) {
    if (isBelow(half)) max = half;
    else min = half;
  }
  return min;
}
