import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxScannerQrcodeService } from 'ngx-scanner-qrcode';
import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Constant } from '../core/model/constant';
import { ResponseActionType } from '../core/model/enums';
import { DataService } from '../core/service/data.service';
import { ResponseHandlerService } from '../core/service/response-handler.service';
import { SharedDataService } from '../core/service/shared-data.service';

@Component({
  selector: 'app-scan-qr',
  templateUrl: './scan-qr.component.html',
  styleUrls: ['./scan-qr.component.scss']
})
export class ScanQrComponent implements OnInit {

  scannedText: string = '';
  gettingData: boolean = false;
  public config: Object = {
    isAuto: false,
    text: { font: '0px serif' }, // Hiden { font: '0px' },
    frame: { lineWidth: 8 },
    medias: {
      audio: false,
      video: {
        facingMode: 'environment', // To require the rear camera https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
        width: { ideal: 500 },
        height: { ideal: 500 }
      }
    }
  };

  private $qrData = new Subject<string>();
  qrData: string = null;
  @ViewChild('action', {static: false}) searchNameRef: ElementRef;
  @ViewChild('invalidQRModal', {static: false}) invalidRef: ElementRef;
  @ViewChild('validQRModal', {static: false}) validRef: ElementRef;
  @ViewChild('alreadyAttendedModal', {static: false}) alreadyAttendedRef: ElementRef;
  responseDone: boolean = false;

  constructor(
    private dataService: DataService,
    private sharedData: SharedDataService,
    private _responseHandler: ResponseHandlerService,
    private modalService: NgbModal,
    private qrcode: NgxScannerQrcodeService
  ) { }

  ngOnInit(): void {
    this.$qrData.pipe(debounceTime(250), distinctUntilChanged()).subscribe(searchToken => {
      console.log('DDD', searchToken);
      
      this.qrData = searchToken;      
    });
  }

  public onError(e: any): void {
    console.log(e);
    
  }
  public handle(action: any, fn: string): void {
    action[fn]().subscribe(
      (res) => {
        let dd = this.searchNameRef['data'] as BehaviorSubject<string>;
        dd.subscribe((qrValue: string) => {
          let data = qrValue.split('*--*');

          if(data.length != 2 && !this.responseDone){
            this.responseDone = true;
            this.openInvalidInvitation();
          }else if(!this.responseDone){
            this.responseDone = true;
            this.sendQRCode(data[0], data[1]);
          }
        })
      },(e) => {
        console.log(e);
      }
    )
  }

  sendQRCode(phone: string, hashedPhone: string) {
    this.gettingData = true;
    this.dataService.add(Constant.SEND_Confirm_QR_CODE, { phone: phone, hashedPhone: hashedPhone })
      .subscribe(
        (res: any) => {
          debugger
          console.log(res);
          
          if(res.statusCode == 404){
            this.openInvalidInvitation();
          }else if(res.statusCode == 409){
            this.openAlreadyAttended();
          }else{
            this.openValidInvitation();
          }
          // this.gettingData = false;
          // this._responseHandler.HandleSuccess(res, ResponseActionType.Sent);
          // this.modalService.dismissAll();
        },
        (error) => {
          debugger

          this.openInvalidInvitation();

          // this.gettingData = false;
          // this._responseHandler.HandelError(error);
          // this.modalService.dismissAll();
        }
      );
  }

  openInvalidInvitation() {
    this.handle(this.searchNameRef, 'stop');
    this.responseDone = false;
    this.modalService.open(this.invalidRef, { size: 'md' });
  }

  openValidInvitation() {
    this.handle(this.searchNameRef, 'stop');
    this.responseDone = false;
    this.modalService.open(this.validRef, { size: 'md' });
  }

  openAlreadyAttended() {
    this.handle(this.searchNameRef, 'stop');
    this.responseDone = false;
    this.modalService.open(this.alreadyAttendedRef, { size: 'md' });
  }
}
