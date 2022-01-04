import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  // Get shop details
  getDetails(shopId) {
    return this.firestore.collection('shops').doc(shopId).valueChanges();
  }

  // Update the shop details
  updateDetails(shopId, shop) {
    this.firestore.collection('shops').doc(shopId).update(shop)
      .then(() => { })
      .catch(error => console.log(error));
  }

}
