import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDropdownConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Admin } from 'src/app/core/model/admin';
import { Constant } from 'src/app/core/model/constant';
import { ResponseActionType } from 'src/app/core/model/enums';
import { AuthService } from 'src/app/core/service/auth.service';
import { DataService } from 'src/app/core/service/data.service';
import { ResponseHandlerService } from 'src/app/core/service/response-handler.service';
import { SharedDataService } from 'src/app/core/service/shared-data.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [NgbDropdownConfig]
})
export class NavbarComponent implements OnInit {
  public iconOnlyToggled = false;
  public sidebarToggled = false;
  sharedUserData: Admin = new Admin();

  oldPasswordControl = new FormControl('', Validators.required);
  newPasswordControl = new FormControl('', Validators.required);

  constructor(
    config: NgbDropdownConfig,
    private sharedData: SharedDataService,
    private dataService: DataService,
    private modalService: NgbModal,
    private router: Router,
    private authService: AuthService,
    private _responseHandler: ResponseHandlerService,
  ) {
    config.placement = 'bottom-right';
    this.sharedData.userData$.subscribe(
      (userData) => {
        this.sharedUserData._id = userData._id;
        this.sharedUserData.accessToken = userData.accessToken;
        this.sharedUserData.fullName = userData.fullName;
        this.sharedUserData.role = userData.role;
        this.sharedUserData.isSuperAdmin = userData.isSuperAdmin;
        this.sharedUserData.isAdmin = userData.isAdmin;
        this.sharedUserData.isCorporateAdmin = userData.isCorporateAdmin;
        this.sharedUserData.isAnalystAdmin = userData.isAnalystAdmin;
      }
    );
  }

  ngOnInit() {
  }

  // toggle sidebar in small devices
  toggleOffcanvas() {
    document.querySelector('.sidebar-offcanvas').classList.toggle('active');
  }

  // toggle sidebar
  toggleSidebar() {
    let body = document.querySelector('body');
    if ((!body.classList.contains('sidebar-toggle-display')) && (!body.classList.contains('sidebar-absolute'))) {
      this.iconOnlyToggled = !this.iconOnlyToggled;
      if (this.iconOnlyToggled) {
        body.classList.add('sidebar-icon-only');
      } else {
        body.classList.remove('sidebar-icon-only');
      }
    } else {
      this.sidebarToggled = !this.sidebarToggled;
      if (this.sidebarToggled) {
        body.classList.add('sidebar-hidden');
      } else {
        body.classList.remove('sidebar-hidden');
      }
    }
  }

  // toggle right sidebar
  // toggleRightSidebar() {
  //   document.querySelector('#right-sidebar').classList.toggle('open');
  // }

  logout() {
    this.authService.logout();
  }

  openResetPassword(modal: any) {
    this.modalService.open(modal, { size: 'md' });
  }

  resetPassword() {
    // this.dataService.resetPassword(Constant.ADMIN_RESET_PASSWORD, {
    //   oldPassword: this.oldPasswordControl.value,
    //   newPassword: this.newPasswordControl.value
    // })
    //   .subscribe(
    //     (res: any) => {
    //       this._responseHandler.HandleSuccess(res, ResponseActionType.Updated);
    //       this.modalService.dismissAll();
    //       this.authService.logout();
    //     },
    //     (error) => {
    //       this._responseHandler.HandelError(error);
    //       this.modalService.dismissAll();
    //     }
    //   );
  }

}
