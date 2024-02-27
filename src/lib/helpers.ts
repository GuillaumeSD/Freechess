export const getPaddedMonth = (month: number) => {
  return month < 10 ? `0${month}` : month;
};

export const capitalize = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};
