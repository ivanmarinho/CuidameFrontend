import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
const url = environment.url;
@Injectable({
  providedIn: 'root'
})
export class VaccineService {

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    return of(error.error);
  }

  getAll(id: string, token: string = '') {
    return this.http
      .post(`${url}api/vaccine/all`, { id },
      {
        headers: {
          'Content-type': 'application/json',
          Authorization: token,
        },
      })
      .pipe(catchError(this.handleError));
  }

  add(formData: FormData, token: string = '') {
    const headers = {
      Authorization: token,
    };
    return this.http
      .post(`${url}api/vaccine/add`, formData, {
        headers,
      })
      .pipe(catchError(this.handleError));
  }

  update(formData: FormData, token: string = '') {
    const headers = {
      Authorization: token,
    };
    return this.http
      .post(`${url}api/vaccine/update`, formData, {
        headers,
      })
      .pipe(catchError(this.handleError));
  }
  getOne(id: string, token: string = ''): Observable<any> {
    return this.http.post(
      `${url}api/vaccine/getone`,
      { id },
      {
        headers: {
          'Content-type': 'application/json',
          Authorization: token,
        },
      }
    );
  }

  delete(id: string,token: string = '') {
    return this.http
      .post(`${url}api/vaccine/delete`, { id },{
        headers: {
          'Content-type': 'application/json',
          Authorization: token,
        },
      })
      .pipe(catchError(this.handleError));
  }
}
