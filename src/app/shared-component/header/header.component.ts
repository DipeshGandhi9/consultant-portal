import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges }  from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AutenticationAction } from 'src/app/store/authorization';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnChanges {

  @Input() visibleSidebar: boolean = true;
  @Output() showSidebar = new EventEmitter();
  showSearchBar: boolean = true;
  searchedText: string = "";
  information : boolean = false ;
  @Output() changeText = new EventEmitter();

  constructor(
    private router: Router,
    public store:Store
  ) {}

  ngOnInit(): void {
    if(this.router.url == '/dashboard' || this.router.url.includes('clients/consulting')) {
      this.showSearchBar = false;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.changeText.emit(this.searchedText);
  }

  onChangeText(event: any) {
    this.searchedText = event.target.value;
    this.changeText.emit(this.searchedText);
  }

  onShowSidebarClick() {
    this.showSidebar.emit();
  }
  logout() {
    this.store.dispatch(AutenticationAction.Logout);
  }
  routeToDashboard() {
    this.router.navigateByUrl('https://jyotitechnosoft.com/')
  }
}
