import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { DashboardService } from 'src/app/services/dashboard.service';
import { UtilsService } from 'src/app/utils/utis.service';
import * as actionsProfile from '../../../../actions/profile.actions';

@Component({
  selector: 'app-settings-profile',
  templateUrl: './settings-profile.component.html',
  styleUrls: ['./settings-profile.component.scss'],
})
export class SettingsProfileComponent implements OnInit {
  public formProfile: FormGroup;
  public isLoading = false;
  public user: any;
  public isReadOnly = false;

  constructor(
    protected store: Store,
    protected fb: FormBuilder,
    protected dashboardService: DashboardService,
    protected utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    this.formProfile = this.fb.group({
      name: [''],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', Validators.required],
      tel: ['', Validators.required],
    });

    this.store
      .select(({ profile }: any) => ({ user: profile.user }))
      .subscribe(async (state) => {
        this.user = await this.isEmpty(state.user);

        this.formProfile.patchValue({
          name: this.user.name,
          email: this.user.email,
          cpf: this.user.cpf,
          tel: this.user.tel,
        });

        this.isLoading = false;
      });
  }
  public onProfileSubmit(): void {
    this.isLoading = true;
    this.store.dispatch(
      actionsProfile.LISTENING_PROFILE({ payload: this.formProfile.value })
    );
  }

  public isEmpty(user: any): Promise<any> {
    return new Promise((resolve) => {
      if (!this.utilsService.isEmpty(user)) {
        resolve(user);
      }
    });
  }
}
