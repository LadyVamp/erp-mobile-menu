import { Component } from '@angular/core';
import { MenuService } from './services/menu.service';
import { StorageService } from './services/storage.service';
import { Section } from './interfaces';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent {
  jsonData: any;
  newSectionBlock = false;
  crudButtonsBlock = false;
  currentSectionId = 0;

  editSectionBlock = false;
  currentSectionName = '';

  userObject = [{
    name: 'Холодные Напитки',
    id: 0,
    expanded: false
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
      if (data == 'empty') {
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
    this.storageService.isEmpty('userObject');
  }

  clearStorage() {
    this.storageService.removeItem('userObject');
  }

  openCrudButtonsBlock() {
    this.crudButtonsBlock = !this.crudButtonsBlock;
  }

  fillStorage(value: object): void {
    console.log(value);
    this.storageService.setItem('userObject', JSON.stringify(value));
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
      this.userObject.push({ name: newSection, id: Math.floor(Math.random() * 100), expanded: false });
      this.fillStorage(this.userObject);
    }
    this.openNewSectionBlock();
  }


  expandMenu(value: Section) {
    console.log(value);
    this.currentSectionId = value.id;
    this.currentSectionName = value.name;
  }

  openNewSectionBlock() {
    this.newSectionBlock = !this.newSectionBlock;
  }
  openEditSectionBlock() {
    this.editSectionBlock = !this.editSectionBlock;
  }

  crud(operation: string, id?: number) {
    console.log(operation, this.currentSectionId);
    switch (operation) {
      case 'addPosition':
        //
        break;
      case 'addSection':
        this.openNewSectionBlock();
        break;
      case 'edit':
        this.openEditSectionBlock();
        break;
      case 'delete':
        const index = this.userObject.findIndex(x => x.id === id);
        this.userObject.splice(index, 1);
        this.fillStorage(this.userObject);
        this.storageService.isEmpty('userObject');
        break;
    }
    this.openCrudButtonsBlock();
  }

  editSection(id: number) {
    const index = this.userObject.findIndex(x => x.id === id);
    this.userObject[index].name = this.currentSectionName;
    this.fillStorage(this.userObject);
    this.openEditSectionBlock();
  }


}
