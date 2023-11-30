import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-doctor-card',
  templateUrl: './doctor-card.component.html',
  styleUrls: ['./doctor-card.component.css']
})
export class DoctorCardComponent {
  @Input() doctor: any;
  @Output() doctorSeleccionado = new EventEmitter<any>();

  // Método para manejar el clic en un botón y emitir las credenciales
  doctorClickeado() {
    this.doctorSeleccionado.emit(this.doctor);
  }
}
