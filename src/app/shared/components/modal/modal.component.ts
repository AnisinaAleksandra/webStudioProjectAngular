import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { RequestService } from 'src/app/services/request.service';

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent implements OnInit {
  @Input() modalTitle!: string;
  @Input() item?: {
    image: string;
    title: string;
    description: string;
    price: number;
  } | null = null;
  @Input() isFirstVariant!: boolean;
  @Input() modal: any;
  titleButton = 'Оставить заявку';
  myOrderFormView = true;
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
    type: '',
  });

  isSending: boolean = false;
  constructor(
    private fb: FormBuilder,
    private requestService: RequestService,
    private toast: HotToastService
  ) {}

  phoneMask = { mask: '+{0}(000)000-0000' };

  ngOnInit() {
    if (this.item?.title) {
      this.orderForm.patchValue({ service: this.item.title });
      this.orderForm.patchValue({ type: 'order' });
    }
    if (this.item === null) {
      this.orderForm.patchValue({ type: 'consultation' });
      this.titleButton = 'Заказать консультацию';
    }
  }

  sendOrder() {
    if (
      this.orderForm.value.name &&
      this.orderForm.value.phone &&
      this.orderForm.value.type
    ) {
      this.orderForm.value.phone = `${this.orderForm.value.phone}`;
      if (this.orderForm.value.type === 'consultation') {
        delete this.orderForm.value.service;
      }
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

  onAccept() {
    console.log('on accept');
  }
  onComplete() {
    console.log('on complete');
  }
}
