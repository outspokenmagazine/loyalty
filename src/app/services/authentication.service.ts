import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth/';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  user;

  constructor(
    public fireAuth: AngularFireAuth,
    private router: Router,
  ) {

    // Get the auth state, then fetch the Firestore user document
    this.fireAuth.authState.subscribe(user => {
      if (user) {
        console.log('if user', user);
        localStorage.setItem('user', JSON.stringify(user));
        this.user = user;
      } else {
        // localStorage.setItem('user', null);
        // JSON.parse(localStorage.getItem('user'));
        console.log('else user', user);
      }
    });

  }

  // Returns true when user is looged in
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log('isLoggedIn', user);
    return (user !== null) ? true : false;
  }

  // Returns true when user is not a customer
  get isCustomer(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log('isCustomer', user);
    return user.isAnonymous;
  }

  // Signs up a customer anonymously
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

  // Signs up a shop owner with email and password
  async registerUser(email, password) {
    const user = await this.fireAuth.createUserWithEmailAndPassword(email, password);
    console.log('registerUser', user);
    return user;
  }

  // User login with email and password
  login(email, password) {
    return this.fireAuth.signInWithEmailAndPassword(email, password);
  }

  // Sends an email to the user to reset the password
  async recoverPassword(email: string) {
    const resetPassword = await this.fireAuth.sendPasswordResetEmail(email);
    return resetPassword;
  }

  // Save the display name
  updatePassword(password) {
    this.user.updatePassword(password);
  }

  // Logs the user out
  logout() {
    return this.fireAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['/login']);
    });
  }
}
