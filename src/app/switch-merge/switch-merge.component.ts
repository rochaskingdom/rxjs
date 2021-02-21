import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Observable, of } from 'rxjs';
import { Person } from './person.model';
import { HttpClient } from '@angular/common/http';
import { debounceTime, mergeMap, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-switch-merge',
  templateUrl: './switch-merge.component.html',
  styleUrls: ['./switch-merge.component.css']
})
export class SwitchMergeComponent implements OnInit {

  @ViewChild('searchBy', {static: true}) el: ElementRef;

  searchInput = '';
  people$: Observable<Person[]>;
  private readonly url = 'http://localhost:9000';

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    // this.firstOption();
    // this.secondOption();
    this.thirdOption();
  }

  filterPeople(searchInput: string): Observable<Person[]> {
    if (searchInput.length === 0) {
      return of([]);
    } else {
      return this.http.get<Person[]>(`${this.url}/${searchInput}`);
    }
  }

  thirdOption(): void {
    const keyup$ = fromEvent(this.el.nativeElement, 'keyup');

    // this.people$ = keyup$
    //   .pipe(map(e => this.filterPeople(this.searchInput)))
    //   .pipe(switchAll());

    this.people$ = keyup$
      .pipe(
        debounceTime(700),
        switchMap(() => this.filterPeople(this.searchInput))
      );
  }

  secondOption(): void {
    const keyup$ = fromEvent(this.el.nativeElement, 'keyup');
    // const fetch$ = keyup$.pipe(map(e => this.filterPeople(this.searchInput)));
    // fetch$
    //     .pipe(mergeAll())
    //     .subscribe(data => console.log(data));
    //
    // this.people$ = fetch$.pipe(mergeAll());

    this.people$ = keyup$.pipe(mergeMap(e => this.filterPeople(this.searchInput)));
  }

  firstOption(): void {
    fromEvent(this.el.nativeElement, 'keyup')
      .subscribe(e => {
        this.filterPeople(this.searchInput)
          .subscribe(r => console.log(r));
      });
  }

}
