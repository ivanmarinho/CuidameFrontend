/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable quote-props */
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
const url = environment.url;

@Injectable({
  providedIn: 'root'
})
export class QrCodeService {

  constructor(private http: HttpClient,) { }

  findByCode(code_request: string, ubicacion: Record<string, unknown>, objeto = ''){
    // console.log({
    //   code_request,
    //   ...ubicacion
    // });
    return this.http.get(`${url}api/auth/bandreq`,{
      params: {
        code_request,
        ...ubicacion,
        objeto
      }
    }).pipe(catchError(this.handleError));
  }

  sendNotification(code_request: string, ubicacion: Record<string, unknown>, objeto = '', mascota = ''){
    // console.log({
    //   code_request,
    //   ...ubicacion
    // });
    return this.http.get(`${url}api/auth/sendNot`,{
      params: {
        code_request,
        ...ubicacion,
        objeto,
        mascota
      }
    }).pipe(catchError(this.handleError));
  }

  sendPetNotification(code_request: string, ubicacion: Record<string, unknown>, objeto = '', mascota = ''){
    // console.log({
    //   code_request,
    //   ...ubicacion
    // });
    return this.http.get(`${url}api/auth/sendpetnotification`,{
      params: {
        code_request,
        ...ubicacion,
        objeto,
        mascota
      }
    }).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    return of(error.error);
  }

}
