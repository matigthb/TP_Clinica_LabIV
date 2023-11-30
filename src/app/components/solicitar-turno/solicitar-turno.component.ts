import { Component,OnInit , LOCALE_ID} from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-solicitar-turno',
  templateUrl: './solicitar-turno.component.html',
  styleUrls: ['./solicitar-turno.component.css'],
  providers: [DatePipe, { provide: LOCALE_ID, useValue: 'es' }]
})
export class SolicitarTurnoComponent implements OnInit{
  doctors: any[] = [];
  especialidades: any[] = [];
  especialistaSelected : any;
  especialidadSelected : string = "";
  fechasDisponibles: Date[] = [];
  fechaSelected : Date = new Date(2022, 0, 1);
  horariosDisponibles : any[] = [];
  horariosYaUsados : any[] = [];
  horariosSelected : string[] = [];
  pacientes : any[] = [];
  pacienteSelected : any; 

  constructor(public dataServ : DataService, public datePipe: DatePipe, public auth : AuthenticationService, private toastr : ToastrService, private router : Router)
  {

  }
  
  ngOnInit(): void {
    this.auth.isLoading = true;
    this.actualizarListas();
    this.calcularFechasDisponibles();
    this.auth.isLoading = false;
    //this.auth.reLogin();
  }
  
  calcularFechasDisponibles() {
    const hoy = new Date();
    let contadorDias = 0;

    while (this.fechasDisponibles.length < 15) {
      const siguienteDia = new Date(hoy);
      siguienteDia.setDate(hoy.getDate() + contadorDias);

      console.log(contadorDias)
      // Verificar si el día es hábil (no es domingo ni feriado)
      if (this.esDiaHabil(siguienteDia)) {
        this.fechasDisponibles.push(siguienteDia);
      }
      
      contadorDias++;
    }
  }

  generarHorarios(diaSeleccionado: number) {
    const horarios = [];

    if (diaSeleccionado >= 1 && diaSeleccionado <= 5 || diaSeleccionado === 6) {
      const inicio = diaSeleccionado === 6 ? 8 * 60 : 8 * 60; 
      const fin = diaSeleccionado === 6 ? 14 * 60 : 19 * 60; 

      for (let minutos = inicio; minutos <= fin; minutos += 30) {
        const hora = Math.floor(minutos / 60);
        const minuto = minutos % 60;

        const horaFormateada = hora < 10 ? `0${hora}` : `${hora}`;
        const minutoFormateado = minuto === 0 ? '00' : `${minuto}`;

        const horario = `${horaFormateada}:${minutoFormateado}`;

        if(!this.horariosYaUsados.includes(horario) && ((this.especialistaSelected.HorariosSemana.includes(horario) && diaSeleccionado >= 1 && diaSeleccionado <= 5) || (this.especialistaSelected.HorariosSabado.includes(horario) && diaSeleccionado == 6)))
        {
          horarios.push(horario);
        }
      }
    }

    this.horariosDisponibles = horarios;
  }
  

  esDiaHabil(fecha: Date): boolean {
    const diaSemana = fecha.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
    
    console.log(`Fecha: ${fecha}, Día de la semana: ${diaSemana}`);

    // Verificar que no sea domingo y que no sea feriado (puedes agregar más lógica según tus necesidades)
    return diaSemana !== 0;
  }

  async actualizarListas()
  {
    this.doctors = await this.dataServ.GetUsuarios('Especialistas');
    this.pacientes = await this.dataServ.GetUsuarios('Pacientes');
  }

  async manejarSeleccionDoctor(doctor : any)
  {
    this.especialistaSelected = doctor;
    console.log(this.especialistaSelected.Especialidades)
    this.getFotoEsp();
    console.log(this.especialidades)
  }

  async getFotoEsp()
  {
    
    for(let especialidad of this.especialistaSelected.Especialidades)
    {
      this.especialidades.push({
        Nombre : especialidad,
        Foto : await this.dataServ.getFotoEspecialidad(especialidad)
      })
    }
  }

  cambiarEspecialista()
  {
    this.especialistaSelected = null;
    this.especialidades = [];
    this.cambiarEspecialidad();
    this.cambiarFecha();
  }

  especialidadClickeada(especialidad : string)
  {
    this.especialidadSelected = especialidad;
  }

  async seleccionarFecha(fecha : Date)
  {
    this.fechaSelected = fecha;
    this.horariosYaUsados = await this.dataServ.getHorariosUsados(this.especialistaSelected, fecha);
    this.generarHorarios(this.fechaSelected.getDay());
  }

  cambiarEspecialidad()
  {
    this.especialidadSelected = "";
    this.cambiarFecha();
  }

  seleccionarPaciente(paciente : any){
    this.pacienteSelected = paciente;
  }

  cambiarPaciente(){
    this.pacienteSelected = null;
  }
  
  cambiarFecha()
  {
    this.fechaSelected = new Date(2022, 0, 1);
    this.horariosSelected = [];
  }

  toggleHorario(horario: string): void {
    const index = this.horariosSelected.indexOf(horario);
    if (index === -1) {
      if(this.horariosSelected.length >= 3)
      {
        this.horariosSelected.splice(0, 1);
      }
      this.horariosSelected.push(horario);
    } else {
      this.horariosSelected.splice(index, 1);
    }
  }

  isSelected(horario: string): boolean {
    return (this.horariosSelected.includes(horario));
  }

  async solicitarTurno()
  {
    let user : any;
    if(this.auth.esAdmin)
    {
      user = this.pacienteSelected;
    }
    else
    {
      user = this.auth.usuarioLogueado;
    }

    if(await this.dataServ.guardarTurno(this.especialistaSelected, user, this.especialidadSelected, this.fechaSelected, this.horariosSelected))
    {
      this.toastr.success("¡Turno guardado correctamente!");
      if(this.auth.esPaciente)
      {
        this.router.navigateByUrl('mis-turnos');
      }
      else
      {
        this.cambiarEspecialista();
        this.cambiarEspecialidad();
        this.cambiarPaciente();
        this.cambiarFecha();
      }
    }
    else
    {
      this.toastr.error("El Turno no se pudo guardar.");
    }
  }
}
