import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {mask} from '../../shared/helpers/mask.helper';
import {AuthService} from '../services/auth.service';
import {ToastrService} from 'ngx-toastr';
import {take} from 'rxjs/operators';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  login: FormGroup;
  mask = mask;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toast: ToastrService,
    private router: Router
  ) {
    this.login = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.login = this.formBuilder.group({
      cpf: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  send(): void {
    this.authService.login(this.login.getRawValue()).pipe(take(1)).subscribe(
      () => this.router.navigate(['admin']),
      error => this.toast.error(error.error.message)
    );
  }
}
