/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ResponseApi } from '../interfaces/index';
import { Observable, throwError, pipe, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

const url = environment.url;

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  errorMsg: string;
  responseApi: ResponseApi;
  constructor( private http: HttpClient ) { }

  getAuth( persona: string , numeroID: string ,authentication: string)  {

  console.log(persona,authentication);


  //  return this.http.get(`${ url }api/auth/${persona}/${placa}`).pipe(catchError( e => e.error));
  return this.http.get(`${ url }api/auth`,{
    params: {
      persona,
      numeroID,
      authentication
    }
  }).pipe(catchError(this.handleError));
    // console.log(reponse);
    // subscribe( resp => {
    //   console.log(resp);
    // });
  }

  verificarQrPolicia(qrUrl: string){

    return this.http.get(`${ url }api/auth/qrCop`,{
      params: {
        qrUrl
      }
    }).pipe(catchError(this.handleError));

  }

  insertarMedico(nombres: string, numeroID: string){
    return this.http.get(`${ url }api/auth/insertMed`, {
      params: {
        nombres,
        numeroID
      }
    }).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    // if (error.status === 0) {
    //   // A client-side or network error occurred. Handle it accordingly.
    //   console.log('An error occurred:', error.error);
    // } else {
    //   // The backend returned an unsuccessful response code.
    //   // The response body may contain clues as to what went wrong.
    //   console.log(
    //     `Backend returned code ${error.status}, body was: `, error.error);
    // }
    // Return an observable with a user-facing error message.
    return of(error.error);
    // return throwError(() => new Error('Something bad happened; please try again later.'));
  }

}
