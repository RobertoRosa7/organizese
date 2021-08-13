import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogListDevicesComponent } from './dialog-list-devices.component';

describe('DialogListDevicesComponent', () => {
  let component: DialogListDevicesComponent;
  let fixture: ComponentFixture<DialogListDevicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogListDevicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogListDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
