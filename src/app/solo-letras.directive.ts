import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appSoloLetras]'
})
export class SoloLetrasDirective {

  constructor() { }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúüÜÑñ\s]*$/;

    if (!regex.test(inputElement.value)) {
      // Elimina cualquier carácter no permitido
      inputElement.value = inputElement.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúüÜÑñ\s]/g, '');
    }
  }
}