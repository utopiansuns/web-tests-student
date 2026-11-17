const DEFAULT_BASE_URL = 'https://testboard.avito.com';

export const environment = {
  baseURL: (process.env.BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, ''),
};
