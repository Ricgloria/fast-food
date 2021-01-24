import {Component, OnInit} from '@angular/core';
import {PaginationInstance} from 'ngx-pagination';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Product} from '../../shared/interfaces/product';

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

  product: Product[] = [
    {
      id_product: 1,
      product_name: 'XBACON',
      product_value: 20.99,
      status: true
    },
    {
      id_product: 1,
      product_name: 'XSALADA',
      product_value: 20.99,
      status: true
    },
    {
      id_product: 1,
      product_name: 'XFRANGO',
      product_value: 20.99,
      status: true
    }
  ];

  constructor(
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
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
      status: [true]
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
    console.log(this.productForm.get('id_product')?.value);
  }

  saveProduct(): void {
    const product: Product = this.productForm.getRawValue();
    if (product.id_product) {
      console.log(product);
    } else {
      console.log(product);
    }
  }
}
