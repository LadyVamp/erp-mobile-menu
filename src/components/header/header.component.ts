import { Component, HostListener } from '@angular/core';
import { description } from '@root/package.json';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  public fullTitle = description;
}
