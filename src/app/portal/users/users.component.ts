import {Component, OnInit} from '@angular/core';
import {PaginationInstance} from 'ngx-pagination';
import {mask} from '../../shared/helpers/mask.helper';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User} from '../../shared/interfaces/user';
import {UserPermission} from '../../shared/enum/user-permission.enum';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  paginateConfig: PaginationInstance = {
    id: 'users',
    currentPage: 1,
    itemsPerPage: 10
  };

  mask = mask;
  isEdit = false;
  isSee = false;
  userForm: FormGroup = this.newFormGroupFactory();

  userPermission = UserPermission;

  users: User[] = [
    {
      id_user: 1,
      name: 'Exemplo',
      phone: '12991129999',
      cpf: '37565663824',
      permission: 1,
      address: 'Exemplo',
      password: '123456',
      status: true,
    },
    {
      id_user: 1,
      name: 'Exemplo',
      phone: '12991129999',
      cpf: '37565663824',
      permission: 2,
      address: 'Exemplo',
      password: '123456',
      status: true,
    },
    {
      id_user: 1,
      name: 'Exemplo',
      phone: '1236547952',
      cpf: '37565663824',
      permission: 3,
      address: 'Exemplo',
      password: '123456',
      status: false
    }
  ];

  constructor(
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
  }

  createForm(user?: User): void {
    if (user?.id_user) {
      this.userForm.disable();
      this.userForm = this.editFormGroupFactory(user);
      this.userForm.disable();
    } else {
      this.userForm.enable();
      this.userForm = this.newFormGroupFactory();
      this.userForm.enable();
    }
  }

  editFormGroupFactory(user: User): FormGroup {
    return this.formBuilder.group({
      id_user: [user.id_user],
      name: [user?.name, Validators.required],
      permission: [user?.permission, Validators.required],
      cpf: [user?.cpf, Validators.required],
      phone: [user?.phone, Validators.required],
      status: [user?.status, Validators.required],
      address: [user?.address, Validators.required]
    });
  }

  newFormGroupFactory(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      permission: [null, Validators.required],
      cpf: ['', Validators.required],
      phone: ['', Validators.required],
      password: ['', Validators.required],
      address: ['', Validators.required],
      status: [true, Validators.required],
    });
  }

  editState(): void {
    this.isEdit = !this.isEdit;
    if (this.isEdit) {
      this.userForm.enable();
    } else {
      this.userForm.disable();
    }
  }

  seeState(): void {
    this.isSee = false;
    this.isEdit = false;
    this.createForm();
  }

  onSeeClick(user: User): void {
    this.createForm(user);
    this.isSee = true;
  }

  getPhoneMask(): string {
    return (this.userForm.get('phone')?.value as string).length === 10 ? mask.phone : mask.cellphone;
  }

  deleteUser(): void {
    console.log(this.userForm.get('id_user')?.value);
  }

  saveUser(): void {
    const user: User = this.userForm.getRawValue();
    if (user.id_user) {
      console.log(user);
    } else {
      console.log(user);
    }
  }
}
