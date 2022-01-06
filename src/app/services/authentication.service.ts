import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth/';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  userData;
  isCustomer;

  constructor(
    public fireAuth: AngularFireAuth
  ) {
    // Get the auth state, then fetch the Firestore user document
    this.fireAuth.authState.subscribe(user => {
      if (user) {
        console.log(user);
        console.log('user', user);
        localStorage.setItem('user', JSON.stringify(this.userData));
        this.isCustomer = false;
      } else {
        // localStorage.setItem('user', null);
        // JSON.parse(localStorage.getItem('user'));
        this.isCustomer = true;
        console.log('this.isCustomer', this.isCustomer);
        console.log('user', user);
      }
    });
  }

  // Returns true when user is looged in
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log('user', user);
    return (user !== null) ? true : false;
  }

  // Returns true when user is looged in
  get isShop(): boolean {
    return !this.isCustomer;
  }

  signInAnonymously() {
    return new Promise<any>((resolve, reject) => {
      this.fireAuth.signInAnonymously()
        .then((data) => {
          localStorage.setItem('user', JSON.stringify(data.user));
          resolve(data);
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          reject(`login failed ${error.message}`);
        });
    });
  }
}
