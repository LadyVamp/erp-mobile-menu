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

  constructor(
    private menuService: MenuService,
    public storageService: StorageService
  ) { }


  ngOnInit() {
    console.log(localStorage.length);

    this.storageService.watchStorage().subscribe((data: string) => {
      // this will call whenever your localStorage data changes
      // use localStorage code here and set your data here for ngFor
      console.log(data);
    })

    this.menuService.getData().subscribe((data: any): void => {
      console.info(data);
      this.jsonData = data;
    });
  }

  getDataFromStorage() {
    console.log(this.storageService.getItem('section'));
  }

  clearStorage() {
    this.storageService.removeItem('section');
  }

  openNewSectionBlock() {
    this.newSectionBlock = !this.newSectionBlock;
  }

  addSection(newSection: string) {
    if (newSection) {
      this.storageService.setItem('section', newSection);
    }
    this.openNewSectionBlock();
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
