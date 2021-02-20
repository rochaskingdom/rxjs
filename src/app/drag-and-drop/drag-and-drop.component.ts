import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.css']
})
export class DragAndDropComponent implements OnInit, AfterViewInit {

  @ViewChild('myrect') myrect: ElementRef;

  top = 40;
  left = 40;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const mousedown = fromEvent(this.myrect.nativeElement, 'mousedown');
    const mousemove = fromEvent(document, 'mousemove');
    const mouseup = fromEvent(document, 'mouseup');

    mousedown.subscribe((ed: MouseEvent) => {
      // console.log(ed);
      let x = ed.pageX;
      let y = ed.pageY;

      mousemove
        .pipe(
          takeUntil(mouseup)
        )
        .subscribe((em: MouseEvent) => {
          // console.log(em);
          const offSetX = x - em.pageX;
          const offSetY = y - em.pageY;
          this.top -= offSetY;
          this.left -= offSetX;
          x = em.pageX;
          y = em.pageY;
        });
    });
  }

}
