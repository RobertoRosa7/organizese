import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss'],
})
export class VerifyComponent implements OnInit {
  public token: string | null = null;
  public text = 'E-mail não verificado!';
  public isVerified$: Observable<any>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private loginService: LoginService
  ) {}

  public ngOnInit(): void {
    this.isVerified$ = this.activatedRoute.queryParams.pipe(
      switchMap((params: any) => {
        if (params) {
          return this.loginService.loginVerified({ token: params.token });
        } else {
          return of(null);
        }
      }),
      catchError((e) => {
        console.log(e);
        this.text =
          'Crie uma nova senha de acesso. (login > esqueci a senha > digite seu e-mail)';
        return e;
      })
    );
    // .subscribe(
    //   (res) => {
    //     if (res) {
    //       this.text = 'E-mail verificado!';
    //       this.isVerified = true;
    //     }
    //   },
    //   () => {
    //     this.text = 'E-mail não verificado, token inválido ou expirado!';
    //     this.isVerified = false;
    //   }
    // );
  }
}
