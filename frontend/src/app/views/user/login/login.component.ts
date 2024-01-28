import {Component, OnDestroy} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../core/auth/auth.service";
import {LoginResponseType} from "../../../../types/login-response.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {UserType} from "../../../../types/user.type";
import {UnsubscribeService} from "../../../core/unsubscribe/unsubscribe.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {

  public loginForm = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
    rememberMe: [false]
  });

  public visioPassword: boolean = false;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private _snackBar: MatSnackBar,
              private router: Router,
              private unsubscribeService: UnsubscribeService) {
  }

  public login(): void {
    if (this.loginForm.valid && this.loginForm.value.password && this.loginForm.value.email) {
     this.unsubscribeService.sub = this.authService.login(this.loginForm.value.email, this.loginForm.value.password, !!this.loginForm.value.rememberMe)
        .subscribe({
          next: (data: LoginResponseType | DefaultResponseType) => {
            let error = null;
            if ((data as DefaultResponseType).error !== undefined) {
              error = ((data as DefaultResponseType).message);
            }

            let loginResponse = data as LoginResponseType;
            if (!loginResponse.accessToken || !loginResponse.refreshToken || !loginResponse.userId) {
              error = 'Ошибка авторизации';
            }

            if (error) {
              this._snackBar.open(error);
              throw new Error(error);
            }

            this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
            this.authService.userId = loginResponse.userId;
            this._snackBar.open('Вы успешно авторизовались')
            this.router.navigate(['/']);
            this.getUserName();

          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message)
            } else {
              this._snackBar.open('Ошибка авторизации')
            }
          }
        })
    }
  }
  public getUserName(): void {
    this.authService.getUserInfo()
      .subscribe((data: DefaultResponseType | UserType) => {
        this.authService.userInfoName = (data as UserType).name;
        this.authService.userName$.next((data as UserType).name)
      })
  }

  public ngOnDestroy(): void {
    this.unsubscribeService.getSub().forEach(s => s.unsubscribe());
  }
}
