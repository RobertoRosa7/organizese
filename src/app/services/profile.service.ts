import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from './constants';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private http: HttpClient, private constants: Constants) {}

  public profileUpdate(payload: any): Observable<any> {
    return this.http.post<any>(this.constants.get('profile_update'), payload);
  }

  public profileGet(): Observable<any> {
    return this.http.get<any>(this.constants.get('profile_get'));
  }

  public profileDeleteUser(payload: any): Observable<any> {
    return this.http.delete(
      `${this.constants.get('profile_delete')}/${payload._id}`
    );
  }
}
