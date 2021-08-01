import {HttpParams} from '@angular/common/http';

export function paramsBuilder(object: object): HttpParams {
  let params = new HttpParams();
  for (const key in object) {
    if (object.hasOwnProperty(key)
      && object[key as keyof object] !== null
      && object[key as keyof object] !== undefined
      && object[key as keyof object] !== '') {
      params = params.set(key, object[key as keyof object] as any);
    }
  }
  return params;
}
