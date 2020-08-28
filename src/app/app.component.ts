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
  editSectionBlock = false;
  confirmDeleteBlock = false;

  currentSectionId = 0;
  currentSectionName = '';

  userObject = [{
    name: 'Холодные Напитки',
    id: 1,
    expanded: false,
    sections: [
      {
        id: 0,
        parentId: 1,
        name: 'Морс',
        expanded: false,
        items: [
          {
            name: 'Морс клюквенный 250мл',
            sale: 100
          },
        ],
      }
    ]
  }]

  isEmptyStorage = false;
  isErrorGetData = false;

  selectedParentId = 0;

  constructor(
    private menuService: MenuService,
    public storageService: StorageService
  ) {
    this.storageService.watchStorage().subscribe((data: string) => {
      // console.log(data);

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

  expandMenu(value: Section) {
    console.log(value);
    this.currentSectionId = value.id;
    this.currentSectionName = value.name;
  }

  openNewSectionBlock() {
    this.newSectionBlock = !this.newSectionBlock;
    this.selectedParentId = 0;
  }
  openEditSectionBlock() {
    this.editSectionBlock = !this.editSectionBlock;
  }
  openConfirmDeleteBlock() {
    this.confirmDeleteBlock = !this.confirmDeleteBlock;
  }

  crud(operation: string) {
    console.log(operation);
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
        this.openConfirmDeleteBlock();
        break;
    }
    this.openCrudButtonsBlock();
  }

  addSection(newSection: string, parent: number) {
    console.log(newSection, parent);
    if (localStorage.length == 0) {
      console.log(localStorage.length);
      this.userObject = [];
      this.storageService.setItem('userObject', JSON.stringify([]));
    }
    if (newSection) { // заполнено название
      if (parent == 0) { // по умолчанию первый уровень
        console.log(parent);
        this.userObject.push({ name: newSection, id: Math.floor(Math.random() * 100), expanded: false, sections: [] });
      } else if (parent !== 0) { // выбран родительский раздел    
        const index = this.userObject.findIndex(x => x.id === Number(parent));
        this.userObject[index].sections.push({ id: Math.floor(Math.random() * 100), parentId: parent, name: newSection, expanded: false, items: [{ name: 'Морс клюквенный', sale: 100 },] })
      }
      this.fillStorage(this.userObject);
      this.openNewSectionBlock();
    }
  }

  editSection(id: number) {
    const index = this.userObject.findIndex(x => x.id === id);
    this.userObject[index].name = this.currentSectionName;
    this.fillStorage(this.userObject);
    this.openEditSectionBlock();
  }

  deleteSection(id: number) {
    const index = this.userObject.findIndex(x => x.id === id);
    this.userObject.splice(index, 1);
    this.fillStorage(this.userObject);
    this.storageService.isEmpty('userObject');
    this.openConfirmDeleteBlock();
  }

  onChange(event: any) {
    this.selectedParentId = event.target.value
    console.log(this.selectedParentId);
  }

}
