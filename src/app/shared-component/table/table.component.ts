import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input('data') data :any ;
  @Input('tableHeader') tableHeader: any;
  @Input('tableData') tableData: any;
  @Input('editButtons') editButtons : boolean = true;
  @Output() changeDetect = new EventEmitter<any>();
  @ViewChild('dt') dt: Table;


  customers2:any ;
  searchedValue:string ;

  selectedCustomer2 : any ;
  constructor() {}

  ngOnInit(): void {
    
    const localStorageConfig = localStorage.getItem(this.tableData?.TableId);
    const filter = localStorageConfig ? JSON.parse(localStorageConfig) : {};
    this.searchedValue = filter?.filters?.global?.value || '';
  }

  applyFilter(event:any) {
    this.dt.filterGlobal(event?.target.value, 'contains')
  }
  DataChange(type:string,data:any) {
    const payload = {
      type : type,
      data : data
    }
    this.changeDetect.emit(payload)
  }
}
