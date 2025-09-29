export const capitalize = (str: string): string =>
  str.charAt(0).toLocaleUpperCase() + str.slice(1);

export const removeAccents = (str: string): string =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export const normalize = (str: string): string =>
  removeAccents(str).toLocaleLowerCase();