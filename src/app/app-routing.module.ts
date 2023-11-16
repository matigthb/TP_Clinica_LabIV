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

const routes: Routes = [
  {path:"home", component:HomeComponent},
  {path:"menu", component:MenuComponent},
  {path:"login", component:LoginComponent},
  {path:"register", component:RegisterComponent},
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
