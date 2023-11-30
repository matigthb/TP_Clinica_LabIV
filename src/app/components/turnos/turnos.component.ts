import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css']
})
export class TurnosComponent implements OnInit {
  turnos : any[] = [];
  turnosFiltrados : any[] = [];
  filtrar : boolean = false;
  filtro : FormGroup;
  accionesBtn : FormGroup;
  radio : string = "";
  busqueda : string = "";
  razonCancelar : string = "";
  cancelarTurno : boolean = false;
  comentario : string = "";
  
  constructor(private formBuilder: FormBuilder,private data : DataService, public datePipe: DatePipe, private auth : AuthenticationService, private toastr : ToastrService){
    this.filtro = this.formBuilder.group({
      por: [''],
    });

    this.accionesBtn = this.formBuilder.group({
      cancel: [''],
    });

  }

  async ngOnInit() {
    this.auth.isLoading = true;
    if(this.auth.usuarioLogueado == null)
    {
      await this.auth.reLogin();
    }
    this.turnos = await this.data.getTurnos(false);
    this.auth.isLoading = false;
    this.turnosFiltrados = this.turnos;
    this.reiniciarCampos();
    
    this.data.turnosObsAdm().subscribe(turnos => {
      this.turnos = turnos;
      this.turnosFiltrados = this.turnos;
      this.reiniciarCampos();
    });
  }

  onRadioChange(event: any) {
    // Lógica que se ejecuta cuando cambia el radio button
    this.filtrar = true;
    this.radio = event.target.value;
    this.onInputChange();
  }

  async onInputChange() {
    if(this.busqueda != '')
    {
      if(this.radio == "Especialidad")
      {
        this.filtrarEspecialidad(this.busqueda);
      }
      else if(this.radio == "Especialista")
      {
        this.filtrarEspecialista(this.busqueda);
      }
      else{
        this.filtrarPaciente(this.busqueda);
      }
    }
    else
    {
      this.turnosFiltrados = this.turnos;
    }
  }

  filtrarEspecialidad(filtro : string)
  { 
    this.turnosFiltrados = this.turnos.filter(turno =>
      turno.Especialidad.toLowerCase().includes(filtro.toLowerCase())
    );
  }

  filtrarPaciente(filtro : string)
  {
    this.turnosFiltrados = this.turnos.filter(turno =>
      (turno.PacienteNombre.toLowerCase().includes(filtro.toLowerCase())) ||
      (turno.PacienteApellido.toLowerCase().includes(filtro.toLowerCase()))
    );
  }

  filtrarEspecialista(filtro : string)
  {
    this.turnosFiltrados = this.turnos.filter(turno =>
      (turno.EspecialistaNombre.toLowerCase().includes(filtro.toLowerCase())) ||
      (turno.EspecialistaApellido.toLowerCase().includes(filtro.toLowerCase()))
    );
  }

  reiniciarCampos()
  {
    this.turnos.forEach((p: { mostrarCancelar: boolean; }) => p.mostrarCancelar = false);
    
    this.accionesBtn.patchValue(
      {cancel : ''}
    )

    this.turnosFiltrados.forEach((p: { mostrarCancelar: boolean; }) => p.mostrarCancelar = false);
  }


  toggleCancelar(turno: any) {
    this.reiniciarCampos();

    turno.mostrarCancelar = !turno.mostrarCancelar;

    console.log(turno.mostrarCancelar)
  }


  CancelarTurno(turno : any)
  {
    if(this.accionesBtn.value.cancel != '')
    { 
      this.data.cancelarTurno(turno, this.auth.usuarioLogueado.Nombre + ' ' + this.auth.usuarioLogueado.Apellido, this.accionesBtn.value.cancel)
      this.toastr.success("Turno cancelado.");
    }else{
      this.toastr.error("Debe especificar la razón de la cancelación");
    }
    this.reiniciarCampos();
  }

}
