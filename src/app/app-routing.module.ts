import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { RegisterEspComponent } from './components/register-esp/register-esp.component';
import { RegisterPacComponent } from './components/register-pac/register-pac.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { MenuComponent } from './components/menu/menu.component';
import { RegisterAdmComponent } from './components/register-adm/register-adm.component';
import { TurnosComponent } from './components/turnos/turnos.component';
import { SolicitarTurnoComponent } from './components/solicitar-turno/solicitar-turno.component';
import { MisTurnosComponent } from './components/mis-turnos/mis-turnos.component';
import { MisTurnosEspComponent } from './components/mis-turnos-esp/mis-turnos-esp.component';
import { MiPerfilComponent } from './components/mi-perfil/mi-perfil.component';
import { HistoriasClinicasComponent } from './components/historias-clinicas/historias-clinicas.component';
import { PacientesComponent } from './components/pacientes/pacientes.component';
import { EstadisticasComponent } from './components/estadisticas/estadisticas.component';
import { LogsUsuarioComponent } from './components/logs-usuario/logs-usuario.component';
import { TurnosPorEspecialidadComponent } from './components/turnos-por-especialidad/turnos-por-especialidad.component';
import { TurnosPorDiaComponent } from './components/turnos-por-dia/turnos-por-dia.component';
import { TurnosPorEspecialistaComponent } from './components/turnos-por-especialista/turnos-por-especialista.component';
import { TurnosFinalizadosComponent } from './components/turnos-finalizados/turnos-finalizados.component';

const routes: Routes = [
  {path:'',redirectTo: "home", pathMatch: "full"},
  {path:"home", component:HomeComponent},
  {path:"login", component:LoginComponent, data: { animation: 'isLeft' } },
  {path:"register", component:RegisterComponent, children:[
    {path:"register-pac", component:RegisterPacComponent},
    {path:"register-esp", component:RegisterEspComponent},
    {path:"register-adm", component:RegisterAdmComponent},
    {path:"verify-email", component: VerifyEmailComponent},
  ], data: { animation: 'isRight' } },
  {path:"register-pac", component:RegisterPacComponent},
  {path:"register-esp", component:RegisterEspComponent},
  {path:"register-adm", component:RegisterAdmComponent},
  {path:"verify-email", component: VerifyEmailComponent},
  {path:"usuarios", component:UsuariosComponent,
    children:[
      {path:"register-pac", component:RegisterPacComponent},
      {path:"register-esp", component:RegisterEspComponent},
      {path:"register-adm", component:RegisterAdmComponent},
      {path:"verify-email", component: VerifyEmailComponent},
  ]},
  {path:"turnos", component:TurnosComponent},
  {path:"mis-turnos", component:MisTurnosComponent},
  {path:"mis-turnos-esp", component:MisTurnosEspComponent},
  {path:"solicitar-turno", component:SolicitarTurnoComponent},
  {path:"mi-perfil", component:MiPerfilComponent},
  {path:"historias-clinicas", component:HistoriasClinicasComponent},
  {path:"pacientes", component:PacientesComponent},
  {path:"estadisticas", component:EstadisticasComponent,
  children:[
    {path:"logs-usuario", component:LogsUsuarioComponent, data: { animation: 'isLeft' }},
    {path:"turnos-por-especialidad", component:TurnosPorEspecialidadComponent, data: { animation: 'isLeft' }},
    {path:"turnos-por-dia", component:TurnosPorDiaComponent, data: { animation: 'isLeft' }},
    {path:"turnos-por-especialista", component:TurnosPorEspecialistaComponent, data: { animation: 'isLeft' }},
    {path:"turnos-finalizados", component:TurnosFinalizadosComponent, data: { animation: 'isLeft' }},
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
