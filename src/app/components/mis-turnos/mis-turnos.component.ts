import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-mis-turnos',
  templateUrl: './mis-turnos.component.html',
  styleUrls: ['./mis-turnos.component.css']
})
export class MisTurnosComponent implements OnInit {
  turnos : any[] = [];
  turnosFiltrados : any[] = [];
  filtrar : boolean = false;
  filtro : FormGroup;
  alta: FormGroup;
  accionesBtn : FormGroup;
  radio : string = "";
  busqueda : string = "";
  razonCancelar : string = "";
  cancelarTurno : boolean = false;
  estrellas : number = 0;
  comentario: string = "";
  
  constructor(private formBuilder: FormBuilder,private data : DataService, public datePipe: DatePipe, private auth : AuthenticationService, private toastr : ToastrService){
    this.filtro = this.formBuilder.group({
      por: [''],
    });

    this.accionesBtn = this.formBuilder.group({
      cancel: [''],
    });

    this.alta = this.formBuilder.group({
      cualidad: ['', Validators.required],
      recomendacion: ['', Validators.required],
      amabilidad: [false],
      demoras: [false],
      registro: [false],
      plan: [false], 
    });
  }

  async ngOnInit() {
    this.auth.isLoading = true;
    if(this.auth.usuarioLogueado == null)
    {
      await this.auth.reLogin();
    }
    this.turnos = await this.data.getMisTurnos(this.auth.usuarioLogueado, false);
    this.auth.isLoading = false;
    this.turnosFiltrados = this.turnos;
    this.reiniciarCampos();

    this.data.turnosObsPac(this.auth.usuarioLogueado).subscribe(turnos => {
      this.turnos = turnos;
      this.turnosFiltrados = this.turnos;
      this.reiniciarCampos();
    });
  }

  onRadioChange(event: any) {
    // Lógica que se ejecuta cuando cambia el radio button
    this.radio = event.target.value;
  }

  async onInputChange() {
    if(this.busqueda != '')
    {
      this.filtrarPorCampos(this.busqueda);
    }
    else
    {
      this.turnosFiltrados = this.turnos;
    }
  }

  filtrarClick()
  {
    this.filtrar = !this.filtrar;
    if(!this.filtrar)
    {
      this.busqueda = "";
      this.turnosFiltrados = this.turnos;
    }
  }

  filtrarPorCampos(filtro: string) {
    const camposAFiltrar = [
        "EspecialistaNombre",
        "EspecialistaApellido",
        "PacienteNombre",
        "PacienteApellido",
        "Horario",
        "Resenia",
        "Especialidad",
        "Estado",
        "Fecha",
        "RazonCancelado",
        "RazonRechazado",
        "Historia.altura",
        "Historia.peso",
        "Historia.temperatura",
        "Historia.presion",
        "Historia.valor1",
        "Historia.valor2",
        "Historia.valor3",
        "Historia.clave1",
        "Historia.clave2",
        "Historia.clave3"
    ];

    this.turnosFiltrados = this.turnos.filter(turno =>
      camposAFiltrar.some(campo => {
          const valorCampo = this.obtenerValorCampo(turno, campo);
          if (typeof valorCampo === "string") {
              return valorCampo.toLowerCase().includes(filtro.toLowerCase());
          } else if (valorCampo instanceof Date) {
              return valorCampo.toISOString().includes(filtro.toLowerCase());
          }
          return false;
      })
  );
}

obtenerValorCampo(objeto: any, campo: string): any {
    const campos = campo.split(".");
    return campos.reduce((o, c) => (o && o[c] !== undefined ? o[c] : null), objeto);
}

  reiniciarCampos()
  {
    this.turnos.forEach((p: { mostrarResenia: boolean; }) => p.mostrarResenia = false);
    this.turnos.forEach((p: { mostrarCancelar: boolean; }) => p.mostrarCancelar = false);
    this.turnos.forEach((p: { mostrarEncuesta: boolean; }) => p.mostrarEncuesta = false);
    this.turnos.forEach((p: { mostrarCalificar: boolean; }) => p.mostrarCalificar = false);
    this.accionesBtn.patchValue(
      {cancel : ''}
    )

    this.alta.patchValue(
      {cualidad : '',
      recomendacion : '',
      amabilidad : false,
      demoras : false,
      registro : false,
      plan : false}
    )

    this.estrellas = 0;
    this.comentario = '';
    
    this.turnosFiltrados.forEach((p: { mostrarResenia: boolean; }) => p.mostrarResenia = false);
    this.turnosFiltrados.forEach((p: { mostrarCancelar: boolean; }) => p.mostrarCancelar = false);
    this.turnosFiltrados.forEach((p: { mostrarEncuesta: boolean; }) => p.mostrarEncuesta = false);
    this.turnosFiltrados.forEach((p: { mostrarCalificar: boolean; }) => p.mostrarCalificar = false);
  }


  toggleCancelar(turno: any) {
    this.reiniciarCampos();

    turno.mostrarCancelar = !turno.mostrarCancelar;

    console.log(turno.mostrarCancelar)
  }

  toggleResenia(turno: any) {
    this.reiniciarCampos();
    turno.mostrarResenia = !turno.mostrarResenia;
    console.log(turno.mostrarResenia)
    console.log(turno)
  }

  toggleEncuesta(turno: any) {
    this.reiniciarCampos();
    turno.mostrarEncuesta = !turno.mostrarEncuesta;
    console.log(turno.mostrarEncuesta)
  }

  toggleCalificar(turno: any) {
    this.reiniciarCampos();
    turno.mostrarCalificar = !turno.mostrarCalificar;
    console.log(turno.mostrarCalificar)
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

  async enviarEncuesta(turno : any)
  {
    if(await this.data.guardarEncuesta(turno, this.alta.value))
    {
      this.toastr.success("Encuesta guardada con éxito.");
    }else{
      this.toastr.error("No se ha podido registrar la encuesta, intente mas tarde.")
    }

    this.reiniciarCampos();
  }

  guardarCalificacion(turno : any) {
    this.data.guardarCalificacion(turno, this.estrellas, this.comentario);
    this.reiniciarCampos();
  }
}
