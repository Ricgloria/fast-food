import {Component, OnInit} from '@angular/core';
import {PaginationInstance} from 'ngx-pagination';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Product} from '../../shared/interfaces/product';
import {ProductService} from '../../core/services/product.service';
import {take} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  paginateConfig: PaginationInstance = {
    id: 'product',
    currentPage: 1,
    itemsPerPage: 10
  };

  isEdit = false;
  isSee = false;
  productForm: FormGroup = this.newFormGroupFactory();

  products: Product[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private toast: ToastrService,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.data.pipe(take(1)).subscribe(res => {
      this.products = res.products;
    });
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
        this.products.splice(this.findProduct(id), 1);
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
        this.products.unshift(res);
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
        this.products[this.findProduct(res.id_product)] = res;
        this.toast.success('Produto editado com sucesso');
        this.seeState();
      },
      error => this.toast.error(error)
    );
  }

  findProduct(id: number | undefined): number {
    return this.products.findIndex(pro => pro.id_product === id);
  }
}
