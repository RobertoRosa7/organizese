import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';

@Injectable({
  providedIn: 'root',
})
export class IpcService {
  private ipc: IpcRenderer | undefined = void 0;
  public isWeb: boolean;

  constructor() {
    if (window.require) {
      try {
        this.ipc = window.require('electron').ipcRenderer;
        this.isWeb = false;
        console.group('%cBem-vindo ao Organizese App', 'color: #2196F3');
      } catch (e) {
        throw e;
      }
    } else {
      this.isWeb = true;
      console.group('%cBem-vindo ao Organizese Web', 'color: #2196F3');
    }
  }

  public on(channel: string, listener: any): void {
    if (!this.ipc) {
      return;
    }
    this.ipc.on(channel, listener);
  }

  public send(channel: string, ...args: any): void {
    if (!this.ipc) {
      return;
    }
    this.ipc.send(channel, ...args);
  }
}
