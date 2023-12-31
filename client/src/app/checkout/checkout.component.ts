import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  currentUser: any;
  currentStep = 1;
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCode: string;
  cartData: any;
  products: any;
  loading = false;
  successMessage = '';
  orderId;

  constructor(private _auth: AuthService, private _cart: CartService,private translate: TranslateService) {
    this._auth.user.subscribe((user) => {
      console.log(user); // Verificar el contenido del objeto user
      if (user) {
        this.currentUser = user;
        this.billingAddress[0].value = user.fname;
        this.billingAddress[1].value = user.email;
      }
    });

    this._cart.cartDataObs$.subscribe((cartData) => {
      this.cartData = cartData;
    });
  }

  ngOnInit(): void {
      // Cargar las traducciones para billingAddress
  this.translate.get('billing_address_ch').subscribe((translations: any) => {
    this.billingAddress[0].name = translations['Full name'];
    this.billingAddress[0].placeholder = translations['Enter your full name'];
    this.billingAddress[1].name = translations['Email'];
    this.billingAddress[1].placeholder = translations['Enter your email address'];
    this.billingAddress[2].name = translations['Address'];
    this.billingAddress[2].placeholder = translations['Enter your address'];
    this.billingAddress[3].name = translations['City'];
    this.billingAddress[3].placeholder = translations['Enter your city'];
    this.billingAddress[4].name = translations['Country'];
    this.billingAddress[4].placeholder = translations['Enter your country'];
    this.billingAddress[5].name = translations['ZIP'];
    this.billingAddress[5].placeholder = translations['Enter your zip code'];
    this.billingAddress[6].name = translations['Telephone'];
    this.billingAddress[6].placeholder = translations['Enter your telephone number'];
  });

   // Suscribirse al evento de cambio de idioma
   this.translate.onLangChange.subscribe(() => {
    this.translate.get('billing_address_ch').subscribe((translations: any) => {
      this.billingAddress[0].name = translations['Full name'];
      this.billingAddress[0].placeholder = translations['Enter your full name'];
      this.billingAddress[1].name = translations['Email'];
      this.billingAddress[1].placeholder = translations['Enter your email address'];
      this.billingAddress[2].name = translations['Address'];
      this.billingAddress[2].placeholder = translations['Enter your address'];
      this.billingAddress[3].name = translations['City'];
      this.billingAddress[3].placeholder = translations['Enter your city'];
      this.billingAddress[4].name = translations['Country'];
      this.billingAddress[4].placeholder = translations['Enter your country'];
      this.billingAddress[5].name = translations['ZIP'];
      this.billingAddress[5].placeholder = translations['Enter your zip code'];
      this.billingAddress[6].name = translations['Telephone'];
      this.billingAddress[6].placeholder = translations['Enter your telephone number'];
    });
  });
  }

  submitCheckout() {
    this.loading = true;
    setTimeout(() => {
      this._cart
        .submitCheckout(this.currentUser.id, this.cartData)
        .subscribe(
          (res: any) => {
            console.log(res);
            this.loading = false;
            this.orderId = res.orderId;
            this.products = res.products;
            this.currentStep = 4;
            this._cart.clearCart();
          },
          (err) => {
            console.log(err);
            console.log(this.currentUser.user_id)
            this.loading = false;
          }
        );
    }, 750);
  }

  getProgressPrecent() {
    return (this.currentStep / 4) * 100;
  }

  submitBilling(): void {
    this.nextStep();
  }

  canBillingSubmit(): boolean {
    return this.billingAddress.filter((field) => field.value.length > 0)
      .length !== 7
      ? true
      : false;
  }

  submitPayment(): void {
    this.nextStep();
  }

  canPaymentSubmit(): boolean {
    return this.cardNumber && this.cardName && this.cardExpiry && this.cardCode
      ? true
      : false;
  }

  nextStep(): void {
    this.currentStep += 1;
    localStorage.setItem('checkoutStep', this.currentStep.toString());
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep -= 1;
      localStorage.setItem('checkoutStep', this.currentStep.toString());
    }
  }

  billingAddress = [
    {
      name: 'Full name',
      placeholder: 'Enter your full name',
      type: 'text',
      value: '',
    },
    {
      name: 'Email',
      placeholder: 'Enter your email address',
      type: 'email',
      value: '',
    },
    {
      name: 'Address',
      placeholder: 'Enter your address',
      type: 'text',
      value: '',
    },
    {
      name: 'City',
      placeholder: 'Enter your city',
      type: 'text',
      value: '',
    },
    {
      name: 'Country',
      placeholder: 'Enter your country',
      type: 'text',
      value: '',
    },
    {
      name: 'ZIP',
      placeholder: 'Enter your zip code',
      type: 'text',
      value: '',
    },
    {
      name: 'Telephone',
      placeholder: 'Enter your telephone number',
      type: 'text',
      value: '',
    },
  ];
}
