import { Component, OnDestroy, OnInit } from '@angular/core';
import { fromEvent, interval, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-unsubscribe',
  templateUrl: './unsubscribe.component.html',
  styleUrls: ['./unsubscribe.component.css']
})
export class UnsubscribeComponent implements OnInit, OnDestroy {

  subscriptionsAreActive = false;
  subscriptions: Subscription[] = [];
  intervalSubscription: Subscription = null;
  unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor() {
  }

  ngOnInit(): void {
    this.checkSubscriptions();
  }

  checkSubscriptions(): void {
    this.intervalSubscription = interval(100).subscribe(() => {
      let active = false;
      this.subscriptions.forEach(s => {
        if (!s.closed) {
          active = true;
        }
      });
      this.subscriptionsAreActive = active;
    });
  }

  subscribe(): void {
    const subscription1 = interval(100)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe(i => console.log(i));
    const subscription2 = fromEvent(document, 'mousemove')
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe(e => console.log(e));
    this.subscriptions.push(subscription1);
    this.subscriptions.push(subscription2);
  }

  unsubscribe(): void {
    this.unsubscribeAll$.next();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next();
  }

}
