/* eslint-disable no-underscore-dangle */
import { Storage } from '@ionic/storage-angular';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    //  this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  public set(key: string, value: any) {
    this._storage?.set(key, value);
  }

  

async loadUser(){
  try{
    const user = await this._storage.get('user');
    // console.log('loadser',user);
    return user;
  }catch(error){
    console.log(error);
  }
}

async setPetId(id: string) {
  localStorage.setItem('pet', id);
}

async setPetAgreement(agreement: string) {
  localStorage.setItem('agreement', agreement);
}

getPetId(): string | null {
  const id = localStorage.getItem('pet');
  if (id) {
    return id;
  }
  return null;
}

getPetAgreement(): string | null {
  const agreement = localStorage.getItem('agreement');
  if (agreement) {
    return agreement;
  }
  return null;
}

async setPersonHashcode(hashcode: string) {
  localStorage.setItem('person', hashcode);
}

getPersonHashcode(): string | null {
  const hashcode = localStorage.getItem('person');
  if (hashcode) {
    return hashcode;
  }
  return null;
}

async clear(){
  await this._storage.clear();
}

async setActiveFlag(flag: string) {
  localStorage.setItem('flag', flag);
}

getActiveFlag(): string | null {
  const data = localStorage.getItem('flag');
  if (data) {
    return data;
  }
  return null;
}

}
