import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Admin } from '../core/model/admin';
import { Constant } from '../core/model/constant';
import { ResponseActionType } from '../core/model/enums';
import { IUser } from '../core/model/user';
import { DataService } from '../core/service/data.service';
import { ResponseHandlerService } from '../core/service/response-handler.service';
import { SharedDataService } from '../core/service/shared-data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  users: IUser[] = [];
  selectedUser: IUser;
  sharedUserData: Admin = new Admin();
  gettingData: boolean = true;
  addEditForm: FormGroup;
  pageIndex: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;

  totalRegistrations: number = 0;
  qrsSent: number = 0;
  totalAttendents: number = 0;

  toggleProBanner(event) {
    event.preventDefault();
    document.querySelector('body').classList.toggle('removeProbanner');
  }

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

  ngOnInit() {
    this.getAll(this.pageIndex - 1, this.pageSize);
    this.getStatistics();
  }

  getAll(pageIndex: number = 0, pageSize: number = 10) {
    this.dataService.getAll(Constant.GET_USERS, pageIndex, pageSize)
      .subscribe(
        (res: any) => {
          console.log(res);
          
          this.users = res.items;
          this.totalCount = res.count;
          this.gettingData = false;
        },
        (error) => {
          this.gettingData = false;
          this._responseHandler.HandelError(error);
        }
      );
  }

  getStatistics() {
    this.dataService.getAll(Constant.GET_STATISTICS)
      .subscribe(
        (res: any) => {

          console.log(res);
          this.totalRegistrations = res.totalRegistrations;
          this.qrsSent = res.qrsSent;
          this.totalAttendents = res.totalAttendents;
          
          // this.users = res.items;
          // this.totalCount = res.count;
          // this.gettingData = false;
        },
        (error) => {
          // this.gettingData = false;
          this._responseHandler.HandelError(error);
        }
      );
  }

  openAddModal(modal) {
    this.buildForm();
    this.modalService.open(modal);
  }

  buildForm() {
    this.addEditForm = this.fb.group({
      // phoneKey: ['', Validators.required],
      phone: ['', Validators.required],
      // invitationLink: ['', Validators.required], // http://localhost:4200/registration-form
    });
  }

  add() {
    this.gettingData = true;
    if (!this.addEditForm.invalid) {
      let phones = this.addEditForm.get('phone').value.toString().split(' ');

      this.dataService.add(Constant.SEND_INVITATION, {
        phones: phones,
        invitationLink: Constant.INVITATION_LINK,
      })
        .subscribe(
          (res: any) => {
            this._responseHandler.HandleSuccess(res, ResponseActionType.Sent);
            this.modalService.dismissAll();
            this.getAll();
          },
          (error) => {
            this.gettingData = false;
            this._responseHandler.HandelError(error);
            this.modalService.dismissAll();
          }
        );
    }
  }

  openSendQRCode(modal: any, item: IUser) {
    this.selectedUser = item;
    this.modalService.open(modal, { size: 'md' });
  }
  sendQRCode() {
    this.dataService.add(Constant.SEND_QR_CODE, { itemId: this.selectedUser._id })
      .subscribe(
        (res: any) => {
          this._responseHandler.HandleSuccess(res, ResponseActionType.Sent);
          this.getAll();
          this.modalService.dismissAll();
        },
        (error) => {
          this.gettingData = false;
          this._responseHandler.HandelError(error);
          this.modalService.dismissAll();
        }
      );
  }

  date: Date = new Date();

  visitSaleChartData = [{
    label: 'CHN',
    data: [20, 40, 15, 35, 25, 50, 30, 20],
    borderWidth: 1,
    fill: false,
  },
  {
    label: 'USA',
    data: [40, 30, 20, 10, 50, 15, 35, 40],
    borderWidth: 1,
    fill: false,
  },
  {
    label: 'UK',
    data: [70, 10, 30, 40, 25, 50, 15, 30],
    borderWidth: 1,
    fill: false,
  }];

  visitSaleChartLabels = ["2013", "2014", "2014", "2015", "2016", "2017"];

  visitSaleChartOptions = {
    responsive: true,
    legend: false,
    scales: {
      yAxes: [{
        ticks: {
          display: false,
          min: 0,
          stepSize: 20,
          max: 80
        },
        gridLines: {
          drawBorder: false,
          color: 'rgba(235,237,242,1)',
          zeroLineColor: 'rgba(235,237,242,1)'
        }
      }],
      xAxes: [{
        gridLines: {
          display: false,
          drawBorder: false,
          color: 'rgba(0,0,0,1)',
          zeroLineColor: 'rgba(235,237,242,1)'
        },
        ticks: {
          padding: 20,
          fontColor: "#9c9fa6",
          autoSkip: true,
        },
        categoryPercentage: 0.4,
        barPercentage: 0.4
      }]
    }
  };

  visitSaleChartColors = [
    {
      backgroundColor: [
        'rgba(154, 85, 255, 1)',
        'rgba(154, 85, 255, 1)',
        'rgba(154, 85, 255, 1)',
        'rgba(154, 85, 255, 1)',
        'rgba(154, 85, 255, 1)',
        'rgba(154, 85, 255, 1)',
      ],
      borderColor: [
        'rgba(154, 85, 255, 1)',
        'rgba(154, 85, 255, 1)',
        'rgba(154, 85, 255, 1)',
        'rgba(154, 85, 255, 1)',
        'rgba(154, 85, 255, 1)',
        'rgba(154, 85, 255, 1)',
      ]
    },
    {
      backgroundColor: [
        'rgba(254, 112, 150, 1)',
        'rgba(254, 112, 150, 1)',
        'rgba(254, 112, 150, 1)',
        'rgba(254, 112, 150, 1)',
        'rgba(254, 112, 150, 1)',
        'rgba(254, 112, 150, 1)',
      ],
      borderColor: [
        'rgba(254, 112, 150, 1)',
        'rgba(254, 112, 150, 1)',
        'rgba(254, 112, 150, 1)',
        'rgba(254, 112, 150, 1)',
        'rgba(254, 112, 150, 1)',
        'rgba(254, 112, 150, 1)',
      ]
    },
    {
      backgroundColor: [
        'rgba(177, 148, 250, 1)',
        'rgba(177, 148, 250, 1)',
        'rgba(177, 148, 250, 1)',
        'rgba(177, 148, 250, 1)',
        'rgba(177, 148, 250, 1)',
        'rgba(177, 148, 250, 1)',
      ],
      borderColor: [
        'rgba(177, 148, 250, 1)',
        'rgba(177, 148, 250, 1)',
        'rgba(177, 148, 250, 1)',
        'rgba(177, 148, 250, 1)',
        'rgba(177, 148, 250, 1)',
        'rgba(177, 148, 250, 1)',
      ]
    },
  ];

  trafficChartData = [
    {
      data: [30, 30, 40],
    }
  ];

  trafficChartLabels = ["Search Engines", "Direct Click", "Bookmarks Click"];

  trafficChartOptions = {
    responsive: true,
    animation: {
      animateScale: true,
      animateRotate: true
    },
    legend: false,
  };

  trafficChartColors = [
    {
      backgroundColor: [
        'rgba(177, 148, 250, 1)',
        'rgba(254, 112, 150, 1)',
        'rgba(132, 217, 210, 1)'
      ],
      borderColor: [
        'rgba(177, 148, 250, .2)',
        'rgba(254, 112, 150, .2)',
        'rgba(132, 217, 210, .2)'
      ]
    }
  ];

}
