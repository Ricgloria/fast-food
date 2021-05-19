import {Component, OnDestroy, OnInit} from '@angular/core';
import {PaginationInstance} from 'ngx-pagination';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Product} from '../../shared/interfaces/product';
import {ProductService} from '../../core/services/product.service';
import {debounceTime, take} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {Discount} from '../../shared/interfaces/discount';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnDestroy {

  paginateConfig: PaginationInstance = {
    id: 'product',
    currentPage: 1,
    itemsPerPage: 10
  };

  search = new FormControl();

  subscription: Subscription | undefined;
  isEdit = false;
  isSee = false;
  productForm: FormGroup = this.newFormGroupFactory();

  products: Product[] = [];
  filteredProducts: Product[] = [];

  discount: Discount = {} as Discount;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private toast: ToastrService,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.getData();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  getData(): void {
    this.activatedRoute.data.pipe(take(1)).subscribe(res => {
      this.products = res.products.products;
      this.filteredProducts = res.products.products;
      this.discount = res.products.discount;
      this.filter();
    });
  }

  filter(): void {
    this.subscription = this.search.valueChanges.pipe(debounceTime(200)).subscribe(
      (value: string) => {
        if (value) {
          this.filteredProducts = this.onFilter(value);
        } else {
          this.filteredProducts = this.products;
        }
      }
    );
  }

  getProducts(): void {
    this.productService.getAllProducts().pipe(take(1)).subscribe(
      res => {
        this.filteredProducts = res;
        this.products = res;
      }
    );
  }

  onFilter(value: string): Product[] {
    return this.products.filter(prod => prod.product_name.toUpperCase().includes(value.toUpperCase()));
  }

  createForm(product?: Product): void {
    if (product?.id_product) {
      this.productForm.disable();
      this.productForm = this.editFormGroupFactory(product);
      this.productForm.disable();
    } else {
      this.productForm.enable();
      this.productForm = this.newFormGroupFactory();
      this.productForm.enable();
    }
  }

  editFormGroupFactory(product: Product): FormGroup {
    return this.formBuilder.group({
      id_product: [product.id_product],
      product_name: [product.product_name, Validators.required],
      product_value: [product.product_value, Validators.required],
      status: [product.status, Validators.required]
    });
  }

  newFormGroupFactory(): FormGroup {
    return this.formBuilder.group({
      product_name: ['', Validators.required],
      product_value: ['', Validators.required],
      status: [1]
    });
  }

  editState(): void {
    this.isEdit = !this.isEdit;
    if (this.isEdit) {
      this.productForm.enable();
    } else {
      this.productForm.disable();
    }
  }

  seeState(): void {
    this.isSee = false;
    this.isEdit = false;
    this.createForm();
  }

  onSeeClick(product: Product): void {
    this.createForm(product);
    this.isSee = true;
  }

  deleteProduct(): void {
    const id = this.productForm.get('id_product')?.value;
    this.productService.deleteProduct(id).pipe(take(1)).subscribe(
      res => {
        this.getProducts();
        this.toast.success(res.message);
        this.seeState();
      },
      error => this.toast.error(error)
    );
  }

  saveProduct(): void {
    const product: Product = this.productForm.getRawValue();
    product.status = Number(product.status);
    if (product.id_product) {
      this.putProduct(product);
    } else {
      this.postProduct(product);
    }
  }

  postProduct(product: Product): void {
    this.productService.postProduct(product).pipe(take(1)).subscribe(
      res => {
        this.getProducts();
        this.toast.success('Produto criado com sucesso');
        this.seeState();
      },
      error => this.toast.error(error)
    );
  }

  putProduct(product: Product): void {
    const id: number = product.id_product || 0;
    delete product.id_product;

    this.productService.putProduct(product, id).pipe(take(1)).subscribe(
      res => {
        this.getProducts();
        this.toast.success('Produto editado com sucesso');
        this.seeState();
      },
      error => this.toast.error(error)
    );
  }

  change(product: Product, event: boolean): void {
    product.status = event ? 1 : 0;
    this.disableAndEnable({...product});
  }

  disableAndEnable(product: Product): void {
    const id: number = product.id_product || 0;
    delete product.id_product;

    this.productService.putProduct(product, id).pipe(take(1)).subscribe(
      res => {
        const message = res.status ? 'ativado' : 'inativado';
        this.toast.success(`Produto ${message} com sucesso`);
        this.seeState();
      },
      error => this.toast.error(error)
    );
  }
}
