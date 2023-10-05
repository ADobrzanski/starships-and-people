export const randomIn = (min: number, max: number) => {
  if (min > max) {
    const tmp = min;
    min = max;
    max = tmp;
  }

  return Math.floor(Math.random() * (max - min + 1) + min);
};
