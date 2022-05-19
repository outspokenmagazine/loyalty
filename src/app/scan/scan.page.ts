import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { CouponService } from './../services/coupon.service';

@Component({
  selector: 'app-scan',
  templateUrl: 'scan.page.html',
  styleUrls: ['scan.page.scss']
})
export class ScanPage {

  scanActive = false;
  isCustomer = false;
  isCountAdded = false;
  isEligible = false;
  coupon;
  scannedData = '';
  shopId = 'j41zKC1EBCBfVAzXQVmG';

  constructor(
    public alertController: AlertController,
    private couponService: CouponService
  ) { }

  onDestroy() {
    this.stopScan();
  }

  async presentIsNoCustomer() {
    const alert = await this.alertController.create({
      cssClass: 'custom-alert-class',
      header: 'Kein Kunde',
      message: 'Wir haben den Kunden nicht gefunden',
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentCountAdded() {
    const alert = await this.alertController.create({
      cssClass: 'custom-alert-class',
      header: 'Kaffee hinzugefügt',
      message: 'Wir haben dem Coupon einen Kaffee hinzugefügt',
      buttons: ['OK']
    });
    await alert.present();
    setTimeout(() => {
      alert.dismiss();
    }, 2000);
  }

  async presentFreeCountAdded() {
    const alert = await this.alertController.create({
      cssClass: 'custom-alert-class',
      header: 'Freier Kaffee hinzugefügt',
      message: 'Wir haben dem Coupon einen freien Kaffee hinzugefügt',
      buttons: ['OK']
    });
    await alert.present();
    setTimeout(() => {
      alert.dismiss();
    }, 2000);
  }

  async checkPermission() {
    return new Promise(async (resolve, reject) => {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        resolve(true);
      } else if (status.denied) {
        BarcodeScanner.openAppSettings();
        resolve(false);
      }
    });
  }

  async startScan() {
    const allowed = await this.checkPermission();

    if (allowed) {
      this.scannedData = '';
      this.scanActive = true;
      this.isCustomer = false;
      this.isCountAdded = false;

      BarcodeScanner.hideBackground();

      const result = await BarcodeScanner.startScan();

      if (result.hasContent) {
        this.scannedData = result.content;
        this.scanActive = false;
        this.couponService.getCoupon(this.scannedData, this.shopId).subscribe((data) => {
          if (data.length === 1) {
            this.isCustomer = true;
            this.coupon = data[0].payload.doc.data();
            this.coupon.id = data[0].payload.doc.id;
            console.log(this.coupon);
          } else {
            this.isCustomer = false;
            this.presentIsNoCustomer();
          }
        });
      }
/*
      // For debugging
      this.scannedData = 'EBnzuJAnt9PMpLkgG5OlX2g06BC3';
      this.couponService.getCoupon(this.scannedData, this.shopId).subscribe((data) => {
        if (data.length === 1) {
          this.isCustomer = true;
          this.coupon = data[0].payload.doc.data();
          this.coupon.id = data[0].payload.doc.id;
          console.log(this.coupon);
          if (this.coupon.currentCount >= this.coupon.maxCount) {
            this.isEligible = true;
          } else {
            this.isEligible = false;
          }
        } else {
          this.isCustomer = false;
          this.presentIsNoCustomer();
        }
      });
*/
    } else {
      alert('NOT ALLOWED!');
    }
  }

  async stopScan() {
    this.scanActive = false;

    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
  }

  addCount()  {
    this.scannedData = '';
    this.scanActive = false;
    this.isCustomer = false;
    this.couponService.updateCurrentCount(this.coupon.id, this.coupon.currentCount + 1);
    this.isCountAdded = true;
    this.presentCountAdded();
    console.log('Add count', this.coupon.currentCount);
    if (this.coupon.currentCount >= this.coupon.maxCount) {
      this.isEligible = true;
    } else {
      this.isEligible = false;
    }
  }

  addFreeCount()  {
    this.scannedData = '';
    this.scanActive = false;
    this.isCustomer = false;
    console.log(this.coupon);
    this.couponService.updateFreeCount(this.coupon.id, this.coupon.freeCount + 1);
    this.isCountAdded = true;
    this.presentFreeCountAdded();
    console.log('Add count', this.coupon.currentCount);
  }
}
