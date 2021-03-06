import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() { }

  private storageSub = new Subject<string>();

  watchStorage(): Observable<any> {
    return this.storageSub.asObservable();
  }

  setItem(key: string, data: any) {
    try {
      localStorage.setItem(key, data);
      this.storageSub.next('set');
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }

  removeItem(key: string) {
    try {
      localStorage.removeItem(key);
      this.storageSub.next('remove');
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

  isEmpty(key: string) {
    if (localStorage.getItem(key) == '[]' || localStorage.getItem(key) == null) {
      this.storageSub.next('empty');
    }
  }

}
