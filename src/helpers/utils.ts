import { RouterDirection } from '@ionic/core';

export function sayHello() {
  return Math.random() < 0.5 ? 'Hello' : 'Hola';
}

export interface ParamsObject {
  [key: string]: string;
}

export function paramsEncode(paramsObject: ParamsObject) {
  const params = new URLSearchParams();
  Object.keys(paramsObject).forEach(key => {
    const value = paramsObject[key];
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
  });
  const searchString = params.toString();
  return searchString ? `?${searchString}` : "";
}

export function paramsDecode(search: string): ParamsObject {
  if (!search || typeof search !== "string") {
    return {};
  }
  const params = new URLSearchParams(search);
  let paramsObject: ParamsObject = {};
  params.forEach((value, key) => paramsObject[key] = value);
  return paramsObject;
}

/* taken from: https://github.com/ionic-team/ionic/blob/master/core/src/utils/theme.ts#L34-L47 */
const SCHEME = /^[a-z][a-z0-9+\-.]*:/;

export const openURL = async (url: string | undefined | null, ev: Event | undefined | null, direction: RouterDirection): Promise<boolean> => {
  if (url != null && url[0] !== '#' && !SCHEME.test(url)) {
    const router = document.querySelector('ion-router');
    if (router) {
      if (ev != null) {
        ev.preventDefault();
      }
      return router.push(url, direction);
    }
  }
}
