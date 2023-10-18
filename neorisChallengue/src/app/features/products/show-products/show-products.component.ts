import {Component, ElementRef, HostListener, OnInit, Renderer2} from '@angular/core';

@Component({
  selector: 'app-show-products',
  templateUrl: './show-products.component.html',
  styleUrls: ['./show-products.component.scss']
})
export class ShowProductsComponent implements OnInit {

  isDropdownOpen = false;

  constructor(private el: ElementRef) {
}

  ngOnInit(): void {
  }


  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const clickedElement = event.target as HTMLElement;
    const dropdownElement = this.el.nativeElement.querySelector('div#dropdown.custom-select');

    if (clickedElement != dropdownElement) {
      this.isDropdownOpen = false;
    }
  }
}
