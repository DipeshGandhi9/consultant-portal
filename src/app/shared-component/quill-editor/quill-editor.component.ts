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
    this.selectedFont = this.formGrop.controls[this.fieldName + '_fontStyle'].value;
  }
  
  onFontChange(event: any) {
    this.selectedFont = event.target.value;
    this.formGrop.controls[this.fieldName + '_fontStyle'].setValue(this.selectedFont);
  }
}
