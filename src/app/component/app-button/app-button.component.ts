import { Component, Input, Output, EventEmitter } from '@angular/core';
type ButtonType = 'primary' | 'secondary' | 'danger' | 'primary-icon' |
  'secondary-icon' | 'icon' | 'ghost' | 'link-btn' | 'text-link';

type ButtonActionType = 'button' | 'submit';
@Component({
  selector: 'app-button',
  templateUrl: './app-button.component.html',
  styleUrls: ['./app-button.component.scss']
})
export class AppButtonComponent {
  @Input() type: ButtonActionType = 'button';
  @Input() title: string;
  @Input() theme: ButtonType = 'primary';
  @Input() disabled: boolean;
  @Input() icon: string;
  @Input() image: string;
  @Input() isBold: boolean = false;
  @Input() isLoading: boolean = false;
  @Input() iconColor: string;
  @Input() imgClass: string;

  @Output() click = new EventEmitter();
  constructor() { }

  public onClick($event) {
    $event.preventDefault();
    $event.stopPropagation();
    this.click.emit($event);
  }
}

//  Examples:
/*
<app-button [icon]="'dr-icon-arrow-down'">hello</app-button>
<app-button [icon]="'fa fa-refresh'" [theme]="'primary-icon'"></app-button>
<app-button [icon]="'fa fa-refresh'" [isDisabled]="true" [theme]="'primary-icon'"></app-button>
<app-button [theme]="'secondary'" [icon]="'fa fa-refresh'" [iconColor]="'#03A678'"></app-button>
*/
