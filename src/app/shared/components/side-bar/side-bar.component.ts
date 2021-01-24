import {AfterViewChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit, AfterViewChecked {
  hideSidebar = false;
  isSmartphone = false;
  collapseLinks = false;

  constructor(
    private route: Router,
    private cdk: ChangeDetectorRef
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

  checkCollapse(): void {
    this.collapseLinks = false;
  }

  logout(): void {
    this.route.navigate(['/']);
  }
}
