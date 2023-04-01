import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from 'src/app/services/categories.service';
import { ActiveParamsUtil } from 'src/app/utils/active-params.util';
import { ActiveParamsType } from 'src/types/active-params.type';
import { CategoryType } from 'src/types/category.type';

@Component({
  selector: 'filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent implements OnInit {
  categories: CategoryType[] = [];
  open = false;
  activeParams: ActiveParamsType = { categories: [] };
  activeFilters: CategoryType[] | [] = [];
  constructor(
    private categoryService: CategoriesService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.categoryService
      .getCategories()
      .subscribe((categories: CategoryType[]) => {
        this.categories = categories;
        this.categories.forEach((el) => {
          if (
            this.activeParams.categories.length &&
            this.activeParams.categories.find((item) => item === el.url)
          ) {
            el.isSelect = true;
          } else el.isSelect = false;
        });
    this.activeFilters = this.categories.filter((el) => el.isSelect);
      });
    this.activatedRoute.queryParams.subscribe((params) => {
      this.activeParams = ActiveParamsUtil.processParams(params);
    });
  }
  toggle() {
    this.open = !this.open;
  }
  updateFilterParam(id: string) {
    console.log(this.activeFilters);

    if (this.activeFilters.filter((el) => el.id === id).length) {
      this.removeAllowFilter(id);
      this.activeFilters = this.categories.filter((el) => el.isSelect);
    } else if (this.activeFilters.filter((el) => el.id === id).length === 0) {
      this.categories.forEach((el) => {
        if (el.id === id) {
          el.isSelect = true;
        }
      });
      this.activeParams.categories = this.categories
        .filter((category) => category.isSelect === true)
        .map((category) => category.url);
      this.activeFilters = this.categories.filter((el) => el.isSelect);
    }
    console.log();
    
    this.router.navigate(['/blog-list'], {
      queryParams: this.activeParams,
    });
  }
  removeAllowFilter(id: string) {
    if (this.activeFilters.filter((el) => el.id === id).length) {
      this.categories.forEach((el) => {
        if (el.id === id) {
          el.isSelect = false;
        }
      });
      this.activeParams.categories = this.categories
      .filter((category) => category.isSelect === true)
      .map((category) => category.url);
      this.activeFilters.filter((el) => el.id !== id);
    }
    this.router.navigate(['/blog-list'], {
      queryParams: this.activeParams,
    });
  }
}
