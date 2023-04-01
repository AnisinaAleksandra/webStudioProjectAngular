import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { DefaultResponseType } from 'src/types/defaultReasponse.type';
import { LoginResponseType } from 'src/types/loginReasponse.type';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const tokens = this.authService.getTokens();
    if (tokens && tokens.accessToken) {
      const authReq = req.clone({
        headers: new HttpHeaders()
          .set('accept', 'application/json')
          .set('x-auth', tokens.accessToken),
      });
      return next.handle(authReq).pipe(
        catchError((error) => {
          if (
            error.status === 401 &&
            !authReq.url.includes('/login') &&
            !authReq.url.includes('/refresh')
          ) {
            return this.handle401Error(authReq, next);
          }
          return throwError(() => error);
        })
      );
    }
    return next.handle(req);
  }

  handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.refresh().pipe(
      switchMap((result: DefaultResponseType | LoginResponseType) => {
        let error = '';
        if ((result as DefaultResponseType).error !== undefined) {
          error = (result as DefaultResponseType).message;
        }
        const refreshResult = result as LoginResponseType;
        if (
          !refreshResult.accessToken ||
          !refreshResult.refreshToken ||
          !refreshResult.userId
        ) {
          error = 'Ошибка авторизации';
        }
        if (error) {
          return throwError(() => new Error(error));
        }

        this.authService.setTockens(
          refreshResult.accessToken,
          refreshResult.refreshToken
        );

        const authReq = req.clone({
          headers: req.headers.set('x-access-token', refreshResult.accessToken),
        });

        return next.handle(authReq);
      }),
      catchError((error) => {
        this.authService.removeTokens();
        this.router.navigate(['/']);
        return throwError(() => error);
      })
    );
  }
}
