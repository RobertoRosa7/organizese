import { Component, OnInit, Renderer2, RendererFactory2 } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Store } from '@ngrx/store';
import * as actionsDashboard from '../../actions/dashboard.actions'

@Component({
  selector: 'app-dark-theme',
  templateUrl: './dark-theme.component.html',
  styleUrls: ['./dark-theme.component.scss']
})
export class DarkThemeComponent implements OnInit {
  private renderer: Renderer2
  public isDark: boolean
  private colorTheme: string = ''

  constructor(
    protected _renderedFactory: RendererFactory2,
    protected _store: Store,
  ) {
    this.renderer = this._renderedFactory.createRenderer(null, null)

  }

  ngOnInit(): void {
    this.getColorTheme()
    this.renderer.addClass(document.body, this.colorTheme)
    this.isDark = this.isDarkMode()
  }
  private getColorTheme(): void {
    localStorage.getItem('user-theme')
      ? this.colorTheme = localStorage.getItem('user-theme') || ''
      : this.colorTheme = 'light-mode'
  }

  public isDarkMode(): boolean {
    return this.colorTheme === 'dark-mode'
  }

  public toggleDarkMode(event: MatSlideToggleChange): void {
    this.updateColorTheme(event.checked ? 'dark-mode' : 'light-mode')
    this._store.dispatch(actionsDashboard.DARK_MODE({ payload: event.checked ? 'dark-mode' : 'light-mode' }))
  }

  public updateColorTheme(theme: 'dark-mode' | 'light-mode'): void {
    this.defineColorTheme(theme)
    const previousColorTheme = (theme === 'dark-mode' ? 'light-mode' : 'dark-mode')
    this.renderer.removeClass(document.body, previousColorTheme)
    this.renderer.addClass(document.body, theme)
  }

  private defineColorTheme(theme: string): void {
    this.colorTheme = theme
    localStorage.setItem('user-theme', theme)
  }

}
