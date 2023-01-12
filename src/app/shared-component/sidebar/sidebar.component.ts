import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Router } from '@angular/router';

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class SidebarComponent implements OnInit {
  menuItems: any[] = [];
  @Input() visibleSidebar: boolean = true;

  constructor(
    public translate: TranslateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.menuItems = [
      { index: 0, label: "DASHBOARD", icon: "pi pi-th-large" },
      {
        index: 1,
        label: this.translate.instant("global.clients"),
        icon: "pi pi-users",
      },
      { index: 2, label: this.translate.instant("global.consulting"), icon: "pi pi-clock" },
    ];
    this.getSelectedMenu();
  }

  onClickMenuItem(item: any) {
    let navigateToComponent = (item.target.innerText).toLowerCase();
    navigateToComponent = navigateToComponent.replace(/ +/g, "");
    this.router.navigate([`${navigateToComponent}`]).then((response) => {
      this.getSelectedMenu();
    });
  }

  getSelectedMenu() {
    let activeRoutes = this.router.url.split("/")[1];
    const index = this.menuItems.findIndex((i: any) => activeRoutes?.toLowerCase() == i.label.toLowerCase());
    this.menuItems = this.menuItems.map((item: any) => {
      const route = item.label.toLowerCase().replace(/ +/g, "");;
      if (activeRoutes == route) {
        return item[index] = { ...item, styleClass: 'active-menu' };
      } else {
        return item[index] = { index: item.index, label: item.label, icon: item.icon };
      }
    });
  }
}
