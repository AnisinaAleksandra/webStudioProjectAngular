import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DefaultResponseType } from 'src/types/defaultReasponse.type';
import { LoginResponseType } from 'src/types/loginReasponse.type';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public accsessTokenKey: string = 'accessToken';
  public refreshTokenKey: string = 'refreshToken';
  public email: string = 'email';
  public name: string = 'name';
  public userIdKey: string = 'userId';

  public isLogged$: Subject<boolean> = new Subject<boolean>();
  private isLogged: boolean = false;

  constructor(private http: HttpClient) {
    this.isLogged = !!localStorage.getItem(this.accsessTokenKey);
  }
  login(
    email: string,
    password: string,
    rememberMe: boolean
  ): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(
      environment.api + 'login',
      {
        email,
        password,
        rememberMe,
      }
    );
  }

  signUp(
    name: string,
    email: string,
    password: string
  ): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(
      environment.api + 'signup',
      {
        name,
        email,
        password,
      }
    );
  }
  logout(): Observable<DefaultResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType>(environment.api + 'logout', {
        refreshToken: tokens.refreshToken,
      });
    }
    throw throwError(() => 'Can not find token');
  }
  getUserInfo() {
    return this.http.get<DefaultResponseType | { id: string; name: string; email: string }>(environment.api + 'users');
  }
  public getIsLoggedIn() {
    return !this.isLogged$;
  }

  public setTockens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accsessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    this.isLogged = true;
    this.isLogged$.next(this.isLogged);
  }
public setUserInfo( name: string, email: string ){
  localStorage.setItem(this.name, name);
  localStorage.setItem(this.email, email);
}

public removeUserInfo(){
  localStorage.removeItem(this.name);
  localStorage.removeItem(this.email);
}
  public removeTokens(): void {
    localStorage.removeItem(this.accsessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isLogged = false;
    this.isLogged$.next(this.isLogged);
  }

  public getTokens() {
    return {
      accessToken: localStorage.getItem(this.accsessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey),
    };
  }

  get userId(): null | string {
    return localStorage.getItem(this.userIdKey);
  }

  set userId(id: string | null) {
    if (id) {
      localStorage.setItem(this.userIdKey, id);
    } else {
      localStorage.removeItem(this.userIdKey);
    }
  }

  refresh(): Observable<DefaultResponseType | LoginResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType | LoginResponseType>(
        environment.api + 'refresh',
        {
          refreshToken: tokens.refreshToken,
        }
      );
    }
    throw throwError(() => 'Can not use token');
  }
}
