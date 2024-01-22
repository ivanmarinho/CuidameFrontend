import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterArray'
})
export class FilterArrayPipe implements PipeTransform {
  transform(array: any[], searchTerm: string, propertyName: string): any[] {
    if (!array || !searchTerm || !propertyName) {
      return array;
    }
    searchTerm = searchTerm.toLowerCase();
    return array.filter(item => item[propertyName].toLowerCase().includes(searchTerm));
  }
}
