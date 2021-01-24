import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SideBarComponent} from './components/side-bar/side-bar.component';
import {RouterModule} from '@angular/router';
import {UserPermissionPipe} from './pipes/user-permission.pipe';
import { UserStatusPipe } from './pipes/user-status.pipe';


@NgModule({
  declarations: [
    SideBarComponent,
    UserPermissionPipe,
    UserStatusPipe
  ],
  exports: [
    SideBarComponent,
    UserPermissionPipe,
    UserStatusPipe
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class SharedModule {
}
