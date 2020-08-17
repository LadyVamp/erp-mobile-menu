import { Component } from '@angular/core';
import { AppService } from './app.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  jsonData: any;

  constructor(private service: AppService) { }

  ngOnInit() {
    this.service.getData()
      .subscribe((data: any): void => {
        console.info(data);
        this.jsonData = data;
      });
  }

}

