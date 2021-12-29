import { Component } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  scanActive = false;
  scannedData;

  constructor(
  ) {}

  onDestroy() {
    this.stopScan();
  }

  async startScanner() {
    this.scannedData = '';

    BarcodeScanner.hideBackground();

    this.scanActive = true;

    const result = await BarcodeScanner.startScan();

    if (result.hasContent) {
      console.log(result.content); // log the raw scanned content
      this.scannedData = result.content;
    }
  }

  async stopScan() {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    this.scanActive = false;
  }
}
