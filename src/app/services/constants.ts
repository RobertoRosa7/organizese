import { environment } from '../../environments/environment';

export class Constants {
  private readonly host: string;

  constructor() {
    if (environment.production) {
      this.host = 'https://api-organizese.herokuapp.com/';
      // this.host = 'http://127.0.0.1:5000/'
    } else {
      this.host = 'http://127.0.0.1:5000/';
      // this.host = 'https://api-organizese.herokuapp.com/'
    }
  }

  public readonly paths: any = {
    fetch_is_online: '',

    fetch_consolidado: 'dashboard/calc_consolidado',
    fetch_registers: 'dashboard/fetch_registers',
    fetch_registers_to_dashboard: 'dashboard/fetch_registers_to_dashboard',
    fetch_evolucao: 'dashboard/fetch_evolucao',
    fetch_evolucao_despesas: 'dashboard/fetch_evolucao_despesas',
    fetch_evolucao_detail: 'dashboard/fetch_evolucao_detail',
    fetch_search: 'dashboard/search',
    fetch_excel: 'dashboard/excel',
    fetch_graph_category: 'dashboard/fetch_graph_category',
    fetch_lastdate: 'dashboard/fetch_lastdate_outcome',

    new_register: 'dashboard/new_register',
    delete_register: 'dashboard/delete_register',
    update_register: 'dashboard/update_register',
    update_user: 'dashboard/update_user',

    get_status_code: 'dashboard/get_status_code',
    get_list_autocomplete: 'dashboard/get_list_autocomplete',
    set_dev_mode: 'dashboard/set_dev_mode',

    signup: 'login/signup',
    signin: 'login/signin',
    reset_password: 'login/reset_password',
    login_verified: 'login/login_verified',
    email_to_reset: 'login/email_to_reset',

    profile_update: 'profile/update',
    profile_get: 'profile/get_profile',
    profile_delete: 'profile/delete',

    file_images: 'files/images?name=',
    file_download_list: 'files/download_list',
    file_download: 'files/download',
  };

  public get(key: string, host?: string): string {
    host = host ? host : this.host;
    const path = host + this.paths[key];
    if (path === undefined) {
      throw new Error('Couldnt find ' + key + ' in paths');
    }

    return path;
  }
}
