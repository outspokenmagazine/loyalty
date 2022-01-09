import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { confirmPassword } from './../validators/validators';
import { AuthenticationService } from './../services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registrationForm: FormGroup;
  user: any;
  error: any;
  errorMessages: any;
  isAlreadyInUser = false;
  isSubmitAttempt = false;

  constructor(
    public alertController: AlertController,
    private router: Router,
    public authService: AuthenticationService,
    private formbuilder: FormBuilder
  ) {
    this.registrationForm = this.formbuilder.group({
      firstName: ['', Validators.compose([
        Validators.required,
        Validators.minLength(2)
      ])],
      lastName: ['', Validators.compose([
        Validators.required,
        Validators.minLength(2)
      ])],
      email: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,12}$')
      ])],
      confirmPassword: ['', Validators.compose([
        Validators.required,
        confirmPassword
      ])]
    });

    this.errorMessages = {
      firstName: [
          { type: 'required', message: 'Bitte gib deinen Vornamen ein.' },
          { type: 'minlength', message: 'Der Vorname muss aus mindestens 2 Buchstaben bestehen.' }
      ],
      lastName: [
          { type: 'required', message: 'Bitte gib deinen Nachnamen ein.' },
          { type: 'minlength', message: 'Der Nachnamen muss aus mindestens 2 Zeichen bestehen.' }
      ],
      email: [
          { type: 'required', message: 'Bitte gib deine Emailadresse ein.' },
          { type: 'pattern', message: 'Die Emailadresse ist leider nicht gültig.' },
          { type: 'auth/email-already-in-use', message: 'Die Emailadresse ist leider schon vergeben.' }
      ],
      password: [
          { type: 'required', message: 'Bitte gib ein Passwort ein.' },
          { type: 'minlength', message: 'Das Passwort muss aus mindestens 6 Zeichen bestehen.' },
          { type: 'pattern', message: 'Das Passwort muss einen großen Buchstaben, einen kleinen Buchstaben und eine Zahl enthalten.' }
      ],
      confirmPassword: [
          { type: 'isNotConfirmed', message: 'Die Passwörter stimmen leider nicht überein.' }
      ]
    };
  }

  ngOnInit() {
  }

  async presentEmailVerification() {
    const alert = await this.alertController.create({
      cssClass: 'custom-alert-class',
      header: 'Email Bestätigung',
      message: 'Wir haben dir eine Email an deine Adresse geschickt',
      buttons: ['OK']
    });
    await alert.present();
  }

  submitForm() {
    this.isSubmitAttempt = true;
    this.user = {};

    if (this.registrationForm.valid) {
      this.authService.registerUser(this.registrationForm.value.email, this.registrationForm.value.password).then((data) => {

        this.user = {};

        this.user.uid = data.user.uid;
        this.user.firstName = this.registrationForm.value.firstName;
        this.user.lastName = this.registrationForm.value.lastName;
        this.user.email = this.registrationForm.value.email;

//        this.authService.setUserDisplayName(this.user.firstName);
//        this.userService.create(this.user);
        if (data.user.emailVerified) {
          this.router.navigate(['/tabs']);
        } else {
          data.user.sendEmailVerification().then(() => {
            this.presentEmailVerification();
            this.authService.logout();

            const navigationExtras: NavigationExtras = {
              state: {
                email: this.registrationForm.value.email
              }
            };
            this.router.navigate(['/login'], navigationExtras);
          });
        }
      }).catch((error) => {
        this.error = error;
        this.isAlreadyInUser = true;
        console.log(this.error.code);
      });
    }
  }
}
