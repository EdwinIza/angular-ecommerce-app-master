import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CartService } from '../services/cart.service';
import { ProductService } from '../services/product.service';
import { Products, Product } from '../shared/models/product.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
  text: string;
  products: Product[] = [];
  categories: any[] = [
    {
      name: 'Laptops',
    },
    {
      name: 'Accessories',
    },
    {
      name: 'Cameras',
    },
  ];
  loading = false;
  productPageCounter = 1;
  additionalLoading = false;
  selectedLanguage: string;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private translate: TranslateService
  ) {}

  public screenWidth: any;
  public screenHeight: any;

  ngOnInit(): void {
    this.loading = true;
    setTimeout(() => {
      this.productService.getAllProducts(9, this.productPageCounter).subscribe(
        (res: any) => {
          console.log(res);
          this.products = res;
          this.loading = false;
        },
        (err) => {
          console.log(err);
          this.loading = false;
        }
      );
    }, 500);
  }

  showMoreProducts(): void {
    this.additionalLoading = true;
    this.productPageCounter = this.productPageCounter + 1;
    setTimeout(() => {
      this.productService.getAllProducts(9, this.productPageCounter).subscribe(
        (res: any) => {
          console.log(res);
          this.products = [...this.products, ...res];
          this.additionalLoading = false;
        },
        (err) => {
          console.log(err);
          this.additionalLoading = false;
        }
      );
    }, 500);
  }

  changeLanguage(): void {
    this.translate.use(this.selectedLanguage);
    console.log('Idioma cambiado a', this.selectedLanguage);
  }

  translateCategory(category: string): string {
    return this.translate.instant(category);
  }
}
