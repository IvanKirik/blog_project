import {Component, OnDestroy} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../core/auth/auth.service";
import {Router} from "@angular/router";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {LoginResponseType} from "../../../../types/login-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpErrorResponse} from "@angular/common/http";
import {UserType} from "../../../../types/user.type";
import {UnsubscribeService} from "../../../core/unsubscribe/unsubscribe.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],

})
export class SignupComponent implements OnDestroy {

  public signupForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/[А-Я]{1}[а-яё]+(\s+[А-Я]{1}[а-яё]+)?/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/)]],
    agree: [false, [Validators.requiredTrue]]
  });
  public visioPassword: boolean = false;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private _snackBar: MatSnackBar,
              private unsubscribeService: UnsubscribeService) {
  }

  public ngOnDestroy(): void {
    this.unsubscribeService.getSub().forEach(s => s.unsubscribe());
  }

  public signup(): void {
    if (this.signupForm.valid && this.signupForm.value.email && this.signupForm.value.name
      && this.signupForm.value.password && this.signupForm.value.agree) {
      this.unsubscribeService.sub = this.authService.signup(this.signupForm.value.name, this.signupForm.value.email, this.signupForm.value.password)
        .subscribe({
          next: (data: DefaultResponseType | LoginResponseType) => {
            let error = null;
            if ((data as DefaultResponseType).error !== undefined) {
              error = (data as DefaultResponseType).message;
            }
            const loginResponse = data as LoginResponseType;
            if (!loginResponse.accessToken ||
              !loginResponse.refreshToken ||
              !loginResponse.userId) {
              error = 'Ошибка авторизации';
            }
            if (error) {
              this._snackBar.open(error);
              throw new Error(error);
            }

            this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
            this.authService.userId = loginResponse.userId;

            this._snackBar.open('Вы успешно зарегистрировались!');
            this.authService.getUserInfo()
              .subscribe((data: DefaultResponseType | UserType) => {
                if ((data as DefaultResponseType).error !== undefined) {
                  error = ((data as DefaultResponseType).message);
                }
                this.authService.userInfoName = (data as UserType).name;
                this.authService.userName$.next((data as UserType).name)
              })
            this.router.navigate(['/']);
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message)
            } else {
              this._snackBar.open('Ошибка регистрации');
            }
          }
        })
    }
  }
}
