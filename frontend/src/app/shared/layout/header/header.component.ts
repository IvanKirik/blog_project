import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {UnsubscribeService} from "../../../core/unsubscribe/unsubscribe.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  public isLogged: boolean = false;
  public userName: string = '';

  constructor(private authService: AuthService,
              private _snackBar: MatSnackBar,
              private router: Router,
              private unsubscribeService: UnsubscribeService) {
    this.isLogged = this.authService.getIsLoggedIn()
  }

  public ngOnInit(): void {
   this.authService.isLogged$
      .subscribe((isLoggedIn: boolean) => {
        this.isLogged = isLoggedIn;
      })

    if(this.isLogged) {
      this.userName = this.authService.userInfoName!;
    }

    this.authService.userName$
      .subscribe(name => {
        this.userName = name;
      })
  }

  public logout(): void {
    this.unsubscribeService.sub = this.authService.logout()
      .subscribe({
          next: () => {
            this.doLogout();
          },
          error: () => {
            this.doLogout();
          }
        }
      )
  }

  private doLogout(): void {
    this.authService.removeTokens();
    this.authService.userInfoName = null;
    this.authService.userId = null;
    this._snackBar.open('Вы вышли из системы');
    this.router.navigate(['/']);
  }

  public ngOnDestroy(): void {
    this.unsubscribeService.getSub().forEach(s => s.unsubscribe());
  }
}
