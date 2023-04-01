import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CategoryType } from 'src/types/category.type';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  constructor(private http: HttpClient) {}
  getCategories(): Observable<CategoryType[]> {
    return this.http.get<CategoryType[]>(environment.api + 'categories');
  }

//   getCategoriesWithTypes(): Observable<CategoryWithType[]> {
//     return this.http.get<TypeType[]>(environment.api + 'types').pipe(
//       map((items: TypeType[]) => {
//         const array: CategoryWithType[] = [];

//         items.forEach((item: TypeType) => {
//           const foundItem = array.find(
//             (arrayItem) => arrayItem.url === item.category.url
//           );
//           console.log(foundItem);
          
//           if (foundItem) {
//             foundItem.types.push({
//               id: item.id,
//               name: item.name,
//               url: item.url,
//             });
//             console.log('>>>>');
            
//           } else {
//             array.push({
//               id: item.category.id,
//               name: item.category.name,
//               url: item.category.url,
//               types: [
//                 {
//                   id: item.category.id,
//                   name: item.category.name,
//                   url: item.category.url,
//                 },
//               ],
//             });
//           }
//         });

//         return array;
//       })
//     );
//   }
}
