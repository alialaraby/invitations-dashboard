import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Admin } from '../core/model/admin';
import { Constant } from '../core/model/constant';
import { ResponseActionType } from '../core/model/enums';
import { IUser } from '../core/model/user';
import { DataService } from '../core/service/data.service';
import { ResponseHandlerService } from '../core/service/response-handler.service';
import { SharedDataService } from '../core/service/shared-data.service';
import * as XLSX from 'xlsx';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit  {

  // excel related
  data: any;
  vipUsers: IUser[] = [];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'SheetJS.xlsx';

  //table related
  displayedColumns: string[] = ['select', 'phone', 'fullName', 'email', 'company', 'title', 'sector', 'submittedRegistration', 'adminSentQR', 'attendedEvent', 'action'];
  dataSourceWithPageSize = new MatTableDataSource();

  dataSource = new MatTableDataSource<IUser>([]);
  totalCount = 0;
  pageIndex = 0;
  pageSize = 50;

  selection = new SelectionModel<IUser>(true, []);

  users: IUser[] = [];
  selectedUser: IUser;
  sharedUserData: Admin = new Admin();
  gettingData: boolean = true;
  addEditForm: FormGroup;

  totalRegistrations: number = 0;
  qrsSent: number = 0;
  totalAttendents: number = 0;

  erroredNumbers: string[] = [];
  numbersAlreadySent: string[] = [];

  @ViewChild('resultModal', {static: false}) resultModalRef: ElementRef;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  isSendingVip: boolean = false;
  isSendingMessage: boolean = false;
  sending: boolean = false;

  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  // }

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
    private router: Router,
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

        if(!this.sharedUserData.isSuperAdmin)
          this.router.navigate(['/scan-qr']);
        
      }
    );
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.getAll(this.pageIndex, this.pageSize);
    this.getStatistics();
  }

  getAll(pageIndex: number = 0, pageSize: number = 50) {
    this.dataService.getAll(Constant.GET_USERS, pageIndex, pageSize)
      .subscribe(
        (res: any) => {
          let data: IUser[] = [];
          this.users = res.items;
          data = res.items;

          this.totalCount = res.count;
          this.dataSource = new MatTableDataSource<IUser>(data);
          
          this.gettingData = false;
        },
        (error) => {
          this.gettingData = false;
          this._responseHandler.HandelError(error);
        }
      );
  }

  onPaginnatorChange(event: PageEvent) {
    this.selection.clear()
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getAll(this.pageIndex, this.pageSize);
  }

  getStatistics() {
    this.dataService.getAll(Constant.GET_STATISTICS)
      .subscribe(
        (res: any) => {
          this.totalRegistrations = res.totalRegistrations;
          this.qrsSent = res.qrsSent;
          this.totalAttendents = res.totalAttendents;
        },
        (error) => {
          // this.gettingData = false;
          this._responseHandler.HandelError(error);
        }
      );
  }

  openAddModal(modal, isSendingVip: boolean, isSendingMessage: boolean) {
    this.isSendingVip = isSendingVip;
    this.isSendingMessage = isSendingMessage;
    this.vipUsers = [];
    this.buildForm();
    this.modalService.open(modal);
  }

  buildForm() {
    this.addEditForm = this.fb.group({
      // phoneKey: ['', Validators.required],
      phone: ['', Validators.required],
      message: [''],
      // invitationLink: ['', Validators.required], // http://localhost:4200/registration-form
    });
  }

  sendInvitation() {
    this.sending = true;
    this.modalService.dismissAll();

    this.gettingData = true;
    if (!this.addEditForm.invalid) {
      let phones = this.addEditForm.get('phone').value.toString().split(' ');
      if(this.isSendingMessage){
        this.dataService.add(Constant.SEND_MESSAGE, {
          phones: phones,
          message: this.addEditForm.get('message').value.replace(/\n/g, " "),
        })
          .subscribe(
            (res: any) => {
              if((res.erroredNumbers && res.erroredNumbers.length > 0) || (res.numbersAlreadySent && res.numbersAlreadySent.length > 0)){
                this.erroredNumbers = res.erroredNumbers;
                // this.numbersAlreadySent = res.numbersAlreadySent;
                this.openResult();
              }
              
              this._responseHandler.HandleSuccess(res, ResponseActionType.Sent);
              this.getAll();
              this.sending = false;
            },
            (error) => {
              this.gettingData = false;
              this._responseHandler.HandelError(error);
              this.sending = false;
            }
          );
      }else{
        this.dataService.add(Constant.SEND_INVITATION, {
          phones: phones,
          invitationLink: Constant.INVITATION_LINK,
        })
          .subscribe(
            (res: any) => {
              if((res.erroredNumbers && res.erroredNumbers.length > 0) || (res.numbersAlreadySent && res.numbersAlreadySent.length > 0)){
                this.erroredNumbers = res.erroredNumbers;
                this.numbersAlreadySent = res.numbersAlreadySent;
                this.openResult();
              }
              
              this._responseHandler.HandleSuccess(res, ResponseActionType.Sent);
              this.getAll();
              this.sending = false;
            },
            (error) => {
              this.gettingData = false;
              this._responseHandler.HandelError(error);
              this.sending = false;
            }
          );
      }
    }
  }

  sendInvitationVip() {
    this.sending = true;

    this.modalService.dismissAll();

    this.gettingData = true;
    if (this.vipUsers.length > 0) {
      this.dataService.add(Constant.SEND_INVITATION_VIP, {
        users: this.vipUsers,
        invitationLink: Constant.INVITATION_LINK,
      })
        .subscribe(
          (res: any) => {
            if ((res.erroredNumbers && res.erroredNumbers.length > 0) || (res.numbersAlreadySent && res.numbersAlreadySent.length > 0)) {
              this.erroredNumbers = res.erroredNumbers;
              this.numbersAlreadySent = res.numbersAlreadySent;
              this.openResult();
            }

            this._responseHandler.HandleSuccess(res, ResponseActionType.Sent);
            this.getAll();
            this.sending = false;

          },
          (error) => {
            this.gettingData = false;
            this._responseHandler.HandelError(error);
            this.sending = false;

          }
        );

    }
  }

  pageChange(pageIndex: number){
    this.getAll(pageIndex - 1);
  }

  openSendQRCode(modal: any, item: IUser) {
    this.selectedUser = item;
    this.modalService.open(modal, { size: 'md' });
  }
  sendQRCode() {
    this.sending = true;

    this.erroredNumbers = [];
    this.numbersAlreadySent = [];

    let selectedIds = [];
    if(this.selection.selected.length > 0){
      selectedIds = this.selection.selected.map(x => x._id);
    }else{
      selectedIds = [this.selectedUser._id];
    }

    this.dataService.add(Constant.SEND_QR_CODE, { itemIds: selectedIds })
      .subscribe(
        (res: any) => {
          this.erroredNumbers = res.erroredNumbers;
          this.openResult();

          this._responseHandler.HandleSuccess(res, ResponseActionType.Sent);
          this.getAll();
          this.modalService.dismissAll();
          this.sending = false;
          this.selection.clear();
        },
        (error) => {
          this.gettingData = false;
          this._responseHandler.HandelError(error);
          this.modalService.dismissAll();
          this.sending = false;
          this.selection.clear();

        }
      );
  }

  openResult() {
    this.modalService.open(this.resultModalRef, { size: 'md' });
  }

  onFileChange(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      this.data = (XLSX.utils.sheet_to_json(ws, { header: 1 }));
      
      let phones: string[] = [];
      if(this.isSendingVip){
        this.data.shift();
        this.data.forEach((element) => {
          if(element && element[0] && element[0].toString().trim().length > 0)
            this.vipUsers.push({
              phone: '0' + element[0].toString().trim(),
              email: element[1],
              fullName: element[2],
              company: element[3],
              sector: element[4],
              title: element[5],
            });
        });
      }else{
        this.data.forEach(element => {
          if(element && element[0])
            phones.push('0' + element[0].toString().trim());
        });
      }

      if(phones && phones.length > 0){
        this.addEditForm.get('phone').setValue(phones.join(' '));
      }
    };
    reader.readAsBinaryString(target.files[0]);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.filter(x => x.submittedRegistration && !x.adminSentQR).length;
    return numSelected === numRows;
  }
  isSelectedPage() {
    const numSelected = this.selection.selected.length;
    const page = this.dataSource.paginator.pageSize;
    let endIndex: number;
    if (this.dataSource.data.length > (this.dataSource.paginator.pageIndex + 1) * this.dataSource.paginator.pageSize) {
      endIndex = (this.dataSource.paginator.pageIndex + 1) * this.dataSource.paginator.pageSize;
    } else {
      endIndex = this.dataSource.data.length - (this.dataSource.paginator.pageIndex * this.dataSource.paginator.pageSize);
    }
    return numSelected === endIndex;
  }
  toggleAllRows() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => {
        if(row.submittedRegistration && !row.adminSentQR)
          this.selection.select(row)
      });
  }
  selectRows() {
    let endIndex: number;
    if (this.dataSource.data.length > (this.dataSource.paginator.pageIndex + 1) * this.dataSource.paginator.pageSize) {
      endIndex = (this.dataSource.paginator.pageIndex + 1) * this.dataSource.paginator.pageSize;
    } else {
      endIndex = this.dataSource.data.length;
    }

    for (let index = (this.dataSource.paginator.pageIndex * this.dataSource.paginator.pageSize); index < endIndex; index++) {
      this.selection.select(this.dataSource.data[index]);
    }
  }

  /** The label for the checkbox on the passed row */
  // checkboxLabel(row?: IUser): string {
  //   if (!row) {
  //     return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
  //   }
  //   // return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  // }

  export(type: string) {
    this.gettingData = true;

    this.dataService.add(Constant.EXPORT, { type })
      .subscribe(
        (res: any) => {
          window.open(res.item, '_blank');
          this.gettingData = false;
          this._responseHandler.HandleSuccess(res, ResponseActionType.Sent);
        },
        (error) => {
          this.gettingData = false;
          this._responseHandler.HandelError(error);
        }
      );
  }

  hasValue(){
    return (this.addEditForm.get('message') && this.addEditForm.get('message').value.trim().length > 0)
  }

  openClearDB(modal: any) {
    this.modalService.open(modal, { size: 'md' });
  }

  clearDB(){
    this.dataService.clearDB(Constant.CLEAR_DB)
      .subscribe(
        (res: any) => {
          this._responseHandler.HandleSuccess(res, ResponseActionType.Sent);
          this.getAll();
          this.modalService.dismissAll();
        },
        (error) => {
          this._responseHandler.HandelError(error);
          this.modalService.dismissAll();
          this.getAll();
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
