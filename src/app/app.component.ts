import { Component } from '@angular/core';
import { MenuService } from './services/menu.service';
import { StorageService } from './services/storage.service';
import { Section, Position,SubSection } from './interfaces';
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

  currentPositionId = 0;
  currentPositionName = '';
  currentPositionSale = 0;
  crudButtonsPositionBlock = false;
  editPositionBlock = false;
  currentSectionParentId = 0;

  userObject = [{
    name: 'Холодные Напитки',
    id: 1,
    expanded: false,
    sections: [
      {
        id: 2,
        parentId: 1,
        name: 'Морс',
        expanded: false,
        items: [
          {
            id: 1,
            sectionId: 2,
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
      console.log(data);
      this.crudButtonsBlock = false;
      this.crudButtonsPositionBlock = false;

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
  expandMenuSubSection(value: SubSection) {
    console.log('expandMenuSubSection', value);
    this.currentSectionId = value.id;
    this.currentSectionName = value.name;
    this.currentSectionParentId = value.parentId;
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
      case 'editPosition':
        this.openEditPositionBlock();
        break;
      case 'deletePosition':
        //
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
        const sectionId = Math.floor(Math.random() * 100)
        const testPositions = [
          { id: Math.floor(Math.random() * 100), sectionId: sectionId, name: 'Морс клюквенный', sale: 100 },
          { id: Math.floor(Math.random() * 100), sectionId: sectionId, name: 'Морс облепиховый', sale: 200 },
        ]
        this.userObject[index].sections.push({ id: sectionId, parentId: Number(parent), name: newSection, expanded: false, items: testPositions })
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

  getPositionInfo(value: Position) {
    console.log(value);
    this.currentPositionId = value.id
    this.currentPositionName = value.name
    this.currentPositionSale = value.sale

    console.log(this.currentPositionId)
  }

  openCrudButtonsPositionBlock() {
    this.crudButtonsPositionBlock = !this.crudButtonsPositionBlock;
  }
  openEditPositionBlock() {
    this.editPositionBlock = !this.editPositionBlock;
  }
  editPosition(id: number) {
    console.log('editPosition', id);

    console.log(this.userObject);
    console.warn(this.userObject[0]); // родительский раздел
    console.log(this.userObject[0].sections); // секции родительского раздела
    console.log(this.userObject[0].sections[0]);  // секция
    console.log(this.userObject[0].sections[0].items); // сюда splice


    console.log(this.currentSectionId);

    // todo вытащить при expandMenu parent id
    console.log(this.currentSectionParentId);    
    const index = this.userObject.findIndex(x => x.id === Number(this.currentSectionParentId));
    console.log(this.userObject[this.currentSectionParentId]);
    console.warn(this.userObject[index]);



  }

}
