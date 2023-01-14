import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';

import { ClientAction } from 'src/app/store/client';

@Component({
  selector: 'app-full-layout',
  templateUrl: './full-layout.component.html',
  styleUrls: ['./full-layout.component.scss'],
})
export class FullLayoutComponent implements OnInit {
  visibleSidebar: boolean = true;
  searchedText: string = "";
  
  constructor(
    private store: Store
  ) {}

  ngOnInit(): void {}

  showSidebar() {
    this.visibleSidebar = !this.visibleSidebar;
  }

  changeText(event: any) {
    this.searchedText = event;
    this.store.dispatch(new ClientAction.getSearchedClients(event));
  }
}
