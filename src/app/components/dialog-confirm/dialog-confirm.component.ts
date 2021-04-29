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
  public title: string;
  public label: string;
  public description: string;

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

    this.label = 'Confirmar';
    switch (this.data.type) {
      case 'logout':
        this.title = 'Sair';
        this.description = 'Tem certeza que quer encerrar a sessão?';
        break;
      default:
        this.title = 'Excluir';
        this.description = 'Tem certeza que quer excluir?';
    }
  }

  public close(options?: boolean): void {
    this.dialogRef.close(options);
  }

  public returnColor(): string {
    return this.isDark ? '#e91e63' : '#FF4081';
  }
}
