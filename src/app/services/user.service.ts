import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  // Create
  create(user) {
    return this.firestore.collection('users').doc(user.uid).set(user);
  }

  // Get list
  getUsers() {
    return this.firestore.collection('users').snapshotChanges();
  }

  // Get single
  getUser(id) {
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
    this.firestore.doc('users/' + id).delete();
  }
}
