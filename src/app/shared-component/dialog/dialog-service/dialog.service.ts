import { Injectable } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogComponent } from '../dialog.component';
import { dialogModule } from '../dialog.module';

@Injectable({
  providedIn: dialogModule,
})
export class dialogService {
  constructor(private dialogService: DialogService) {}

  public consultingDialog(isEditModal?: boolean, data?: any) {
    return new Promise((resolve, reject) => {
      const dialogRef: DynamicDialogRef = this.dialogService.open(
        DialogComponent,
        {
          header: isEditModal
            ? 'Edit Consulting Details '
            : 'Add Consulting Details',
          data: data,
        }
      );

      dialogRef.onClose.subscribe((data: unknown) => {
        resolve(<boolean>data);
      });
    });
  }
}
