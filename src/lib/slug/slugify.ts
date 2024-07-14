import crypto from 'crypto';
// import { stopEn } from './stop-en';
// import { stopEs } from './stop-es';

interface OptionsProps {
  maxLen: number;
  joinString: '-' | '_';
}

export function slugify(string: string, options: OptionsProps = { maxLen: 100, joinString: '-' }) {
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìıİłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------';
  const p = new RegExp(a.split('').join('|'), 'g');
  // const checkBW = new RegExp([...stopEn, ...stopEs].join('|'), 'g');
  let w = string
    .toString()
    .toLowerCase()
    .replace(/\s+/g, options.joinString) // Replace spaces with -
    .replace(p, (c) => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    // .replace(checkBW, '') // Replace stop words (locale es, en)
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
  // Truncate in excess of maxLen
  if (w.length > options.maxLen) w = w.substring(0, options.maxLen);
  return w + '-' + crypto.randomBytes(3).toString('hex');
}
