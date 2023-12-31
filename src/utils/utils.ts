import { Transaction } from '../services/explorers/explorer';

const getTimeAgo = (date: string) => {
  let seconds = 0.0;
  if (date.length < 12) {
    seconds = (new Date().getTime() - new Date(Number(date) * 1000).getTime()) / 1000;
  } else {
    seconds = (new Date().getTime() - new Date(date).getTime()) / 1000;
  }

  if (seconds < 60) {
    return Math.round(seconds) + ' second' + (seconds === 1 ? '' : 's') + ' ago';
  }

  const minutes = seconds / 60;
  if (minutes < 60) {
    return Math.round(minutes) + ' minute' + (minutes === 1 ? '' : 's') + ' ago';
  }

  const hours = minutes / 60;
  if (hours < 24) {
    return Math.round(hours) + ' hour' + (hours === 1 ? '' : 's') + ' ago';
  }

  const days = hours / 24;
  return Math.round(days) + ' day' + (days === 1 ? '' : 's') + ' ago';
};

const getDateFromReceivedString = (receivedAt: string,) => {
  let timestamp = new Date();
  if (receivedAt === undefined) {
    return timestamp;
  }
  if (receivedAt.length < 12) {
    timestamp = new Date(Number(receivedAt)*1000);
  } else {
    timestamp = new Date(receivedAt);
  }
  return timestamp;
};

const getDateFromTransaction = (tx: Transaction,) => {
  // if (tx === undefined) {
  //   return new Date();
  // }
  return getDateFromReceivedString(tx.receivedAt);
};

const countAllTransactionPeriods = (
  address: string,
  transactions: Transaction[],
): {
  days: number;
  weeks: number;
  months: number;
} => {
  const uniqueDays: Set<string> = new Set();
  const uniqueWeeks: Set<string> = new Set();
  const uniqueMonths: Set<string> = new Set();

  transactions.forEach((transaction) => {
    if (!transaction.from || !transaction.to) return;
    if (transaction.from.toLowerCase() !== address.toLowerCase()) return;

    const timestamp = getDateFromTransaction(transaction);

    const year = timestamp.getFullYear();
    const month = timestamp.getMonth();
    const day = timestamp.getDate();
    const week = getWeekNumber(timestamp);

    uniqueDays.add(`${year}-${month}-${day}`);
    uniqueWeeks.add(`${year}-${week}`);
    uniqueMonths.add(`${year}-${month}`);
  });

  return {
    days: uniqueDays.size,
    weeks: uniqueWeeks.size,
    months: uniqueMonths.size,
  };
};

const countTransactionPeriods = (
  address: string,
  transactions: Transaction[],
  protocol: string,
  addresses: string[] = [],
): {
  days: number;
  weeks: number;
  months: number;
} => {
  addresses;
  address;
  protocol;
  const uniqueDays: Set<string> = new Set();
  const uniqueWeeks: Set<string> = new Set();
  const uniqueMonths: Set<string> = new Set();

  transactions.forEach((transaction) => {
    const timestamp = new Date(transaction.receivedAt);
    const year = timestamp.getFullYear();
    const month = timestamp.getMonth();
    const day = timestamp.getDate();
    const week = getWeekNumber(timestamp);

    uniqueDays.add(`${year}-${month}-${day}`);
    uniqueWeeks.add(`${year}-${week}`);
    uniqueMonths.add(`${year}-${month}`);
  });

  return {
    days: uniqueDays.size,
    weeks: uniqueWeeks.size,
    months: uniqueMonths.size,
  };
};

const getWeekNumber = (date: Date): string => {
  const year = date.getFullYear();
  const oneJan = new Date(year, 0, 1);
  const dayIndex = (date.getDay() + 6) % 7;
  const daysSinceFirstDay = Math.floor((date.getTime() - oneJan.getTime()) / 86400000);
  const weekIndex = Math.floor((daysSinceFirstDay + oneJan.getDay() - dayIndex) / 7);

  return `${year}-${weekIndex}`;
};

export { getTimeAgo, countTransactionPeriods, getWeekNumber, countAllTransactionPeriods, getDateFromTransaction, getDateFromReceivedString };
