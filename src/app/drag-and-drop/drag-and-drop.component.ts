import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.css']
})
export class DragAndDropComponent implements OnInit {

  @ViewChild('myRect') myRect: ElementRef;

  top = 40;
  left = 40;

  constructor() {
  }

  ngOnInit(): void {
  }

}
