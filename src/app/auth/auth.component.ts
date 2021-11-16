import { Router } from '@angular/router';
import { AuthService, AuthRespData } from './auth.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  isLoggedin = true;
  isLoading = false;
  errMessage: string = null;

  constructor(private authServ: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onSwitchMode() {
    this.isLoggedin = !this.isLoggedin;
  }

  onSubmit(form: NgForm) {
    //if a user force enables the form in js
    if (!form.valid) {
      return;
    }

    let authObs: Observable<AuthRespData>;

    this.isLoading = true;
    if (this.isLoggedin) {
      authObs = this.authServ.login(form.value.email, form.value.password);
    } else {
      authObs = this.authServ.signup(form.value.email, form.value.password);
    }

    authObs.subscribe(
      (res) => {
        this.isLoading = false;
        console.log(res);
        this.router.navigate(['/recipes']);
      },
      (errMsg) => {
        this.isLoading = false;
        console.log(errMsg);
        this.errMessage = errMsg;
      }
    );
    form.reset();
  }
}
