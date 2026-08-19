const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

if (!configuredApiUrl) {
  throw new Error('VITE_API_URL must be defined in a frontend environment file.');
}

export const API_URL = configuredApiUrl.replace(/\/$/, '');
