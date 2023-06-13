export const isValidDate = (value: string) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(value)) {
    return false;
  }

  const date = new Date(value);
  return !isNaN(date.getTime());
};

export const isEmpty = (value: string | null | undefined | unknown[]) => value === '' || value === null || value === undefined || value.length === 0;

export const getFormattedDay = (date: Date) => {
  const day = date.getDate();
  if (day < 10) return day.toString().padStart(2, '0');
  return day;
};

export const getFormattedMonth = (date: Date) => {
  const month = date.getMonth();

  if (month < 10) return month.toString().padStart(2, '0');
  return month;
};
