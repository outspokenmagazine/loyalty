import { Component } from '@angular/core';
import { ShopService } from '../services/shop.service';
import { CouponService } from '../services/coupon.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  user;
  coupon;
  index;
  encodeData: any;
  shopId = 'j41zKC1EBCBfVAzXQVmG';
  shopDetails;

  constructor(
    private shopService: ShopService,
    private couponService: CouponService
  ) {
    this.encodeData = JSON.parse(localStorage.getItem('user')).uid;
  }

  ionViewWillEnter() {
    this.user = {};
    this.index = [];

    this.user = JSON.parse(localStorage.getItem('user'));
    this.index = JSON.parse(localStorage.getItem('index'));

    this.shopService.getDetails(this.shopId).subscribe(data => {
      this.shopDetails = data;
    });
/*
    this.couponService.getCouponByUserId(this.user.uid).subscribe(data => {
      this.coupon = data[0];
    });
*/
  }
}
