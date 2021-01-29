import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SideBarComponent} from './components/side-bar/side-bar.component';
import {RouterModule} from '@angular/router';
import {UserPermissionPipe} from './pipes/user-permission.pipe';
import { UserStatusPipe } from './pipes/user-status.pipe';
import {SliderButtonComponent} from './components/slider-button/slider-button.component';
import {FormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    SideBarComponent,
    UserPermissionPipe,
    UserStatusPipe,
    SliderButtonComponent
  ],
  exports: [
    SideBarComponent,
    UserPermissionPipe,
    UserStatusPipe,
    SliderButtonComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ]
})
export class SharedModule {
}
