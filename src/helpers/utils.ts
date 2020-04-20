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
