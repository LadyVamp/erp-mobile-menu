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
  isExpandLevel1 = false;
  isExpandLevel2 = false;
  isExpandLevel3 = false;


  userObject = [{
    name: 'Холодные Напитки'
  }];

  /*userObject = [{
    "items": [],
    "name": "Холодные Напитки",
    "sections": [
      {
        "items": [
          {
            "name": "Смузи манго-банан 250мл",
            "sale": 90.00
          },
          {
            "name": "Смузи манго-банан 450мл",
            "sale": 170.00
          }
        ],
        "name": "Смузи",
        "sections": []
      },
      {
        "items": [
          {
            "name": "Лимонад клубника-мята 250мл",
            "sale": 50.00
          },
          {
            "name": "Лимонад клубника-мята 450мл",
            "sale": 100.00
          }
        ],
        "name": "Лимонад",
        "sections": []
      }
    ]
  }]*/


  constructor(
    private menuService: MenuService,
    public storageService: StorageService
  ) { }


  ngOnInit() {
    this.storageService.watchStorage().subscribe((data: string) => {
      // this will call whenever your localStorage data changes
      // use localStorage code here and set your data here for ngFor
      console.log(data);
    });

    this.menuService.getData().subscribe((data: any): void => {
      console.info(data);
      this.jsonData = data;
    });
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
    this.userObject = userJson !== null ? JSON.parse(userJson) : '';
    console.log(this.userObject);
  }

  addSection(newSection: string) {
    if (localStorage.length == 0) {
      this.userObject = [];
      this.storageService.setItem('userObject', JSON.stringify([]));
    }
    this.userObject.push({ name: newSection });
    this.fillStorage(this.userObject);
  }

  expandMenu(level: number, title: string, items: string) {
    console.log(
      this.isExpandLevel1,
      this.isExpandLevel2,
      this.isExpandLevel3,
      title,
      items
    );
    switch (level) {
      case 1:
        this.isExpandLevel2 = !this.isExpandLevel2;
        this.isExpandLevel3 = false;
        break;
      case 2:
        this.isExpandLevel3 = !this.isExpandLevel3;
        break;
      default:
        console.log(level);
        break;
    }
  }


}
