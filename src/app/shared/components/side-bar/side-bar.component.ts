import {AfterViewChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../../core/services/auth.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit, AfterViewChecked {

  hideSidebar = false;
  isSmartphone = false;

  constructor(
    private route: Router,
    private cdk: ChangeDetectorRef,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.checkWindowSize();
  }

  ngAfterViewChecked(): void {
    this.cdk.detectChanges();
  }

  checkWindowSize(): void {
    const screenWidth = document.documentElement.clientWidth;
    this.hideSidebar = screenWidth < 1080;
    this.isSmartphone = screenWidth < 1080;
  }

  logout(): void {
    this.authService.logoutUser();
  }
}
