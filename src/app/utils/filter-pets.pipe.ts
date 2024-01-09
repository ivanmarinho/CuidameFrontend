import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterPets'
})
export class FilterPetsPipe implements PipeTransform {
  transform(petsArray: any[], searchTerm: string): any[] {
    if (!petsArray || !searchTerm) {
      return petsArray;
    }
    searchTerm = searchTerm.toLowerCase();
    return petsArray.filter(pet => pet.nombre.toLowerCase().includes(searchTerm));
  }
}
