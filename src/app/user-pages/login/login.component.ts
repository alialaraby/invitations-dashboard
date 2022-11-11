import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Admin } from 'src/app/core/model/admin';
import { AdminRoles } from 'src/app/core/model/enums';
import { AuthService } from 'src/app/core/service/auth.service';
import { ResponseHandlerService } from 'src/app/core/service/response-handler.service';
import { SharedDataService } from 'src/app/core/service/shared-data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loading: boolean;
  loadingText: string;
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private responseHandler: ResponseHandlerService,
    private sharedData: SharedDataService,
    // private sharedData: SharedDataService,
    // private _dataService: DataService
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.loadingText = 'Logging in...';

      this.auth.login(this.loginForm.value)
        .subscribe(
          (res: any) => {
            let admin = new Admin(res.item._id, res.item.accessToken, res.item.fullName, res.item.role);
            admin = this.setRole(res.item.role, admin);

            this.sharedData.setuserData(admin);
            this.sharedData.setauthenticated(true);
            this.SetLocalStorageData(admin);

            if (admin.isSuperAdmin) {
              this.router.navigate(['/dashboard']);
            }else{
              this.router.navigate(['/scan-qr']);
            }

          }, (error) => {
            this.loginForm.setErrors({
              invalidLogin: true
            });
            this.loading = false;
            this.loadingText = 'Login';
          }
        );
    } else {
      this.loginForm.setErrors({
        invalidLogin: true
      });
      this.loading = false;
      this.loadingText = 'Login';
    }
  }

  SetLocalStorageData(data: Admin) {
    localStorage.setItem("_id", data._id);
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("fullName", data.fullName);
    localStorage.setItem("role", data.role);
    localStorage.setItem("isSuperAdmin", data.role == 'superAdmin' ? 'true' : 'false');
    // localStorage.setItem("isAdmin", data.isAdmin.toString());
    // localStorage.setItem("isCorporateAdmin", data.isCorporateAdmin.toString());
    // localStorage.setItem("isAnalystAdmin", data.isAnalystAdmin.toString());
  }

  setRole(role: AdminRoles, admin: Admin) {
    switch (role) {
      case AdminRoles.SuperAdmin:
        admin.isSuperAdmin = true;
        break;

      // case AdminRoles.Admin:
      //   admin.isAdmin = true;
      //   break;

      // case AdminRoles.CorporateAdmin:
      //   admin.isCorporateAdmin = true;
      //   break;

      // case AdminRoles.Analyst:
      //   admin.isAnalystAdmin = true;
      //   break;
    }
    return admin;
  }

}
