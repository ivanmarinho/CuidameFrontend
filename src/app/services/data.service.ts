/* eslint-disable @typescript-eslint/dot-notation */
import { Injectable } from '@angular/core';
import { EditInfo, InfoPaciente, Paciente } from '../interfaces';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  deviceNotificationID: string;
  codeRequest: string;
  isCivilAccesing: boolean;

  public registerBand = {
    code: '',
    pin: '',
    parentesco: ''
  };

  public avatar = {
    img: '',
    label: 'Ciudadano',
    seleccionado: true
  };

  womanFlag = false;
  currentUserId = 'userid';

  form1: Paciente = {
    id: '',
    code: '',
    nombre: '',
    apellido: '',
    tipoID: '',
    numeroID: '',
    edad: '',
    genero: '',
    ciudad: '',
    departamento: '',
    direccion: '',
    rh: '',
    eps: '',
    prepagada: '',
    arl: '',
    seguroFunerario: '',
    telefono: '',
  };

  public user = {};
  public infoFormPaciente = {};

  formEnf = {};
  listEnf: number[];

  public infoFormCondicion = {};

  form3Ant = {};
  form6AntF = {};
  // listAnt: number[];
  // listAntFam: number[];


  listMed: number[];
  listAlergias: number[];
  form4Med = {};
  form5Alergia = {};
  formVacunas = {};

  usuarioPaciente: boolean; //Bolean que indica que el usuario será la persona que usara la manilla y no un tercero.
  usuarioRegistrado = {}; //Objeto usado para rellenar automaticamente datos del paciente cuando el paciente es el mismo usuario

/////Edit service

  dataPaciente: EditInfo = {};

  //Variables verificacion de objeto
  verifObjeto: string;
  verifObjetoEscaneado: string;

  scanLocation = {};

  constructor() { }

  public setNotificationID(notificationId: string){
    this.deviceNotificationID = notificationId;
  }

  public getNotificationID(){
    return this.deviceNotificationID;
  }


  public setCodeRequest(code: string){
    this.codeRequest = code;
  }

  public getCodeRequest(){
    // console.log('hashcode dataservice',this.codeRequest);
    return this.codeRequest;
  }

  public setScanLocation(location: Record<string, unknown>){
    this.scanLocation = location;
  }

  public getScanLocation(){
    return this.scanLocation;
  }



  public setAvatar(valor){
    this.avatar = valor;
  }
  public getAvatar(){
    return this.avatar;
  }


  //USUARIO REGISTRADO

  public setUsuarioRegistrado(info: Record<string, unknown>){
    this.usuarioRegistrado = info;
  }

  public getUsuarioRegistrado(){
    return this.usuarioRegistrado;
  }


  public setUsuarioPaciente(info: boolean){
    this.usuarioPaciente = info;

  }


  public getUsuarioPaciente(){
    return this.usuarioPaciente;
  }


  //

  public setWomanFlag(flag: boolean){
    this.womanFlag = flag;
  }
  public getWomanFlag(){
    return this.womanFlag;
  }



  public setForm1(info){
    this.infoFormPaciente = info;
  }
  public getForm1() {
    return this.infoFormPaciente;
  }



  public setFormEnfermedades(formEnf: Record<string, unknown>[], listEnf: number[]){
    this.formEnf = formEnf;
    this.listEnf = listEnf;
  }

  public setFormCondicion(info: Record<string, unknown>){
    this.infoFormCondicion = info;
  }
  public getFormCondicion(){
    return this.infoFormCondicion;
  }


  public setFormAntecedentes(form3Ant: Record<string, unknown>[], listAnt: number[],
                            form6AntF: Record<string, unknown>[], listAntFam: number[]){
    this.form3Ant = form3Ant;
    // this.listAnt = listAnt;
    this.form6AntF = form6AntF;
    // this.listAntFam = listAntFam;
  }


  // public setFormMedAlergia(form4Med: Record<string, unknown>[], listMed: number[],
  //                           form5Alergia: Record<string, unknown>[], listAlergias: number[]){
  //   this.listMed = listMed;
  //   this.form4Med = form4Med;
  //   this.listAlergias = listAlergias;
  //   this.form5Alergia = form5Alergia;

  // }

  public setFormMedAlergia(form4Med: Record<string, unknown>[], form5Alergia: Record<string, unknown>[]){

        this.form4Med = form4Med;
        this.form5Alergia = form5Alergia;

  }

  public setFormVacunas(formVacunas: Record<string, string>[]){
    this.formVacunas = formVacunas;
  }


  ////Edit getter and setter
  public setInfoPaciente(category: string,info){
    this.dataPaciente[category] = info;

  }

 public getDataPaciente(){
   return this.dataPaciente;
 }



 private data: any;

 setData(data: any) {
   this.data = data;
 }

 getData() {
   return this.data;
 }

 private dataHeader: any;

 setDataHeader(data: any) {
   this.dataHeader = data;
 }

 getDataHeader() {
   return this.dataHeader;
 }


private showPage: any;

 setDataPage(data: any) {
   this.showPage = data;
 }

 getDataPage() {
   return this.showPage;
 }


 private hcode: any;

 setCode(data: any) {
   this.hcode = data;
 }

 getCode() {
   return this.hcode;
 }

 private flagSubject = new BehaviorSubject<number>(-1);
 flag$ = this.flagSubject.asObservable();

 setActiveFlag(data: number) {
   this.flagSubject.next(data);
 }

 getActiveFlag(): Observable<number> {
   return this.flag$;
 }

 private req: any;

 setVetRequest(data: any) {
   this.req = data;
 }

 getVetRequest() {
   return this.req;
 }

}
