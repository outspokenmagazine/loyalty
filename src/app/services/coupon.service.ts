import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CouponService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  // Get coupon by user id
  getCoupon(uid, shopId) {
    return this.firestore.collection('coupons', ref => ref.where('uid', '==', uid).where('shop', '==', shopId)).snapshotChanges();
  }

  // Check if the customer is registrated at the shop
  isCustomer(uid, shopId): Observable<boolean> {
    const subject = new Subject<boolean>();
    let isCustomer = false;
    this.firestore.collection('coupons', ref => ref.where('uid', '==', uid).where('shop', '==', shopId)).snapshotChanges()
      .subscribe((result) => {
        if (result.length === 1) {
          isCustomer = true;
        }
        subject.next(isCustomer);
      });
    return subject.asObservable();
  }

  updateCurrentCount(id, count) {
    this.firestore.collection('coupons').doc(id).update({currentCount: count})
      .then(() => { })
      .catch(error => console.log(error));
  }

  updateFreeCount(id, count) {
    this.firestore.collection('coupons').doc(id).update({currentCount: 0, freeCount: count})
      .then(() => { })
      .catch(error => console.log(error));
  }
}
