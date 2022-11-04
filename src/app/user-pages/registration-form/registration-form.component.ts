import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Constant } from 'src/app/core/model/constant';
import { ResponseActionType } from 'src/app/core/model/enums';
import { DataService } from 'src/app/core/service/data.service';
import { ResponseHandlerService } from 'src/app/core/service/response-handler.service';
import { SharedDataService } from 'src/app/core/service/shared-data.service';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss']
})
export class RegistrationFormComponent implements OnInit {

  loading: boolean;
  loadingText: string;
  regForm: FormGroup;
  gettingData: boolean = true;
  hashedPhone: string = '';
  doneSubmitting: boolean = false;
  submittedSuccessfully: boolean = false;
  alreadySubmitted: boolean = false;
  notEligible: boolean = false;
  somethingWentWrong: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private _responseHandler: ResponseHandlerService,
    private sharedData: SharedDataService,
    private _dataService: DataService
  ) { }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.hashedPhone = params?.vertX;
      }
    );

    this.regForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      company: ['', Validators.required],
      sector: ['', Validators.required],
      title: ['', Validators.required],
    });
  }

  submitForm() {
    this.gettingData = true;
    if (!this.regForm.invalid) {
      this._dataService.add(Constant.SUBMIT_FORM, {
        fullName: this.regForm.get('fullName').value,
        email: this.regForm.get('email').value,
        phone: this.regForm.get('phone').value,
        company: this.regForm.get('company').value,
        sector: this.regForm.get('sector').value,
        title: this.regForm.get('title').value,
        hashedPhone: this.hashedPhone,
      })
        .subscribe(
          (res: any) => {
            // this._responseHandler.HandleSuccess(res, ResponseActionType.Sent);
            // this.router.navigate(['/user-pages/success']);
            this.doneSubmitting = true;
            this.submittedSuccessfully = true;
          },
          (error) => {
            if(error?.OriginalError?.status == 409){
              // this.router.navigate(['/user-pages/success']);
              this.doneSubmitting = true;
              this.alreadySubmitted = true;
            }else if(error?.OriginalError?.status == 404){
              this.doneSubmitting = true;
              this.notEligible = true;
            }else{
              this.doneSubmitting = true;
              this.somethingWentWrong = true;
            }
            this.gettingData = false;
            // this._responseHandler.HandelError(error);
          }
        );
    }
  }

}
