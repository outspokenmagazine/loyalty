import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './../services/authentication.service';
import { CouponService } from '../services/coupon.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  constructor(
    private router: Router,
    public authService: AuthenticationService,
    public couponService: CouponService,
    public userService: UserService
  ) { }

  ngOnInit() {
  }

  signUp() {
    this.authService.signInAnonymously().then(
      (data) => {
        this.couponService.create(data.user.uid);
        this.router.navigate(['home']);
      }
    );
  };

  register() {
    console.log('register');
    this.router.navigate(['register']);
  };

  login() {
    console.log('register');
    this.router.navigate(['login']);
  };
}
