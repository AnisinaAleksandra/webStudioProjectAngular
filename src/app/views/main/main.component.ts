import { AfterContentInit, Component, OnInit } from '@angular/core';
import { advantagesList, servicesList } from './infoLists';
import { ArticlesService } from 'src/app/services/articles.service';
import { ArticleType } from 'src/types/article.type';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, AfterContentInit {
  static anchor: string | null = null;

  listOfServices: {
    image: string;
    title: string;
    description: string;
    price: number;
    isCardWithBtn: boolean;
  }[] = servicesList;
  advantagesList: { textBold: string; text: string }[] = advantagesList;
  listOfArticles: ArticleType[] | null = null;

  customOptionsRev: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 26,
    dots: false,
    navSpeed: 700,
    autoWidth: true,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
    },
    nav: false,
  };
  reviews = [
    {
      name: 'Станислав',
      image: 'review1.png',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.',
    },
    {
      name: 'Алёна',
      image: 'review2.png',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.',
    },
    {
      name: 'Мария',
      image: 'review3.png',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!',
    },
  ];
  constructor(
    private articlesService: ArticlesService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.router.navigate([], { fragment: 'about' });
    this.articlesService.getBestArticles().subscribe((data: ArticleType[]) => {
      return (this.listOfArticles = data);
    });
  }

  ngAfterContentInit() {
    setTimeout(() => {
      this.scrollToElementInMain();
    }, 1);
  }
  scrollToElementInMain(): void {
    if (MainComponent.anchor) {
      const element = document.getElementById(MainComponent.anchor);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    MainComponent.anchor = null;
  }

  public static scrollToElement(target: HTMLElement | null): void {
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
