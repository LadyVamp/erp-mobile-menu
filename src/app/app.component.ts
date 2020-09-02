import { Component } from '@angular/core';
import { MenuService } from './services/menu.service';
import { StorageService } from './services/storage.service';
import { Section, SubSection, Position } from './interfaces';
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
  currentPositionSectionId = 0;
  currentPositionName = '';
  currentPositionSale = 0;
  crudButtonsPositionBlock = false;
  editPositionBlock = false;
  currentSectionParentId = 0;

  testPlaceholder = 'Раздел';

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
  }];

  isEmptyStorage = false;
  isErrorGetData = false;

  selectedParentId = 0;

  constructor(
    private menuService: MenuService,
    public storageService: StorageService
  ) {
    this.storageService.watchStorage().subscribe((data: string) => {
      console.info(data);
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
    this.testPlaceholder = 'Раздел';
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
        const sectionId = Math.floor(Math.random() * 100);
        const testPositions = [
          { id: Math.floor(Math.random() * 1000), sectionId, name: 'Морс клюквенный', sale: 100 },
          { id: Math.floor(Math.random() * 1000), sectionId, name: 'Морс облепиховый', sale: 200 },
        ];
        this.userObject[index].sections.push({ id: sectionId, parentId: Number(parent), name: newSection, expanded: false, items: testPositions });
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
    this.selectedParentId = Number(event.target.value);
    console.log(this.selectedParentId);
    this.fillPlaceholder(this.selectedParentId);
  }

  fillPlaceholder(id: number) {
    const index = this.userObject.findIndex(x => x.id === id);
    const amount = this.userObject[index].sections.length;

    if (this.selectedParentId === 0) {
      this.testPlaceholder = 'Раздел';
    } else {
      this.testPlaceholder = 'подраздел' + index + amount;
    }
  }

  getPositionInfo(value: Position) {
    console.log(value);
    this.currentPositionId = value.id;
    this.currentPositionSectionId = value.sectionId;
    this.currentPositionName = value.name;
    this.currentPositionSale = value.sale;

    console.log(this.currentPositionId);
  }

  openCrudButtonsPositionBlock() {
    this.crudButtonsPositionBlock = !this.crudButtonsPositionBlock;
  }
  openEditPositionBlock() {
    this.editPositionBlock = !this.editPositionBlock;
    this.crudButtonsPositionBlock = false;
  }

  editPosition(id: number) {
    // console.log('editPosition', id)
    // console.log(this.userObject);

    try {
      console.log('currentSectionParentId', this.currentSectionParentId);
      console.log('currentPositionSectionId', this.currentPositionSectionId);

      for (let i = 0; i < this.userObject[i].sections.length; i++) {
        const section = this.userObject[i].sections.find(x => x.id === this.currentPositionSectionId);
        this.currentSectionParentId = Number(section?.parentId);
        console.log('currentSectionParentId', this.currentSectionParentId);
      }

      // todo теперь index3 == -1 :(

      // индекс раздела
      const index1 = this.userObject.findIndex(x => x.id === this.currentSectionParentId);
      console.warn('index1', index1);

      // индекс подраздела
      const index2 = this.userObject[index1].sections.findIndex(x => x.id === Number(this.currentPositionSectionId));
      console.warn('index2', index2);
      console.log('раздел', this.userObject[index1]);
      console.log('подразделы раздела', this.userObject[index1].sections);
      console.log('подраздел', this.userObject[index1].sections[index2]);
      console.log('сюда splice', this.userObject[index1].sections[index2].items);

      // индекс изменяемой позиции     
      const index3 = this.userObject[index1].sections[index2].items.findIndex(x => x.id === Number(this.currentPositionSectionId));
      console.log(this.userObject[index1].sections[index2].items);
      console.warn('index3', index3);

      this.userObject[index1].sections[index2].items.splice(index3, 1,
        { id: this.currentPositionId, sectionId: this.currentPositionSectionId, name: this.currentPositionName, sale: this.currentPositionSale });

      this.fillStorage(this.userObject);
      this.openEditPositionBlock();
    } catch (e) {
      console.error(e);
    }

  }

}
