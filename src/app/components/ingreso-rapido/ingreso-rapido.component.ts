// ingreso-rapido.component.ts
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-ingreso-rapido',
  templateUrl: './ingreso-rapido.component.html',
  styleUrls: ['./ingreso-rapido.component.css']
})
export class IngresoRapidoComponent {
  @Output() credencialesSeleccionadas = new EventEmitter<any>();

  // Método para manejar el clic en un botón y emitir las credenciales
  seleccionarCredenciales(email: string, password: string) {
    const credenciales = {
      email : email,
      password : password
    };
    this.credencialesSeleccionadas.emit(credenciales);
  }
}