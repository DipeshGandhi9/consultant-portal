import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { dialogService } from '../dialog/dialog-service/dialog.service';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input('data') data :any ;
  @Input('tableHeader') tableHeader: any;
  @Input('tableData') tableData: any;
  @Input('isFromDetails') isFromDetails:boolean ;
  @Input('editButtons') editButtons : boolean = true;
  @Output() changeDetect = new EventEmitter<any>();
  @ViewChild('dt') dt: Table;

  searchedValue:string ;

  selectedCustomer2 : any ;
  constructor(
    private router:Router
  ) {}

  ngOnInit(): void {
    
    const localStorageConfig = localStorage.getItem(this.tableData?.TableId);
    const filter = localStorageConfig ? JSON.parse(localStorageConfig) : {};
    this.searchedValue = filter?.filters?.global?.value || '';
  }

  applyFilter(event:any) {
    this.dt.filterGlobal(event?.target.value, 'contains')
  }

  detailsPage(item:any) {
    if (this.isFromDetails) {
      const data = {
        clientId : item.id,
        uuid: item.uuid
      }
      const queryParams: any = {...data};
      this.router.navigate(['clients-consulting'], { queryParams });
    } else {
     this.router.navigate([`/clients/${item.id}`]);
    }
  }
  
  DataChange(type:string,data:any) {
    const payload = {
      type : type,
      data : data
    }
    this.changeDetect.emit(payload)
  }
}
