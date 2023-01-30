import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-quill-editor',
  templateUrl: './quill-editor.component.html',
  styleUrls: ['./quill-editor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class QuillEditorComponent implements OnInit {
  selectedFont: string = "Arial";
  constructor() { }

  ngOnInit(): void {
  }
  
  onFontChange(event: any) {
    this.selectedFont = event.target.value;
  }
}
