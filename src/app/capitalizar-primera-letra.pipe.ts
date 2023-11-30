import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizarPrimeraLetra'
})
export class CapitalizarPrimeraLetraPipe implements PipeTransform {
  transform(valor: string): string {
    if (!valor) return valor;

    return valor.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
}