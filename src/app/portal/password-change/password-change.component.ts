import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {UserService} from '../../core/services/user.service';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.scss']
})
export class PasswordChangeComponent implements OnInit {

  passwordForm!: FormGroup;

  constructor(
    private toastrService: ToastrService,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.passwordForm = this.formBuilder.group({
      newPassword: ['', Validators.required],
      oldPassword: ['', Validators.required]
    });
  }

  renew(): void {
    const passwords = this.passwordForm.getRawValue();
    this.userService.renewPassword(passwords).pipe(take(1)).subscribe(
      () => {
        this.toastrService.success('Senha atualizada com sucesso');
        this.createForm();
      }, error => this.toastrService.error(error.error.message)
    );
  }

}
