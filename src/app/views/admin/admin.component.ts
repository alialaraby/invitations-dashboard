import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Admin } from 'src/app/core/model/admin';
import { Constant } from 'src/app/core/model/constant';
import { AdminRoles, ResponseActionType } from 'src/app/core/model/enums';
import { DataService } from 'src/app/core/service/data.service';
import { ResponseHandlerService } from 'src/app/core/service/response-handler.service';
import { SharedDataService } from 'src/app/core/service/shared-data.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  admins: Admin[] = [];
  sharedUserData: Admin = new Admin();
  gettingData: boolean = true;
  addEditForm: FormGroup;
  pageIndex: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;

  adminRoles = [AdminRoles.SuperAdmin, AdminRoles.Admin, AdminRoles.CorporateAdmin, AdminRoles.Analyst];

  constructor(
    private dataService: DataService,
    private sharedData: SharedDataService,
    private _responseHandler: ResponseHandlerService,
    private modalService: NgbModal,
    private fb: FormBuilder,
  ) {
    this.sharedData.userData$.subscribe(
      (userData) => {
        this.sharedUserData._id = userData._id;
        this.sharedUserData.accessToken = userData.accessToken;
        this.sharedUserData.role = userData.role;
        this.sharedUserData.isSuperAdmin = userData.isSuperAdmin;
        this.sharedUserData.isAdmin = userData.isAdmin;
        this.sharedUserData.isCorporateAdmin = userData.isCorporateAdmin;
        this.sharedUserData.isAnalystAdmin = userData.isAnalystAdmin;
      }
    );
  }

  ngOnInit(): void {
    this.getAll(this.pageIndex - 1, this.pageSize);
  }

  getAll(pageIndex: number = 0, pageSize: number = 10) {
    // this.dataService.getAll(Constant.GET_ADMINS, pageIndex, pageSize)
    //   .subscribe(
    //     (res: any) => {
    //       this.admins = res.items;
    //       this.totalCount = res.count;
    //       this.gettingData = false;
    //     },
    //     (error) => {
    //       this.gettingData = false;
    //       this._responseHandler.HandelError(error);
    //     }
    //   );
  }

  openAddModal(modal) {
    this.buildForm();
    this.modalService.open(modal);
  }

  buildForm() {
    this.addEditForm = this.fb.group({
      fullName: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      gender: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  add() {
    // this.gettingData = true;
    // if (!this.addEditForm.invalid) {
    //   this.dataService.add(Constant.ADD_ADMIN, this.addEditForm.value)
    //     .subscribe(
    //       (res: any) => {
    //         this._responseHandler.HandleSuccess(res, ResponseActionType.Added);
    //         this.getAll();
    //         this.modalService.dismissAll();
    //       },
    //       (error) => {
    //         this.gettingData = false;
    //         this._responseHandler.HandelError(error);
    //         this.modalService.dismissAll();
    //       }
    //     );
    // }
  }

  pageChange(pageIndex: number){
    this.getAll(pageIndex - 1);
  }

}
