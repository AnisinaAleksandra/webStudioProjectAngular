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
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signUpForm = this.fb.group({
    name: [
      '',
      [
        Validators.required,
        Validators.pattern(/[А-Я]{1}[а-я]{1,23}\s[А-Я]{1}[а-я]{1,23}$/),
      ],
    ],
    email: ['', [Validators.email, Validators.required]],
    password: [
      '',
      [
        Validators.required,
        Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/),
      ],
    ],
    agree: [false, Validators.requiredTrue],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: HotToastService
  ) {}
  ngOnInit(): void {
    console.log(this.signUpForm);
  }

  signUp() {
    if (
      this.signUpForm.valid &&
      this.signUpForm.value.email &&
      this.signUpForm.value.password &&
      this.signUpForm.value.name &&
      this.signUpForm.value.agree
    ) {
      this.authService
        .signUp(
          this.signUpForm.value.name,
          this.signUpForm.value.email,
          this.signUpForm.value.password
        )
        .subscribe({
          next: (data: DefaultResponseType | LoginResponseType) => {
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
              error = 'Ошибка регистрации';
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
                  this.toast.success('Вы успешно зарегестрировались!');
                  window.location.reload();
                  this.router.navigate(['/']);
                }
              });
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this.toast.success(errorResponse.error.message);
            } else {
               this.toast.error('Ошибка регистрации');
            }
          },
        });
    }
  }
}
