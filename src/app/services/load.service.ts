import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadService {
  private httpLoading$ = new ReplaySubject<boolean>(1);

  constructor() {}

  public httpProgress(): Observable<boolean> {
    return this.httpLoading$.asObservable();
  }

  public setHttpProgressStatus(inprogress: boolean): void {
    this.httpLoading$.next(inprogress);
  }
}
