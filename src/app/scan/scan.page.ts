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
  coupon;
  scannedData = '';
  shopId = 'j41zKC1EBCBfVAzXQVmG';

  constructor(
    public alertController: AlertController,
    private couponService: CouponService
  ) {}

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

  async startScan() {
    this.scannedData = '';
    this.scanActive = true;
    this.isCustomer = false;

//    BarcodeScanner.hideBackground();

//    const result = await BarcodeScanner.startScan();

//    if (result.hasContent) {
//      this.scannedData = result.content;
//      this.scanActive = false;
//    }
    this.scannedData = 'EBnzuJAnt9PMpLkgG5OlX2g06BC3';

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

  async stopScan() {
    this.scanActive = false;

//    BarcodeScanner.showBackground();
//    BarcodeScanner.stopScan();
  }

  addCount()  {
    this.scannedData = '';
    this.scanActive = false;
    this.isCustomer = false;
    this.couponService.updateCurrentCount(this.coupon.id, this.coupon.currentCount + 1);
    this.isCountAdded = true;
    console.log('Add count', this.coupon.currentCount);
  }
}
