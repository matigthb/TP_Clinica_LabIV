import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class PacientesComponent implements OnInit{
  pacientes: any[] = []; // Asegúrate de tener un array para almacenar los usuarios

  constructor(private dataServ : DataService, public auth : AuthenticationService )
  {

  }

  async ngOnInit() {
    this.auth.isLoading = true;
    await this.auth.reLogin();
    this.pacientes = await this.dataServ.getPacientesDe(this.auth.usuarioLogueado);
    this.auth.isLoading = false;
    console.log(this.pacientes);
  }

  toggleDetalle(usuario: any) {
    const b = usuario.mostrarDetalle;
    this.reiniciarCampos();
    usuario.mostrarDetalle = !b;
  }

  reiniciarCampos()
  {
    this.pacientes.forEach((p: { mostrarDetalle: boolean; }) => p.mostrarDetalle = false);
  }
}
