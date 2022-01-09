import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { CouponService } from '../services/coupon.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private couponService: CouponService
  ) { }

  // Create
  create(user) {
    return this.firestore.collection('users').doc(user.uid).set(user);
  }

  // Get list
  getAll() {
    return this.firestore.collection('users').snapshotChanges();
  }

  // Get single
  get(id) {
    return this.firestore.collection('users').doc(id).valueChanges();
  }

  // Update
  update(id, user) {
    return this.firestore.collection('users').doc(id).update(user)
      .then(() => { })
      .catch(error => console.log(error));;
  }

  // Delete user
  delete(id) {
    console.log('delete');
    this.couponService.deleteByUserId(id);
    localStorage.removeItem('user');
    this.firestore.doc('users/' + id).delete();
    this.router.navigate(['/login']);
  }
}
