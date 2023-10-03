export const range = (start: number, end: number) => {
  const isAscending = start < end;
  const step = isAscending ? 1 : -1;
  return Array.from(
    { length: Math.abs(end - start) + 1 },
    (_, i) => start + step * i,
  );
};
