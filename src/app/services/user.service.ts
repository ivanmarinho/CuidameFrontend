/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable, OnInit } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { NgForm } from '@angular/forms';

import { StorageService } from 'src/app/services/storage.service';
import { Paciente, ResponseApi } from '../interfaces/index';
import { environment } from '../../environments/environment';
import { Observable, of, pipe } from 'rxjs';
import { catchError } from 'rxjs/operators';
const url = environment.url;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  // create( fLogin: NgForm ){
  //   console.log(fLogin.form.value);
  //   return this.http.post(`${ url }api/users/create`,fLogin.form.value, {
  //     headers: {
  //       'Content-type': 'application/json'
  //     }
  //   }).pipe(catchError(this.handleError));

  // }

  ///// CREAR NUEVO USUARIO /////

  addPersonaImage( formData: FormData, token: string = '') {
    const headers = {
      Authorization: token,
    };
    return this.http
      .post(`${url}api/persona/addimage`, formData, {
        headers,
      })
      .pipe(catchError(this.handleError));
  }


  updateUser(info, token: string = '') {
    return this.http
      .post(`${url}api/users/updateuser`, info, {
        headers: {
          'Content-type': 'application/json',
          Authorization: token,
        },
      })
      .pipe(catchError(this.handleError));
  }

  createUser(info) {
    return this.http
      .post(`${url}api/users/registerUser`, info, {
        headers: {
          'Content-type': 'application/json',
        },
      })
      .pipe(catchError(this.handleError));
  }

  ////// ELIMINAR USUARIO E INFO /////

  deleteUser(email) {
    return this.http
      .post(
        `${url}api/users/deleteUser`,
        { email },
        {
          headers: {
            'Content-type': 'application/json',
          },
        }
      )
      .pipe(catchError(this.handleError));
  }

  ///// REENVIAR CORREO DE CONFIRMACIÓN ///////

  resendEmail(user, token: string) {
    return this.http
      .post(`${url}api/users/resendEmail`, user, {
        headers: {
          Authorization: token,
        },
      })
      .pipe(catchError(this.handleError));
  }

  ///// LOGIN /////

  login(fLogin: NgForm, notificationID: string) {
    return this.http
      .post(
        `${url}api/users/login`,
        { ...fLogin.form.value, notificationID },
        {
          headers: {
            'Content-type': 'application/json',
          },
        }
      )
      .pipe(catchError(this.handleError));
  }

  //// BAND AUTH /////

  bandAuth(fLogin: NgForm) {
    return this.http
      .post(`${url}api/users/bandAuth`, fLogin.form.value, {
        headers: {
          'Content-type': 'application/json',
        },
      })
      .pipe(catchError(this.handleError));
  }

  ///// CREAR REGISTROS DE FORMULARIOS PACIENTE/////

  // createForm( info, token: string = ''){
  //   console.log('Esta es la info que se envia a al query',info);
  //   return new Promise ((resolve, reject) => {
  //     const req = this.http.post(`${ url }api/users/registerForm`,info, {
  //       headers: {
  //         'Content-type': 'application/json',
  //         'Authorization': token
  //       }
  //     }).pipe(catchError(this.handleError));
  //   });

  // }

  createForm(info, token: string = '') {
    console.log('Esta es la info que se envia a al query', info);
    return this.http
      .post(`${url}api/users/registerForm`, info, {
        headers: {
          'Content-type': 'application/json',
          Authorization: token,
        },
      })
      .pipe(catchError(this.handleError));
  }

  getAllPersons(id: string, token: string = '') {
    return this.http
      .post(
        `${url}api/person/all`,
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

  updateInfo(info, token: string = '') {
    console.log('Esta es la info que se envia a al query', info);
    return this.http
      .post(`${url}api/users/updateInfo`, info, {
        headers: {
          'Content-type': 'application/json',
          Authorization: token,
        },
      })
      .pipe(catchError(this.handleError));
  }

  registerContacts(info, token: string = '') {
    console.log('Esta es la info que se envia a al query contactos', info);
    return this.http
      .post(`${url}api/users/registerContact`, info, {
        headers: {
          'Content-type': 'application/json',
          Authorization: token,
        },
      })
      .pipe(catchError(this.handleError));
  }

  retrieveInfo(hashcode: string, category: string, id: string) {
    return this.http
      .get(`${url}api/users/retrieve`, {
        // headers: {
        //   'Authorization': token
        // },
        params: {
          hashcode,
          ref: category,
          id,
        },
      })
      .pipe(catchError(this.handleError));
  }

  test() {
    return this.http
      .get(`https://qr.policia.gov.co:8082/1A9F54575asdas03B`, {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      })
      .pipe(catchError(this.handleError));
  }

  retrieveContacts(
    cod: string,
    category: string,
    id: string,
    token: string = ''
  ) {
    return this.http
      .get(`${url}api/users/retrieve`, {
        headers: {
          Authorization: token,
        },
        params: {
          codigo: cod,
          ref: category,
          idPaciente: id,
        },
      })
      .pipe(catchError(this.handleError));
  }

  registerObject(info, token: string = '') {
    return this.http
      .post(`${url}api/users/registerObject`, info, {
        headers: {
          'Content-type': 'application/json',
          Authorization: token,
        },
      })
      .pipe(catchError(this.handleError));
  }

  deleteObject(info, token: string = '') {
    console.log(
      'Esta es la info que se envia a al query de registrar objeto',
      info
    );
    return this.http
      .post(`${url}api/users/deleteObject`, info, {
        headers: {
          'Content-type': 'application/json',
          Authorization: token,
        },
      })
      .pipe(catchError(this.handleError));
  }

  retrieveObjects(
    cod: string,
    category: string,
    id: string,
    token: string = ''
  ) {
    return this.http
      .get(`${url}api/users/retrieve`, {
        headers: {
          Authorization: token,
        },
        params: {
          codigo: cod,
          ref: category,
          idPaciente: id,
        },
      })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    return of(error.error);
  }

  getLicence(hashcode: string) {
    return this.http
      .post(`${url}api/users/license`, { hashcode })
      .pipe(catchError(this.handleError));
  }

  getOneUser(id) {
    return this.http
      .post(`${url}api/users/getoneuser`, { id })
      .pipe(catchError(this.handleError));
  }

  // --------------------------- PETS --------------------------------------

  registerMascota(info, token: string = '') {
    return this.http
      .post(`${url}api/users/createpet`, info, {
        headers: {
          'Content-type': 'application/json',
          Authorization: token,
        },
      })
      .pipe(catchError(this.handleError));
  }

  getOnePet(id_usuario: string, token: string = ''): Observable<any> {
    return this.http.post(
      `${url}api/users/getonepet`,
      { id_usuario },
      {
        headers: {
          'Content-type': 'application/json',
          Authorization: token,
        },
      }
    );
  }

  createPet(formData: FormData, token: string = '') {
    const headers = {
      Authorization: token,
    };
    return this.http
      .post(`${url}api/users/createpet`, formData, {
        headers,
      })
      .pipe(catchError(this.handleError));
  }

  getPet(hashcode: string, token: string = '') {
    return this.http
      .post(
        `${url}api/users/getpet`,
        { hashcode },
        {
          headers: {
            'Content-type': 'application/json',
            Authorization: token,
          },
        }
      )
      .pipe(catchError(this.handleError));
  }

  existsPet(hashcode: string) {
    return this.http
      .post(`${url}api/users/existspet`, { hashcode })
      .pipe(catchError(this.handleError));
  }

  createPetVaccine(info, token: string = '') {
    return this.http
      .post(`${url}api/users/createpetvaccine`, info, {
        headers: {
          'Content-type': 'application/json',
          Authorization: token,
        },
      })
      .pipe(catchError(this.handleError));
  }

  getPetVaccine(hashcode: string) {
    return this.http
      .post(`${url}api/users/getpetvaccine`, { hashcode })
      .pipe(catchError(this.handleError));
  }

  createDewormer(info, token: string = '') {
    return this.http
      .post(`${url}api/users/createdewormer`, info, {
        headers: {
          'Content-type': 'application/json',
          Authorization: token,
        },
      })
      .pipe(catchError(this.handleError));
  }
  getDewormer(hashcode: string) {
    return this.http
      .post(`${url}api/users/getdewormer`, { hashcode })
      .pipe(catchError(this.handleError));
  }

  createDisease(info, token: string = '') {
    return this.http
      .post(`${url}api/users/createdisease`, info, {
        headers: {
          'Content-type': 'application/json',
          Authorization: token,
        },
      })
      .pipe(catchError(this.handleError));
  }

  getDisease(hashcode: string) {
    return this.http
      .post(`${url}api/users/getdisease`, { hashcode })
      .pipe(catchError(this.handleError));
  }

  createSpecialCondition(info, token: string = '') {
    return this.http
      .post(`${url}api/users/createscondition`, info, {
        headers: {
          'Content-type': 'application/json',
          Authorization: token,
        },
      })
      .pipe(catchError(this.handleError));
  }

  getSpecialCondition(hashcode: string) {
    return this.http
      .post(`${url}api/users/getspecialcondition`, { hashcode })
      .pipe(catchError(this.handleError));
  }

  createVeterinarian(info, token: string = '') {
    return this.http
      .post(`${url}api/users/createveterinarian`, info, {
        headers: {
          'Content-type': 'application/json',
          Authorization: token,
        },
      })
      .pipe(catchError(this.handleError));
  }

  getVeterinarian(hashcode: string) {
    return this.http
      .post(`${url}api/users/createveterinarian`, { hashcode })
      .pipe(catchError(this.handleError));
  }

  getDepartments() {
    return this.http
      .get(`${url}api/users/departments`)
      .pipe(catchError(this.handleError));
  }

  getTownships(id: number) {
    return this.http
      .post(`${url}api/users/townships`, { id })
      .pipe(catchError(this.handleError));
  }

  forgotPassword(email: string) {
    return this.http
      .put(`${url}api/users/forgotpassword`, { email })
      .pipe(catchError(this.handleError));
  }

  uploadFile(formData: FormData, token: string = ''): Observable<any> {
    return this.http.post(`${url}api/users/upload`, formData);
  }

  resetPassword(
    id: string,
    resetToken: string,
    newPassword: string
  ): Observable<any> {
    const body = { newPassword: newPassword };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.put(
      `${url}api/users/newpassword/${id}/${resetToken}`,
      body,
      httpOptions
    );
  }
  // ===================== pets ==============================

  private petId = '';

  getPetId(): string {
    return this.petId;
  }

  setPetId(newPetId: string) {
    this.petId = newPetId;
  }

  getOwner(id: string) {
    return this.http
      .post(`${url}api/pets/getowner`, { id })
      .pipe(catchError(this.handleError));
  }

  getAllPets(id: string) {
    return this.http
      .post(`${url}api/pets/all`, { id })
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
  getPets(id: string, token: string = ''): Observable<any> {
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
}
