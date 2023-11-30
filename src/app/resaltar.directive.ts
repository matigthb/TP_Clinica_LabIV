// resaltar.directive.ts
import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appResaltar]'  // Selector de atributo
})
export class ResaltarDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.resaltar('#224870');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.resaltar(null);
  }

  private resaltar(color: string | null) {
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', color);
  }
}