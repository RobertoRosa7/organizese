import { Directive, ElementRef, EventEmitter, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ScrollService } from '../services/scroll.service';

@Directive({
  selector: '[onScroll]',
  outputs: ['scrollEvent: scroll'],
})
export class ScrollDirective implements OnInit {
  public scrollEvent: EventEmitter<number>;
  private elementRef: ElementRef;
  private subscription: Subscription;
  private scrollService: ScrollService;

  constructor(elementRef: ElementRef, scrollService: ScrollService) {
    this.elementRef = elementRef;
    this.scrollEvent = new EventEmitter();
    this.scrollService = scrollService;
    this.subscription = new Subscription();
  }

  // public ngOnDestroy(): void {
  //   this.subscription && this.subscription.unsubscribe();
  // }

  public ngOnInit(): void {
    this.subscription = this.scrollService
      .getScrollAsStream(this.elementRef.nativeElement)
      .subscribe((percent: number): void => this.scrollEvent.next(percent));
  }
}
