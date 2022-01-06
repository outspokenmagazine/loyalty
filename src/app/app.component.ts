import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { indexedDBLocalPersistence, initializeAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    public authService: AuthenticationService
  ) {
    const app = initializeApp(environment.firebaseConfig);
    if (Capacitor.isNativePlatform) {
      initializeAuth(app, {
        persistence: indexedDBLocalPersistence
      });
    }
    this.initialize();
  }

  initialize() {
    this.platform.ready().then(() => {
      if (this.authService.isLoggedIn) {
        console.log(this.authService.isLoggedIn);
      };
      if (this.authService.isShop) {
        console.log('isShop', this.authService.isShop);
      };
    });
  };
}
