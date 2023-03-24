import { Component, Input, Output, EventEmitter } from '@angular/core';
import { trigger } from '@angular/animations';
import { transition } from '@angular/animations';
import { style } from '@angular/animations';
import { animate } from '@angular/animations';
import { IFilter } from '../../models/filter';
type ButtonType = 'primary' | 'secondary' | 'danger' | 'primary-icon' |
  'secondary-icon' | 'icon' | 'ghost' | 'link-btn' | 'text-link';

@Component({
  selector: 'app-table-filters',
  templateUrl: './app-table-filters.component.html',
  styleUrls: ['./app-table-filters.component.scss'],
  animations: [
    trigger(
      'animation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('500ms', style({ transform: 'translateX(0)',opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0)', 'opacity': 1 }),
        animate('500ms', style({ transform: 'translateX(100%)',opacity: 0 }))
      ])
    ]
    )
  ],
})


export class AppTableFiltersComponent {
  filters: IFilter = {
    name: null,
    fromDate: null,
    toDate: null,
    fromSat: null,
    toSat: null,
    fromAvg: null,
    toAvg: null
  }

  @Input() terms: string;
  @Output() apply = new EventEmitter<IFilter>();
  @Output() clearAll = new EventEmitter<IFilter>();


  constructor() {}

  ngOnInit() {
    this.filters.name = this.terms;
  }

  public onApply($event) {
    this.apply.emit(this.filters);
  }

  public onClearAll($event) {
    this.clearFilters();
    this.clearAll.emit(this.filters);
  }

  clearFilters() {
    this.filters = {
      name: null,
      fromDate: null,
      toDate: null,
      fromSat: null,
      toSat: null,
      fromAvg: null,
      toAvg: null
    }
  }
}
