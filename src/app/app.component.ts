import { Component } from '@angular/core';
import { MenuService } from './services/menu.service';
import { StorageService } from './services/storage.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  jsonData: any;
  newSectionBlock = false;

  userObject = [{
    name: 'Холодные Напитки',
    id: 0
  }];

  isEmptyStorage = false;
  isErrorGetData = false;

  constructor(
    private menuService: MenuService,
    public storageService: StorageService
  ) {
    this.storageService.watchStorage().subscribe((data: string) => {
      console.log(data);
      if (data == 'remove') {
        this.isEmptyStorage = true;
      }
      if (data == 'set') {
        this.isEmptyStorage = false;
      }
    });

    this.menuService.getData().subscribe(
      data => {
        console.info(data);
        this.jsonData = data;
        this.jsonData.map((item: any) => {
          item.expanded = false;
        });
        for (let i = 0; i < this.jsonData.length; i++) {
          this.jsonData[i].id = i;
        }
      },
      error => {
        console.error(error);
        this.isErrorGetData = true;
      }
    );

  }


  ngOnInit() {
    this.getDataFromStorage();
  }

  clearStorage() {
    this.storageService.removeItem('userObject');
  }

  openNewSectionBlock() {
    this.newSectionBlock = !this.newSectionBlock;
  }

  fillStorage(value: object): void {
    console.log(value);
    localStorage.setItem('userObject', JSON.stringify(value));
    console.log(localStorage);
  }

  getDataFromStorage() {
    const userJson = localStorage.getItem('userObject');
    this.userObject = userJson !== null ? JSON.parse(userJson) : null;
    console.log(this.userObject);
    return this.userObject;
  }

  addSection(newSection: string) {
    if (localStorage.length == 0) {
      this.userObject = [];
      this.storageService.setItem('userObject', JSON.stringify([]));
    }
    if (newSection) {
      this.userObject.push({ name: newSection, id: Math.floor(Math.random() * 100) });
      this.fillStorage(this.userObject);
    }
    this.openNewSectionBlock();
  }

  expandMenu(value: object) {
    console.log(value);
  }


}
