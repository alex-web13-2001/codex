import { differenceInCalendarDays, format } from 'date-fns';

export const formatDate = (date?: string) => {
  if (!date) return 'No deadline';
  return format(new Date(date), 'dd MMM yyyy');
};

export const isOverdue = (date?: string) => {
  if (!date) return false;
  return differenceInCalendarDays(new Date(date), new Date()) < 0;
};
