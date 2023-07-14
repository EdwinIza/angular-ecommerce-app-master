import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { TokenStorageService } from '../services/token-storage.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user = [
    {
      key: 'fullName',
      label: '',
      value: '',
      type: 'text',
    },
    {
      key: 'email',
      label: '',
      value: '',
      type: 'email',
    },
    {
      key: 'password',
      label: '',
      value: '',
      type: 'password',
    },
    {
      key: 'confirmPassword',
      label: '',
      value: '',
      type: 'password',
    },
  ];
  userId = null;
  alertMessage = '';
  alertType = '';
  alertVisible = false;
  loading = false;

  constructor(
    private _api: ApiService,
    private _token: TokenStorageService,
    private _router: Router,
    private translate: TranslateService
  ) {}

  // Update user fields with current details
  ngOnInit(): void {
    const { user_id, fname, email } = this._token.getUser();
    this.userId = user_id;
    this.user[0].value = fname;
    this.user[1].value = email;

      // Cargar las traducciones iniciales
  this.translate.get('user_profile').subscribe((translations: any) => {
    this.user[0].label = translations.full_name;
    this.user[1].label = translations.email_address;
    this.user[2].label = translations.password;
    this.user[3].label = translations.confirm_password;
  });
  
    // Suscribirse al evento de cambio de idioma
    this.translate.onLangChange.subscribe(() => {
      this.translate.get('user_profile').subscribe((translations: any) => {
        this.user[0].label = translations.full_name;
        this.user[1].label = translations.email_address;
        this.user[2].label = translations.password;
        this.user[3].label = translations.confirm_password;
      });
    });
  }
  
  canUpdate(): boolean {
    return this.user.filter((field) => field.value.length > 0).length !== 4;
  }

  // Submit data to be updated
  onSubmit(): void {
    this.alertVisible = false;
    if (this.user[2].value !== this.user[3].value) {
      this.alertType = 'error';
      this.alertMessage = 'Passwords do not match';
      this.alertVisible = true;
    } else {
      this.loading = true;
      this._api
        .putTypeRequest(`users/${this.userId}`, {
          fullName: this.user[0].value,
          email: this.user[1].value,
          password: this.user[2].value,
        })
        .subscribe(
          (res: any) => {
            console.log(res);
            this.alertMessage = res.message;
            this.alertType = 'success';
            this.alertVisible = true;
            this.loading = false;
            const oldDetails = this._token.getUser();
            this._token.setUser({
              ...oldDetails,
              fname: this.user[0].value,
              email: this.user[1].value,
            });
            this.user[2].value = '';
            this.user[3].value = '';
            // window.location.reload();
          },
          (err: any) => {
            console.log(err);
            this.alertMessage = err.error.message;
            this.alertVisible = true;
            this.alertType = 'error';
            this.loading = false;
          }
        );
    }
  }
}
