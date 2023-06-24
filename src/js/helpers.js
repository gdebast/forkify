import { async } from 'regenerator-runtime';
import { API_TIMEOUT_SEC } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, data = undefined) {
  const response = await Promise.race([
    data
      ? fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
      : fetch(url),
    timeout(API_TIMEOUT_SEC),
  ]);
  const dataBack = await response.json();
  if (!response.ok) throw new Error(`${dataBack.message}`);
  return dataBack;
};
