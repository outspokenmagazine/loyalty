import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CouponService {

  coupon = {
    uid: '',
    shop: 'j41zKC1EBCBfVAzXQVmG',
    maxCount: 9,
    currentCount: 0,
    freeCount: 0
  };
  index;

  constructor(
    private firestore: AngularFirestore
  ) { }

  // Create initial coupon
  create(uid) {
    this.index = [];

    for (let i = 1; i <= this.coupon.maxCount; i++) {
      this.index.push(i);
    }

    localStorage.setItem('index', JSON.stringify(this.index));

    this.coupon.uid = uid;
    return this.firestore.collection('coupons').add(this.coupon);
  }

  // Get single coupon
  getCouponById(id) {
    return this.firestore.collection('coupons').doc(id).valueChanges();
  }

  getCouponByUserId(userId) {
    return this.firestore.collection('coupons', ref => ref.where('uid', '==', userId)).valueChanges();
  }

  // Get coupon by user id and shop id
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

  // Update the current count of the coupon
  updateCurrentCount(id, count) {
    this.firestore.collection('coupons').doc(id).update({currentCount: count})
      .then(() => { })
      .catch(error => console.log(error));
  }

  // Update the count of a free item
  updateFreeCount(id, count) {
    this.firestore.collection('coupons').doc(id).update({currentCount: 0, freeCount: count})
      .then(() => { })
      .catch(error => console.log(error));
  }
}
