import {
  Component,
  ElementRef,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ArticleType } from 'src/types/article.type';

@Component({
  selector: 'info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss'],
})
export class InfoCardComponent implements OnInit {
  @Input() item!:
    | { image: string; title: string; description: string; price: number }
    | ArticleType
    | any;
  imageFolderPath: string = '';
  price: string | null = null;
  
  isFirstVariant: boolean = true;
  @ViewChild('popup')
  popup!: TemplateRef<ElementRef>;

  modalTitle = 'Заявка на услугу';

  constructor(private modalService: NgbModal) {}
  ngOnInit(): void {
    this.imageFolderPath = `/assets/images/mainPage/${this.item!.image}`;
  }
  getPrice() {
    if (this.item.hasOwnProperty('price') === true) {
      // @ts-ignore
      return (this.price = this.item.price);
    } else {
      return this.price;
    }
  }

  openVerticallyCentered(content: any) {
    this.modalService.open(content, { centered: true });
  }
}
