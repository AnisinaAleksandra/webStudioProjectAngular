
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthService } from 'src/app/core/auth.service';
import { DefaultResponseType } from 'src/types/defaultReasponse.type';
import { LoginResponseType } from 'src/types/loginReasponse.type';
import { UseResponseType } from 'src/types/userResponse.type';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required]],
    rememberMe: [false],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toast: HotToastService,
    private router: Router
  ) {}
  ngOnInit(): void {}

  login(): void {
    if (
      this.loginForm.valid &&
      this.loginForm.value.email &&
      this.loginForm.value.password
    ) {
      this.authService
        .login(
          this.loginForm.value.email,
          this.loginForm.value.password,
          !!this.loginForm.value.rememberMe
        )
        .subscribe({
          next: (data: LoginResponseType | DefaultResponseType) => {
            let error = null;
            if ((data as DefaultResponseType).error !== undefined) {
              error = (data as DefaultResponseType).message;
            }
            let loginResponse = data as LoginResponseType;
            if (
              loginResponse.accessToken === undefined ||
              loginResponse.refreshToken === undefined ||
              loginResponse.userId === undefined
            ) {
              error = 'Ошибка авторизации';
            }
            if (error) {
              this.toast.success(error);
              throw new Error(error);
            }
            this.authService.setTockens(
              loginResponse.accessToken,
              loginResponse.refreshToken
            );

            this.authService
            .getUserInfo()
            .subscribe((userInfo: UseResponseType | DefaultResponseType) => {
              if ((userInfo as UseResponseType).name) {
                this.authService.setUserInfo(
                  (userInfo as UseResponseType).name,
                  (userInfo as UseResponseType).email
                );
                this.authService.userId = loginResponse.userId;
                this.authService.isLogged$.next(true);
                this.toast.success('Вы успешно авторизовались!');
                this.router.navigate(['/']);
              }
            });
           
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this.toast.success(errorResponse.error.message);
            } else {
              this.toast.error('Ошибка авторизации');
            }
          },
        });
    }
  }
}
