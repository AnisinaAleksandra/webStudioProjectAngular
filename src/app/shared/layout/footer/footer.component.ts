import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  @ViewChild('popupSecond')
  popupSecond!: TemplateRef<ElementRef>;
  phoneNumber: string = '+7 (499) 343-13-34';
constructor(private modalService: NgbModal,  private router: Router){

}
  openVerticallyCentered(content: any) {
    this.modalService.open(content, { centered: true });
  }

  navigateOnPages(id: string) {
    if (window.location.pathname === '/blog-list') {
      this.router.navigate(['/']);

      setTimeout(() => {
        document.getElementById(id)!.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        });
      }, 100);
    }
    document.getElementById(id)!.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }
}
