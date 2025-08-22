import { Component } from '@angular/core';
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-main-page.component',
  imports: [SidebarComponent, RouterModule],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.less',
})
export class MainPageComponent {}
