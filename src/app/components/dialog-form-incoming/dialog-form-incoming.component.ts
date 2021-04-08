import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Register } from 'src/app/models/models';

@Component({
  selector: 'app-dialog-form-incoming',
  templateUrl: './dialog-form-incoming.component.html',
  styleUrls: ['./dialog-form-incoming.component.scss'],
})
export class DialogFormIncomingComponent implements OnInit {
  public type = '';
  public label = '';
  public value: string | number;
  public edit: boolean;
  public description: string | undefined;

  public payload: Register;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Register,
    private dialogRef: MatDialogRef<DialogFormIncomingComponent>
  ) {}

  public ngOnInit(): void {
    this.payload = this.data;
    this.type = this.data.type;
    this.value = this.data.value;
    this.edit = this.data.edit || false;
    this.description = this.data.description;
    this.data.type === 'incoming'
      ? (this.label = 'Entrada')
      : (this.label = 'Saída');
  }

  public listeningEventForm(event: any): void {
    this.dialogRef.close(event);
  }

  public close(): void {
    this.dialogRef.close();
  }
}
