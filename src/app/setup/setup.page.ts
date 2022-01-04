import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ShopService } from '../services/shop.service';

@Component({
  selector: 'app-setup',
  templateUrl: 'setup.page.html',
  styleUrls: ['setup.page.scss']
})
export class SetupPage {

  shopDetailsForm: FormGroup;
  errorMessages;
  shopId = 'j41zKC1EBCBfVAzXQVmG';
  shopDetails;

  constructor(
    private formbuilder: FormBuilder,
    private shopService: ShopService
  ) {
    this.shopDetailsForm = this.formbuilder.group({
      shopName: ['', Validators.compose([
        Validators.required,
        Validators.minLength(2)
      ])],
      maxCount: ['', Validators.compose([
        Validators.required,
        Validators.min(1),
        Validators.max(99),
        Validators.pattern(/^-?(0|[1-9]\d*)?$/)
      ])]
    });

    this.errorMessages = {
      shopName: [
        { type: 'required', message: 'Bitte gib einen Shopnamen ein.' },
        { type: 'minlength', message: 'Der Shopname ist zu kurz.' },
        { type: 'maxlength', message: 'Der Shopname ist zu lang.' }
      ],
      maxCount: [
        { type: 'required', message: 'Bitte gib eine Zahl ein.' },
        { type: 'min', message: 'Die Zahl muss größer 1 sein.' },
        { type: 'max', message: 'Die Zahl muss kleiner 100 sein.' },
        { type: 'pattern', message: 'Bitte gib eine Zahl ein.' }
      ]
    };
  }

  ionViewWillEnter() {
    this.shopService.getDetails(this.shopId).subscribe(data => {
      this.shopDetails = data;
    });
  };

  save() {
    this.shopDetails.name = this.shopDetailsForm.value.shopName;
    this.shopDetails.maxCount = this.shopDetailsForm.value.maxCount;

    this.shopService.updateDetails(this.shopId, this.shopDetails);
  };

}
