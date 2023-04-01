import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthService } from 'src/app/core/auth.service';
import { MainComponent } from 'src/app/views/main/main.component';
import { ActiveParamsType } from 'src/types/active-params.type';
import { DefaultResponseType } from 'src/types/defaultReasponse.type';
import { UseResponseType } from 'src/types/userResponse.type';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, AfterViewInit {
  phoneNumber: string = '+7 (499) 343-13-34';
  userName: string = '';
  isLogged: boolean = false;
  isOpenedPage: boolean = false;
  isOpenedPageBlog: boolean = false;
  isOpenedRequest: boolean = false;

  servicesElement: HTMLElement | null = null;
  aboutElement: HTMLElement | null = null;
  requestElement: HTMLElement | null = null;
  contactsElemedt: HTMLElement | null = null;
  linkToScroll = {
    services: 'services',
    about: 'about',
    request: 'request',
    contacts: 'contacts',
  };

  constructor(
    private authService: AuthService,
    private toast: HotToastService,
    private router: Router
  ) {
    this.isLogged = !!localStorage.getItem('accessToken');
    this.userName = localStorage.getItem(this.authService.name) || '';
  }
  ngOnInit(): void {
    this.authService
      .getUserInfo()
      .subscribe((userInfo: UseResponseType | DefaultResponseType) => {
        if ((userInfo as UseResponseType).name) {
          this.authService.setUserInfo(
            (userInfo as UseResponseType).name,
            (userInfo as UseResponseType).email
          );
        }
      });

    this.authService.isLogged$.subscribe((isLoggedIn) => {
      this.userName = localStorage.getItem('name') || '';
      this.isLogged = isLoggedIn;
    });

    if (window.location.pathname === '/') {
      this.isOpenedPage = true;
      this.isOpenedPageBlog = false;
    }
    if (window.location.pathname === '/blog-list') {
      this.isOpenedPage = false;
      this.isOpenedPageBlog = true;
    }
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.doLogout();
      },
      error: () => {
        this.doLogout();
      },
    });
  }
  isActualPage(page: string) {
    if (page === 'uslugi') {
      this.isOpenedPage = true;
      this.isOpenedPageBlog = false;
    }
    if (page === 'blog') {
      this.isOpenedPage = false;
      this.isOpenedPageBlog = true;
      this.isOpenedRequest = false;
    }
    if (page === 'request') {
      this.isOpenedRequest = true;
      this.isOpenedPage = false;
      this.isOpenedPageBlog = false;
    }
  }

  navigateOnPages(id: string) {
    if (window.location.pathname === '/blog-list') {
      this.router.navigate(['/']);
      this.isOpenedPage = true;
      this.isOpenedPageBlog = false;
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
  doLogout() {
    this.authService.removeTokens();
    this.authService.removeUserInfo();
    this.toast.info('Вы вышли из системы');
    this.router.navigate(['/']);
  }
  ngAfterViewInit(): void {
    this.authService.isLogged$.subscribe((isLoggedIn) => {
      this.isLogged = isLoggedIn;
      this.userName = localStorage.getItem(this.authService.name) || '';
    });
    if (this.userName === '') {
      this.userName = localStorage.getItem(this.authService.name) || '';
    }
  }

  routerParams(
    path: string | null = null,
    id: string | null = null,
    params: ActiveParamsType | null = null
  ): void {
    if (id) {
      this.router.navigate(['/' + path]);
    } else if (params) {
      this.router.navigate(['/' + path], { queryParams: params });
    }else if(!id && !params && !path){
      this.router.navigate(['/']);
    }
  }

  scrollToElementLink(target:HTMLElement|null, anchor:string):void{
    this.routerParams();
    const element = document.getElementById(anchor);
    if(element){
      MainComponent.scrollToElement(element);
    }else{
      MainComponent.anchor = anchor;
    }
  }
}
