import { Component, OnInit } from '@angular/core';
import { Observable, pipe, throwError, timer } from 'rxjs';
import { catchError, map, retryWhen, tap, timeout } from 'rxjs/operators';

@Component({
  selector: 'app-error-handling',
  templateUrl: './error-handling.component.html',
  styleUrls: ['./error-handling.component.css']
})
export class ErrorHandlingComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

  startTest(): void {
    const obj: Observable<any> = new Observable<any>((observer) => {
      for (let i = 0; i < 10; i++) {
        if (i === 7) {
          observer.error(`An error ocurred when i = ${ i }`);
        } else {
          observer.next(i);
        }
      }
    });
    obj
      .pipe(
        map(i => i * 10),
        tap(i => console.log(`Before error handling: ${ i }`)),
        catchError(err => {
          console.error('Inside catchError:', err);
          // return of(0);
          return throwError('throwError: Error');
        }),
        // retry(2),
        retryWhen(i => timer(5000))
      )
      // .subscribe(
      //   (i) => console.log(`Normal output: ${ i }`),
      //   error => console.log(error),
      //   () => console.log('Completed!')
      // );

    const obj2: Observable<any> = new Observable<any>((observer) => {
      timer(2000).subscribe(n => observer.next(1000));
      timer(2500).subscribe(n => observer.complete());
    });
    obj2
      .pipe(
        timeout(2400)
      )
      .subscribe(
      (i) => console.log(`N: ${ i }`),
      error => console.log(error),
      () => console.log('Completed!')
    );
  }

}
