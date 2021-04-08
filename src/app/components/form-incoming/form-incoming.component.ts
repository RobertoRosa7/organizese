import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { Register } from 'src/app/models/models';

const MY_FORMATS = {
  parse: { dateInput: 'DD MM YYYY' },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-form-incoming',
  templateUrl: './form-incoming.component.html',
  styleUrls: ['./form-incoming.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class FormIncomingComponent implements OnInit {
  @Input() public label = '';
  @Input() public placeholder = '';
  @Input() public type = '';
  @Input() public payload: Register;
  @Input() public edit: boolean;

  @Output() public send = new EventEmitter();

  public form: FormGroup;
  public isDisabled = true;
  public isMobile = false;
  public charTotal = 50;
  public charCount = 50;
  public categories: string[] = [
    'Banco',
    'Alimentação',
    'Vestuário',
    'Transporte',
    'Água & Luz',
    'Internet',
    'Pessoal',
    'Trabalho',
  ].sort();

  constructor(private fb: FormBuilder, private breakpoint: BreakpointObserver) {
    this.form = this.fb.group({
      value: [''],
      date: [new Date()],
      description: '',
      category: [''],
    });
    this.breakpoint
      .observe([Breakpoints.XSmall])
      .subscribe((result) => (this.isMobile = !!result.matches));
  }

  public ngOnInit(): void {
    if (this.edit) {
      this.form.patchValue({
        value: this.payload.value,
        description: this.payload.description,
        date: new Date(this.payload.created_at * 1000),
        category: this.payload.category,
      });
      const totalString = this.payload.description?.length || 0;
      this.charCount = this.charTotal - totalString;
      this.isDisabled = !this.payload.value;
    }

    this.form
      .get('value')
      ?.valueChanges.subscribe((val) => (this.isDisabled = !val));
    this.form.get('description')?.valueChanges.subscribe((text) => {
      if (text) {
        this.charCount = this.charTotal - text.length;
      }
    });
  }

  public onSubmit(_: any, type: string): void {
    const payload = {
      created_at: new Date(this.form.value.date).getTime() / 1000,
      value: this.form.value.value,
      description: this.form.value.description,
      category: this.form.value.category,
      type,
    };

    switch (type) {
      case this.type:
        this.form.get('value')?.reset();
        this.form.get('description')?.reset();
        this.form.get('category')?.reset();
        break;
    }
    this.send.emit(payload);
  }

  public close(options?: any): void {
    this.send.emit(options);
  }
}
