import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HotToastModule } from '@ngneat/hot-toast';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { HeaderComponent } from './shared/layout/header/header.component';
import { FooterComponent } from './shared/layout/footer/footer.component';
import { MainComponent } from './views/main/main.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from './shared/shared.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { MainCarouselComponent } from './views/main/main-carousel/main-carousel.component';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthInterceptor } from './core/auth.interceptor';
import { MatDialogModule } from '@angular/material/dialog';
import { IMaskModule } from 'angular-imask';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    MainComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatMenuModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    CarouselModule,
    MatDialogModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    IMaskModule,
    MainCarouselComponent,
    HotToastModule.forRoot(),

    MatInputModule,
  ],
  exports: [FormsModule, ReactiveFormsModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
