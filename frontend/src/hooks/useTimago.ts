import {useEffect, useState} from 'react';

import {DEFAULT_LANGUAGE} from '@config/constants';

import {formatDate} from './useDateTimeFormat';

const isRelativeTimeFormatSupported = typeof Intl !== 'undefined' && Intl.RelativeTimeFormat;

type DateUnit = 'day' | 'hour' | 'minute' | 'second';

type DateDiff =
  | {
      value: number;
      unit: DateUnit;
    }
  | undefined;

const DATE_UNITS: Array<[DateUnit, number]> = [
  ['day', 86400],
  ['hour', 3600],
  ['minute', 60],
  ['second', 1],
];

const getDateDiffs = (timestamp: number): DateDiff => {
  const now = Date.now();
  const elapsed = (timestamp - now) / 1000;

  for (const [unit, secondsInUnit] of DATE_UNITS) {
    if (Math.abs(elapsed) > secondsInUnit || unit === 'second') {
      const value = Math.round(elapsed / secondsInUnit);
      return {value, unit};
    }
  }
  return undefined;
};

export default function useTimeAgo(timestamp: number): string {
  const [timeago, setTimeago] = useState<DateDiff>(() => getDateDiffs(timestamp));

  useEffect(() => {
    if (isRelativeTimeFormatSupported) {
      const interval = setInterval(() => {
        const newTimeAgo = getDateDiffs(timestamp);
        setTimeago(newTimeAgo);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [timestamp]);

  if (!isRelativeTimeFormatSupported) {
    return formatDate(timestamp);
  }

  const rtf = new Intl.RelativeTimeFormat('es', {style: 'short'});

  if (!timeago) {
    return formatDate(timestamp);
  }

  if (timeago.value < -8 && timeago.unit === 'day') {
    return new Date(timestamp).toLocaleDateString(DEFAULT_LANGUAGE, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } else {
    return rtf.format(timeago.value, timeago.unit);
  }
}
