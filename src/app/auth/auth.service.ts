import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import User from './user.model';

const apiKey = 'AIzaSyAO8Lc-G0l7XhyN3AE1jrn39ClqYl-g3rM';

export interface AuthRespData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userSubj = new BehaviorSubject<User>(null);
  tokenExpTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  signup(email: string, password: string) {
    return this.http
      .post<AuthRespData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
          apiKey,
        { email: email, password: password, returnSecureToken: true }
      )
      .pipe(
        catchError(this.handleErrors),
        tap((respData) => {
          this.handleAuthentication(
            respData.email,
            respData.localId,
            respData.idToken,
            +respData.expiresIn
          );
        })
      );
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpDate: string;
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) return;

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpDate)
    );

    if (loadedUser.token) {
      this.userSubj.next(loadedUser);
      const expTime =
        new Date(userData._tokenExpDate).getTime() - new Date().getTime();
      this.autoLogout(expTime);
    }
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthRespData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
          apiKey,
        { email: email, password: password, returnSecureToken: true }
      )
      .pipe(
        catchError(this.handleErrors),
        tap((respData) => {
          this.handleAuthentication(
            respData.email,
            respData.localId,
            respData.idToken,
            +respData.expiresIn
          );
        })
      );
  }

  logout() {
    if (this.tokenExpTimer) clearTimeout(this.tokenExpTimer);
    this.tokenExpTimer = null;
    localStorage.removeItem('userData');
    this.userSubj.next(null);
    this.router.navigate(['/auth']);
  }

  autoLogout(expTime: number) {
    console.log(expTime);
    this.tokenExpTimer = setTimeout(() => {
      this.logout();
    }, expTime);
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expDate);
    this.userSubj.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleErrors(errorResp: HttpErrorResponse) {
    let errMsg = 'An unknown error occured!';
    if (!errorResp.error || !errorResp.error.error) {
      return throwError(errMsg);
    }
    switch (errorResp.error.error.message) {
      case 'EMAIL_EXISTS':
        errMsg = 'Email already in use by another account';
        break;
      case 'EMAIL_NOT_FOUND':
        errMsg = 'Email does not exist!';
        break;
      case 'INVALID_PASSWORD':
        errMsg = 'Invallid password';
        break;
    }
    return throwError(errMsg);
  }
}
