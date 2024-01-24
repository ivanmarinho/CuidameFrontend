import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../storage.service';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { NgForm } from '@angular/forms';
const url = environment.url;

@Injectable({
  providedIn: 'root',
})
export class PetsService {
  constructor(private http: HttpClient) {}

  // ===================== pets ==============================

  private handleError(error: HttpErrorResponse) {
    return of(error.error);
  }

  private petId = '';

  getPetId(): string {
    return this.petId;
  }

  setPetId(newPetId: string) {
    this.petId = newPetId;
  }

  getOwner(id: string, token: string = '') {
    return this.http
      .post(
        `${url}api/pets/getowner`,
        { id },
        {
          headers: {
            'Content-type': 'application/json',
            Authorization: token,
          },
        }
      )
      .pipe(catchError(this.handleError));
  }

  getOwnerxPet(hashcode: string) {
    return this.http
      .post(`${url}api/pets/getownerxpet`, { hashcode })
      .pipe(catchError(this.handleError));
  }

  getAllPets(id: string, token: string = '') {
    return this.http
      .post(
        `${url}api/pets/all`,
        { id },
        {
          headers: {
            'Content-type': 'application/json',
            Authorization: token,
          },
        }
      )
      .pipe(catchError(this.handleError));
  }

  addPet(formData: FormData, token: string = '') {
    const headers = {
      Authorization: token,
    };
    return this.http
      .post(`${url}api/pets/addpet`, formData, {
        headers,
      })
      .pipe(catchError(this.handleError));
  }

  addPetIdentifier(id: string, token: string = '') {
    const headers = {
      Authorization: token,
    };
    return this.http
      .post(`${url}api/pets/identifier`, id, {
        headers,
      })
      .pipe(catchError(this.handleError));
  }

  updatePet(formData: FormData, token: string = '') {
    const headers = {
      Authorization: token,
    };
    return this.http
      .post(`${url}api/pets/updatepet`, formData, {
        headers,
      })
      .pipe(catchError(this.handleError));
  }
  // Must be changed to getPet not getPets
  getOnePet(id: string, token: string = ''): Observable<any> {
    return this.http.post(
      `${url}api/pets/getonepet`,
      { id },
      {
        headers: {
          'Content-type': 'application/json',
          Authorization: token,
        },
      }
    );
  }

  deletePet(id: string, token: string = '') {
    return this.http
      .post(
        `${url}api/pets/delete`,
        { id },
        {
          headers: {
            'Content-type': 'application/json',
            Authorization: token,
          },
        }
      )
      .pipe(catchError(this.handleError));
  }

  petBandAuth(fLogin: NgForm) {
    return this.http
      .post(`${url}api/pets/bandauth`, fLogin.form.value, {
        headers: {
          'Content-type': 'application/json',
        },
      })
      .pipe(catchError(this.handleError));
  }

  personBandAuth(fLogin: NgForm) {
    return this.http
      .post(`${url}api/person/bandauth`, fLogin.form.value, {
        headers: {
          'Content-type': 'application/json',
        },
      })
      .pipe(catchError(this.handleError));
  }

  getHashcode(code: string) {
    return this.http
      .post(`${url}api/pets/gethashcode`, { code })
      .pipe(catchError(this.handleError));
  }



  addupdate(formData: FormData, token: string = '') {
    const headers = {
      Authorization: token,
    };
    return this.http
      .post(`${url}api/pets/addupdate`, formData, {
        headers,
      })
      .pipe(catchError(this.handleError));
  }
}
