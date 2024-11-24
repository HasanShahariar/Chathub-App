import { Component, HostListener, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
  animations: [
    trigger('slideDownUp', [
      state('void', style({
        transform: 'translateY(-15%)',
        opacity: 0
      })),
      state('*', style({
        transform: 'translateY(0)',
        opacity: 1
      })),
      transition(':enter', [
        animate('300ms ease-out')
      ]),
      transition(':leave', [
        animate('300ms ease-in')
      ])
    ])
  ]
})
export class NavComponent implements OnInit {
  showProfiles: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  toggleProfiles(event: Event) {
    event.stopPropagation();
    this.showProfiles = !this.showProfiles;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event): void {
      this.showProfiles = false;
  }

}
