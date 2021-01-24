import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {patterns} from '../../shared/helpers/patterns.helper';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  login: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.login = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.login = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(patterns.email)])],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  send(): void {
    console.log(this.login?.getRawValue());
  }
}
