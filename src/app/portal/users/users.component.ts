import {Component, OnDestroy, OnInit} from '@angular/core';
import {PaginationInstance} from 'ngx-pagination';
import {mask} from '../../shared/helpers/mask.helper';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../../shared/interfaces/user';
import {UserPermission} from '../../shared/enum/user-permission.enum';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../../core/services/user.service';
import {Subscription} from 'rxjs';
import {debounceTime, take} from 'rxjs/operators';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  paginateConfig: PaginationInstance = {
    id: 'users',
    currentPage: 1,
    itemsPerPage: 10
  };

  search = new FormControl();
  subscription: Subscription | undefined;

  mask = mask;
  isEdit = false;
  isSee = false;
  userForm: FormGroup = this.newFormGroupFactory();

  userPermission = UserPermission;

  users: User[] = [];
  filteredUsers: User[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
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

  getAllUsers(): void {
    this.userService.getAllUsers().pipe(take(1)).subscribe(
      res => {
        this.users = res;
        this.filteredUsers = res;
      },
      error => this.toast.error(error)
    );
  }

  getData(): void {
    this.activatedRoute.data.pipe(take(1)).subscribe(
      res => {
        this.users = res.users;
        this.filteredUsers = res.users;
        this.filterUser();
      }
    );
  }

  filterUser(): void {
    this.subscription = this.search.valueChanges.pipe(debounceTime(200)).subscribe(
      (value: string) => {
        if (value) {
          this.filteredUsers = this.users.filter(user => user.name.toUpperCase().includes(value.toUpperCase()));
        } else {
          this.filteredUsers = this.users;
        }
      }
    );
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
      status: [1, Validators.required],
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
    const id = this.userForm.get('id_user')?.value;
    this.userService.deleteUser(id).pipe(take(1)).subscribe(
      res => {
        this.getAllUsers();
        this.toast.success(res.message);
        this.seeState();
      },
      error => this.toast.error(error)
    );
  }

  saveUser(): void {
    const user: User = this.userForm.getRawValue();
    user.status = Number(user.status);
    if (user.id_user) {
      this.putUser(user);
    } else {
      this.postUser(user);
    }
  }

  postUser(user: User): void {
    this.userService.postUser(user).pipe(take(1)).subscribe(
      () => {
        this.getAllUsers();
        this.toast.success('Usuário criado com sucesso');
        this.seeState();
      },
      error => this.toast.error(error)
    );
  }

  putUser(user: User): void {
    const id: number = user.id_user || 0;
    delete user.id_user;

    this.userService.putUser(user, id).pipe(take(1)).subscribe(
      () => {
        this.toast.success(`Usuário editado com sucesso`);
        this.getAllUsers();
        this.seeState();
      },
      error => this.toast.error(error)
    );
  }

  change(user: User, event: boolean): void {
    user.status = event ? 1 : 0;
    this.disableAndEnable({...user});
  }

  disableAndEnable(user: User): void {
    const id: number = user.id_user || 0;
    delete user.id_user;

    this.userService.putUser(user, id).pipe(take(1)).subscribe(
      res => {
        const message = res.status ? 'ativado' : 'inativado';
        this.toast.success(`Usuário ${message} com sucesso`);
        this.seeState();
      },
      error => this.toast.error(error)
    );
  }
}
