import { Component, OnInit, ViewChild } from '@angular/core';
import { from, fromEvent, interval, Observable, Subject, Subscription, timer } from 'rxjs';
import { debounceTime, delay, filter, first, map, takeUntil, takeWhile, tap } from 'rxjs/operators';
import { MatRipple } from '@angular/material/core';

@Component({
  selector: 'app-operators',
  templateUrl: './operators.component.html',
  styleUrls: ['./operators.component.css']
})
export class OperatorsComponent implements OnInit {

  constructor() {
  }

  @ViewChild(MatRipple) ripple: MatRipple;

  color = 'blue';
  searchInput = '';
  searchEntry$: Subject<string> = new Subject<string>();

  ngOnInit(): void {
  }

  mapClick(): void {
    from([1, 2, 3, 4, 5, 6, 7])
      .pipe(
        map(i => i * 2),
        map(i => i * 10),
        delay(2000)
      )
      .subscribe(i => console.log(i));

    fromEvent(document, 'click')
      .pipe(
        map((e: MouseEvent) => ({ x: e.screenX, y: e.screenY }))
      ).subscribe(pos => console.log(pos));
  }

  filterClick(): void {
    from([1, 2, 3, 4, 5, 6, 7])
      .pipe(
        filter(i => i % 2 === 1)
      ).subscribe(i => console.log(i));

    interval(1000)
      .pipe(
        filter(i => i % 2 === 0),
        map(i => 'Value:' + i),
        delay(1000)
      ).subscribe(i => console.log(i));
  }

  tapClick(): void {
    interval(1000)
      .pipe(
        tap(i => console.log('')),
        tap(i => console.warn('Before filter: ', i)),
        filter(i => i % 2 === 0),
        tap(i => console.warn('After filter: ', i)),
        map(i => 'Value:' + i),
        tap(i => console.warn('After map: ', i)),
        delay(1000)
      ).subscribe(i => console.log(i));
  }

  takeClick(): void {
    const observable = new Observable((observer) => {
      let i;
      for (i = 0; i < 20; i++) {
        setTimeout(() => observer.next(Math.floor(Math.random() * 100)), i * 100);
        setTimeout(() => observer.complete(), i * 100);
      }
    });
    const s: Subscription = observable
      .pipe(
        tap(i => console.log(i)),
        // take(10)
        first()
        // last()
      ).subscribe(
        v => console.log('Output:', v),
        (error => console.error(error)),
        () => console.log('Complete')
      );

    const interval = setInterval(() => {
      console.log('Cheking...');
      if (s.closed) {
        console.warn('Subscription CLOSED!');
        clearInterval(interval);
      }
    }, 200);
  }

  lauchRipple(): void {
    const rippleRef = this.ripple.launch({
      persistent: true, centered: true
    });
    rippleRef.fadeOut();
  }

  debounceTimeCLick(): void {
    fromEvent(document, 'click')
      .pipe(
        tap((e) => console.log('Click')),
        debounceTime(1000)
      )
      .subscribe((e: MouseEvent) => {
        console.log('Click with debounceTime:', e);
        this.lauchRipple();
      });
  }

  searchByUsingDebounce(event): void {
    this.searchEntry$.next(this.searchInput);
  }

  debounceTimeSearch(): void {
    this.searchEntry$
      .pipe(debounceTime(500))
      .subscribe(s => console.log(s));
  }

  takeWhileClick(): void {
    interval(500)
      .pipe(takeWhile((value, index) =>
        (value < 5)
      ))
      .subscribe(
        (i) => console.log('takeWhile:', i),
        error => console.error(error),
        () => console.log('Completed!')
      );
  }

  takeUntilClick(): void {

    const duetime$ = timer(5000);

    interval(500)
      .pipe(takeUntil(duetime$))
      .subscribe(
        (i) => console.log('takeWhile:', i),
        error => console.error(error),
        () => console.log('Completed!')
      );
  }

}
