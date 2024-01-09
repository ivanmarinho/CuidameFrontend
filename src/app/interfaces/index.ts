/* eslint-disable @typescript-eslint/naming-convention */
export interface User {
  hashcode: string;
  email: string;
  id: string;
  lastname: string;
  name: string;
  numberID: string;
  phone: string;
  session_token: string;
  typeID: string;
}

export interface Mascota {
    id_pet: string;
    nombre: string;
    especie: string;
    raza: string;
    peso: string;
    fechaNacimiento: string;
    descripcion: string;
    photoBs64: string;
    photoName: string;
}

export interface Paciente {
  id: string;
  code: string;
  nombre: string;
  apellido: string;
  tipoID: string;
  numeroID: string;
  telefono: string;
  edad: string;
  genero: string;
  ciudad: string;
  direccion: string;
  departamento: string;
  rh: string;
  eps: string;
  prepagada: string;
  arl: string;
  seguroFunerario: string;
}

export interface Form2 {
  idPaciente: string;
  enfermedadB: string;
  diagEnfermedad: string;
  discapacidadB: string;
  discapacidad: string;
	embarazada: string;
	cicatricesB: string;
	cicatricesDescripcion: string;
	tatuajesB: string;
	tatuajesDescripcion: string;
}

export interface Form3 {
	idPaciente: string;
	tipoAntecedente: string;
	descripcionAntecedente: string;
	fechaAntecedente: string;
	tipoAntecedenteF: string;
	parentescoF: string;
	descripcionAntecedenteF: string;
}

export interface Form4{
  idPaciente: string;
  medicamento: string;
  laboratorio: string;
  formula: string;
  tipoAlergia: string;
  descripcionAlergia: string;
}

export interface ResponseApi{
  message: string;
  error: string;
  success: boolean;
}

export interface InfoPaciente {
  [key: string]: any;
}

export interface EditInfo {
  [key: string]: any;
}


// export interface ModeloPaciente{
//   nombre
//   apellido
//   edad
//   genero
//   ciudad
//   departamento
//   direccion
//   rh
//   prepagada
//   arl
//   seguroFunerario
//   aCargo
//   aCargoParentesco
// }

// export interface Article {
//   source:       Source;
//   author?:      string;
//   title:        string;
//   description?: string;
//   url:          string;
//   urlToImage?:  string;
//   publishedAt:  Date;
//   content?:     string;
// }

// export interface Source {
//   id?:  string;
//   name: string;
// }

// export interface ArticlesByCategoryAndPage{
//   [key: string]: {
//     page: number;
//     articles: Article[];
//   };
// }
