import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.scss'],
})
export class DialogConfirmComponent implements OnInit {
  public isDark: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DialogConfirmComponent>,
    private store: Store
  ) {}

  public ngOnInit(): void {
    this.store
      .select(({ dashboard }: any) => ({
        theme: dashboard.dark_mode,
      }))
      .subscribe(async (state) => {
        this.isDark = !(state.theme === 'dark-mode');
      });
  }

  public close(options?: boolean): void {
    this.dialogRef.close(options);
  }

  public returnColor(): string {
    return this.isDark ? '#e91e63' : '#FF4081';
  }
}
