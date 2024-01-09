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
  providedIn: 'root',
})
export class MedicamentService {
  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    return of(error.error);
  }

  getAll(id: string, token: string = ''){
    return this.http
      .post(`${url}api/treatment/all`, { id },
      {
        headers: {
          'Content-type': 'application/json',
          Authorization: token,
        },
      })
      .pipe(catchError(this.handleError));
  }

  add(info, token: string = '') {
    return this.http
      .post(`${url}api/treatment/add`, info, {
        headers: {
          'Content-type': 'application/json',
          Authorization: token,
        },
      })
      .pipe(catchError(this.handleError));
  }

  update(info, token: string = '') {
    return this.http
      .post(`${url}api/treatment/update`, info, {
        headers: {
          'Content-type': 'application/json',
          Authorization: token,
        },
      })
      .pipe(catchError(this.handleError));
  }
  getOne(id: string, token: string = ''): Observable<any> {
    return this.http.post(
      `${url}api/treatment/getone`,
      { id },
      {
        headers: {
          'Content-type': 'application/json',
          Authorization: token,
        },
      }
    );
  }

  delete(id: string, token: string = '') {
    return this.http
      .post(`${url}api/treatment/delete`, { id },{
        headers: {
          'Content-type': 'application/json',
          Authorization: token,
        },
      })
      .pipe(catchError(this.handleError));
  }
}
