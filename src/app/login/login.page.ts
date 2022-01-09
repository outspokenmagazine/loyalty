import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AuthenticationService } from './../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  isSubmit = false;
  isEmailError = false;
  isPasswordError = false;
//  isPasswordVisible = false;
//  isIOS = false;
  error: any;
  errorMessages: any;

  constructor(
    public alertController: AlertController,
    public loadingController: LoadingController,
    private router: Router,
    public authService: AuthenticationService,
    private formbuilder: FormBuilder,
    public route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.loginForm.patchValue({
          email: this.router.getCurrentNavigation().extras.state.email
        });
      }
    });

    this.loginForm = this.formbuilder.group({
      email: ['', [
        Validators.required
      ]],
      password: ['', [
        Validators.required
      ]]
    });

    this.errorMessages = {
      email: [
        { type: 'required', message: 'Bitte gib deine Emailadresse ein.' },
        { type: 'auth/invalid-email', message: 'Die Emailadresse ist leider nicht gültig.' },
        { type: 'auth/user-not-found', message: 'Die Emailadresse konnte nicht gefunden werden.' }
      ],
      password: [
        { type: 'required', message: 'Bitte gib dein Passwort ein.' },
        { type: 'auth/wrong-password', message: 'Das Passwort ist falsch.' }
      ]
    };
  }

  ngOnInit() {
  }

  ionViewWillLeave() {
    // Reset input fields
    this.loginForm.patchValue({
      email:    '',
      password: ''
    });

    // Reset error messages
//    this.isEmailError = false;
//    this.isPasswordError = false;
//    this.error = {};
    this.isSubmit = false;
  }

  async presentEmailVerification() {
    const alert = await this.alertController.create({
      cssClass: 'custom-alert-class',
      header: 'Email Bestätigung',
      message: 'Du musst deine Email erst bestätigen',
      buttons: ['OK']
    });
    await alert.present();
  }

  login() {
    this.isSubmit = true;

    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password)
        .then((res) => {
          if(res.user.emailVerified) {

            // Firebase analytics
            const params = {
              method: 'email'
            };

            this.router.navigate(['/tabs']);

          } else {
            this.presentEmailVerification();
            return false;
          }
        })
        .catch((error) => {
          this.error = error;

          this.errorMessages.email.forEach(errorMessage => {
            if (errorMessage.type === error.code) {
              this.isEmailError = true;
            }
          });

          this.errorMessages.email.forEach(errorMessage => {
            if (errorMessage.type === error.code) {
              this.isPasswordError = true;
            }
          });
        });
    }
  }
}
