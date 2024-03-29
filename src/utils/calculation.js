function invalidValue(v) {
  return v === null || v === undefined;
}

export function dateTime(v, getDate = false) {
  if (v) {
    const date = new Date(Number(v));
    const Y = date.getFullYear();
    const M = (date.getMonth() + 1).toString().padStart(2, '0');
    const D = date.getDate().toString().padStart(2, '0');
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    const s = date.getSeconds().toString().padStart(2, '0');
    if (getDate) return `${Y}-${M}-${D}`;
    return `${Y}-${M}-${D} ${h}:${m}:${s}`;
  }
  return '--';
}

export function floatFixed(v, num) {
  if (invalidValue(v)) return '';
  return Number(v).toFixed(num);
}

export function currencies(v) {
  if (invalidValue(v)) return '';
  v = Number(v);
  v = Math.round(v / 100);
  const reg = /\B(?=(\d{3})+(?!\d))/g;
  v = (v).toString().replace(reg, ',');
  return v;
}

export function formatStringDate(stringDate) {
  stringDate = stringDate.toString();
  const year = stringDate.slice(0, 4);
  const month = stringDate.slice(4, 6);
  const date = stringDate.slice(6, 8);
  return `${year}/${month}/${date}`;
}
