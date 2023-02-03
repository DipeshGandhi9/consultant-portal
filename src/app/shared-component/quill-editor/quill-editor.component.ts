import { Component, OnInit, ViewEncapsulation , Output , EventEmitter, Input } from '@angular/core';
import { ControlContainer, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
@Component({
  selector: 'app-quill-editor',
  templateUrl: './quill-editor.component.html',
  styleUrls: ['./quill-editor.component.scss'],
  encapsulation: ViewEncapsulation.None,
  viewProviders:[{ provide: ControlContainer, useExisting: FormGroupDirective }]

})
export class QuillEditorComponent implements OnInit {
  selectedFont: string = "Arial";
  @Input('formGrop') formGrop: FormGroup;
  @Input('fieldName') fieldName: string;
  constructor() { }

  ngOnInit(): void {
    console.log(this.formGrop,this.fieldName)
  }
  
  onFontChange(event: any) {
    this.selectedFont = event.target.value;
  }
}
