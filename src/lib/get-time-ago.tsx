import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import 'dayjs/locale/es-mx';
dayjs.locale('es-mx');
dayjs.extend(relativeTime);

export const getTimeAgo = (value: Date | string): string => {
  if (!value) return '';
  return dayjs(value).fromNow();
};
