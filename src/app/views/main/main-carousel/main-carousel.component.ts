import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import {
  NgbCarouselConfig,
  NgbCarouselModule,
} from '@ng-bootstrap/ng-bootstrap';
import { NgIf } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RequestService } from 'src/app/services/request.service';
import { HotToastService } from '@ngneat/hot-toast';
import { IMaskModule } from 'angular-imask';

@Component({
  selector: 'ngbd-carousel-basic',
  standalone: true,
  imports: [NgbCarouselModule, NgIf, ReactiveFormsModule, IMaskModule],
  templateUrl: './main-carousel.component.html',
  styleUrls: ['./main-carousel.component.scss'],
  providers: [NgbCarouselConfig],
})
export class MainCarouselComponent {
  @ViewChild('popupMain') popupMain!: TemplateRef<ElementRef>;
  dialogRef: MatDialogRef<any> | null = null;
  modalTitle = 'Заявка на услугу';
  titleButton = 'Оставить заявку';

  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
  orderForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern('^[а-яА-Я-a-zA-Z]+$')]],
    phone: [
      '',
      [
        Validators.required,
        Validators.minLength(11),
        Validators.pattern('^[+]?[0-9]{4}[-s.]?[0-9]{3}[-s.]?[0-9]{4,4}$'),
      ],
    ],
    service: '',
    type: 'order',
  });
  myOrderFormView = true;
  isSending: boolean = false;
  constructor(
    public dialog: MatDialog,
    public fb: FormBuilder,
    private requestService: RequestService,
    private toast: HotToastService
  ) {
    // config.showNavigationIndicators = false;
  }
  phoneMask = { mask: '+{0}(000)000-0000' };

  sendOrder() {
    if (
      this.orderForm.value.name &&
      this.orderForm.value.phone &&
      this.orderForm.value.type
    ) {
      console.log(this.orderForm.value);
      
      this.orderForm.value.phone = `${this.orderForm.value.phone}`;
      // @ts-ignore
      this.requestService.sendOrder(this.orderForm.value).subscribe((data) => {
        if (data.error === false) {
          this.toast.success(data.message);
          this.modalTitle = 'Спасибо за вашу заявку!';
          this.myOrderFormView = false;
          this.isSending = true;
        }
      });
    }
  }
  openPopUp(title: string):void{
    this.orderForm.patchValue({ service: title });
    this.dialogRef = this.dialog.open(this.popupMain);
  }

  closePopUp():void {
    this.dialogRef?.close();
    this.isSending = false;
    
  }
  onAccept():void {
    console.log('on accept');
  }
  onComplete():void {
    console.log('on complete');
  }
}
