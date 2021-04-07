import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() {}

  public isEmpty(object: object): boolean {
    return Object.keys(object).length === 0;
  }
}
