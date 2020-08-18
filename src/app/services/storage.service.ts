import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() { }

  private storageSub = new Subject<String>();

  watchStorage(): Observable<any> {
    return this.storageSub.asObservable();
  }

  setItem(key: string, data: any) {
    try {
      localStorage.setItem(key, data);
      this.storageSub.next('changed');
      console.log(localStorage);
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }

  removeItem(key: string) {
    try {
      localStorage.removeItem(key);
      this.storageSub.next('changed');
      console.log(localStorage);
    }
    catch (e) {
      console.error('Error removing from localStorage', e);
    }
  }

  getItem(key: string) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error('Error getting data from localStorage', e);
      return null;
    }
  }
}
