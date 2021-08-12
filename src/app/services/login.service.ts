import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../models/models';
import { Constants } from './constants';
import { IndexdbService } from '../services/indexedbs.service';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import * as actionsLogin from '../actions/login.actions';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private user$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private loggedIn$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  constructor(
    private http: HttpClient,
    private constants: Constants,
    private indexedb: IndexdbService,
    private store: Store,
    private route: Router
  ) {}

  public signup(payload: User): Observable<User> {
    return this.http.post<User>(this.constants.get('signup'), payload);
  }

  public signin(payload: any): Observable<any> {
    const authorization = {
      Authorization: `${btoa(payload.email)}:${btoa(payload.password)}`,
    };
    return this.http
      .get<any>(this.constants.get('signin'), { headers: authorization })
      .pipe(
        tap((user: any) => {
          if (user) {
            if (payload.keep_connect) {
              localStorage.setItem('token', user.access_token);
              localStorage.setItem('user', JSON.stringify(user));
              this.loggedIn$.next(true);
              this.user$.next(user);
            } else {
              sessionStorage.setItem('token', user.access_token);
              sessionStorage.setItem('user', JSON.stringify(user));
              this.loggedIn$.next(true);
              this.user$.next(user);
            }
          }
        })
      );
  }

  public fetchToken(): string | null {
    if (localStorage.getItem('token')) {
      return localStorage.getItem('token');
    } else if (sessionStorage.getItem('token')) {
      return sessionStorage.getItem('token');
    } else {
      return null;
    }
  }

  public isAuthenticated(): Observable<boolean> {
    if (this.fetchToken()) {
      this.loggedIn$.next(true);
    }
    return this.loggedIn$.asObservable();
  }

  private getUser(): void {
    if (localStorage.getItem('user')) {
      this.user$.next(JSON.parse(localStorage.getItem('user') || '{}'));
    } else if (sessionStorage.getItem('user')) {
      this.user$.next(JSON.parse(sessionStorage.getItem('user') || '{}'));
    } else {
      this.user$.next(null);
    }
  }

  public fetchUser(): Observable<any> {
    this.getUser();
    return this.user$.asObservable();
  }

  public logout(): Observable<any> {
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');

    this.indexedb.clearStore();

    this.user$.next(null);
    this.loggedIn$.next(false);

    return this.loggedIn$.asObservable();
  }

  public loginVerified(payload: any): Observable<any> {
    return this.http.post<any>(this.constants.get('login_verified'), payload);
  }

  public resetPassword(payload: any): Observable<any> {
    const authorization = {
      Authorization: `${btoa(payload.password)}:access:${payload.token}`,
    };
    return this.http.get<any>(this.constants.get('reset_password'), {
      headers: authorization,
    });
  }

  public mailToReset(payload: any): Observable<any> {
    return this.http.post<any>(this.constants.get('email_to_reset'), payload);
  }

  public sessionIsOver(): void {
    this.store.dispatch(actionsLogin.LOGOUT());
    this.route.navigateByUrl('/home');
  }
}
