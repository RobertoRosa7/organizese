import { Injectable } from '@angular/core';
import { fromEvent, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

type Target = Document | Element;

@Injectable({ providedIn: 'root' })
export class ScrollService {
  constructor() {}

  public getScroll(node: Target = document): number {
    const currentScroll = this.getCurrentScroll(node);
    const maxScroll = this.getMaxScroll(node);

    let percent = currentScroll / Math.max(maxScroll, 1);
    percent = Math.max(percent, 0);
    percent = Math.min(percent, 1);

    return percent * 100;
  }

  public getCurrentScroll(node: Target): number {
    return node instanceof Document ? window.pageYOffset : node.scrollTop;
  }

  public getMaxScroll(node: Target): number {
    if (node instanceof Document) {
      const scrollHeight = Math.max(
        node.body.scrollHeight,
        node.body.offsetHeight,
        node.body.clientHeight,
        node.documentElement.scrollHeight,
        node.documentElement.offsetHeight,
        node.documentElement.clientHeight
      );
      const clientHeight = node.documentElement.clientHeight;
      return scrollHeight - clientHeight;
    } else {
      return node.scrollHeight - node.clientHeight;
    }
  }

  public getScrollAsStream(node: Target = document): Observable<number> {
    if (node instanceof Document) {
      return fromEvent(window, 'scroll').pipe(
        map((_: any): number => this.getScroll(node))
      );
    } else {
      return fromEvent(node, 'scroll').pipe(
        map((_: any): number => this.getScroll(node))
      );
    }
  }
}
