import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-consulting-details',
  templateUrl: './consulting-details.component.html',
  styleUrls: ['./consulting-details.component.scss']
})
export class ConsultingDetailsComponent implements OnInit {

  searchedText: string = "";
  consulting: any = {};

  constructor(
    public translate: TranslateService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    const myArray = this.activatedRoute.snapshot.queryParamMap.get('myArray');
    if (myArray === null) {
      this.consulting = new Array<string>();
    } else {
      this.consulting = JSON.parse(myArray);
    }
  }

}
