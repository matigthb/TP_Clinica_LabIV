import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css']
})
export class MiPerfilComponent implements OnInit{
  userProfile: any; // Ajusta el tipo de acuerdo a tu implementación
  horariosSemana : any[] = [];
  horariosSabado : any[] = [];
  horariosSemSelected : string[] = [];
  horariosSabSelected : string[] = [];
  mostrarHorarios : boolean = false;
  mostrarHistoria : boolean = false;

  constructor(private dataService: DataService, public auth : AuthenticationService) { 
  }

  async ngOnInit(): Promise<void> {
    this.auth.isLoading = true;
    if(this.auth.usuarioLogueado == null)
    {
      await this.auth.reLogin();
    }
    this.auth.isLoading = false;
    
    this.horariosSemSelected = this.auth.usuarioLogueado.HorariosSemana;
    this.horariosSabSelected = this.auth.usuarioLogueado.HorariosSabado;

    this.horariosSemana = this.dataService.generarHorarios(1);
    this.horariosSabado = this.dataService.generarHorarios(6);

  }

  mostrarHistoriaClinica()
  {
    this.mostrarHistoria = !this.mostrarHistoria;
    console.log(this.mostrarHistoria);
  }

  

  confirmarHorarios()
  {
    this.dataService.actualizarHorarios(this.auth.usuarioLogueado, this.horariosSemSelected, this.horariosSabSelected)
  }
  

  toggleHorarioSem(horario: string): void {
    
    const index = this.horariosSemSelected.indexOf(horario);
    if (index === -1) {
      this.horariosSemSelected.push(horario);
    } else {
      this.horariosSemSelected.splice(index, 1);
    }
  }

  toggleHorarioSab(horario: string): void {
    
    console.log(horario)
    console.log(this.horariosSabSelected)

    const index = this.horariosSabSelected.indexOf(horario);
    if (index === -1) {
      this.horariosSabSelected.push(horario);
    } else {
      this.horariosSabSelected.splice(index, 1);
    }
  }

  isSelectedSem(horario: string): boolean {
    console.log(this.horariosSemSelected.includes(horario))
    return (this.horariosSemSelected.includes(horario));
  }

  isSelectedSab(horario: string): boolean {
    console.log(this.horariosSabSelected.includes(horario))
    return (this.horariosSabSelected.includes(horario));
  }
}
