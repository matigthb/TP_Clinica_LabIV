import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit{
  pacientes: any[] = []; // Asegúrate de tener un array para almacenar los usuarios
  especialistasRev: any[] = [];
  especialistas: any[] = [];
  admins: any[] = [];
  nuevoUsuario: any = {}; // Asegúrate de tener un objeto para el nuevo usuario

  mostrarPacientes : boolean = false;
  mostrarEspecialistasRev : boolean = false;
  mostrarEspecialistas : boolean = false;
  mostrarAdmins : boolean = false;

  // Suscripción al observable de cambios en usuarios
  private usuariosChangedSubscription: Subscription = new Subscription;
  private usuariosAuthChangedSubscription: Subscription = new Subscription;

  constructor(public auth : AuthenticationService, public dataServ : DataService)
  {

  }

  ngOnDestroy() {
    // Desuscribe la suscripción para evitar posibles fugas de memoria
    this.usuariosChangedSubscription.unsubscribe();
    this.usuariosAuthChangedSubscription.unsubscribe();
  }

  ngOnInit() {
    this.actualizarListas();

    this.usuariosChangedSubscription = this.dataServ.usuariosCambiados().subscribe(() => {
      // Actualiza las listas cuando se producen cambios
      this.actualizarListas();
    });

    this.usuariosAuthChangedSubscription = this.auth.usuariosCambiados().subscribe(() => {
      // Actualiza las listas cuando se producen cambios
      this.actualizarListas();
    });
  }

  async actualizarListas() {
    this.pacientes = await this.dataServ.GetUsuarios('Pacientes');
    this.especialistasRev = await this.dataServ.GetUsuarios('Especialista-Review');
    this.especialistas = await this.dataServ.GetUsuarios('Especialistas');
    this.admins = await this.dataServ.GetUsuarios('Admins');
  }

  toggleDetalle(usuario: any) {
    usuario.mostrarDetalle = !usuario.mostrarDetalle;
  }

  async habilitarEspecialista(usuario : any)
  {
    if(await this.dataServ.habilitarEspecialista(usuario))
    {
      const index = this.especialistasRev.indexOf(usuario);

      this.especialistasRev.splice(index, 1);
      this.especialistas.push(usuario);
    }
    else
    {
      console.log("nada");
    }
  }

  async rechazarEspecialista(usuario : any)
  {
    if(await this.dataServ.rechazarEspecialista(usuario.UID))
    {
      const index = this.especialistasRev.indexOf(usuario);

      this.especialistasRev.splice(index, 1);
    }
    else
    {
      console.log("nada");
    }
  }
}
