import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-client-detail-view',
  templateUrl: './client-detail-view.component.html',
  styleUrls: ['./client-detail-view.component.scss']
})
export class ClientDetailViewComponent implements OnInit {

  @Input() clientData: any = {};
  initial:any ;

  constructor() { }

  ngOnInit(): void {
    this.getClientDetails();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getClientDetails();
  }

  getClientDetails() {
    this.initial = this.clientData?.first_name[0]+ this.clientData?.last_name[0] || ""; 
  }

}
