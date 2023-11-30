import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { RegisterPacComponent } from './components/register-pac/register-pac.component';
import { RegisterEspComponent } from './components/register-esp/register-esp.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { ToastComponent } from './components/toast/toast.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { RegisterAdmComponent } from './components/register-adm/register-adm.component';
import { MenuComponent } from './components/menu/menu.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule, DatePipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IngresoRapidoComponent } from './components/ingreso-rapido/ingreso-rapido.component';
import { TurnosComponent } from './components/turnos/turnos.component';
import { SolicitarTurnoComponent } from './components/solicitar-turno/solicitar-turno.component';
import { DoctorCardComponent } from './components/doctor-card/doctor-card.component';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { MisTurnosComponent } from './components/mis-turnos/mis-turnos.component';
import { MisTurnosEspComponent } from './components/mis-turnos-esp/mis-turnos-esp.component';
import { MiPerfilComponent } from './components/mi-perfil/mi-perfil.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { HistoriasClinicasComponent } from './components/historias-clinicas/historias-clinicas.component';
import { PacientesComponent } from './components/pacientes/pacientes.component';
import { SpinnerModule } from './components/spinner/spinner.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SpinnerInterceptor } from './interceptors/spinner.interceptor';
import { EstadisticasComponent } from './components/estadisticas/estadisticas.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { LogsUsuarioComponent } from './components/logs-usuario/logs-usuario.component';
import { TurnosPorEspecialidadComponent } from './components/turnos-por-especialidad/turnos-por-especialidad.component';
import { TurnosPorDiaComponent } from './components/turnos-por-dia/turnos-por-dia.component';
import { TurnosPorEspecialistaComponent } from './components/turnos-por-especialista/turnos-por-especialista.component';
import { TurnosFinalizadosComponent } from './components/turnos-finalizados/turnos-finalizados.component';
import { ResaltarDirective } from './resaltar.directive';
import { SoloNumerosDirective } from './solo-numeros.directive';
import { SoloLetrasDirective } from './solo-letras.directive';
import { MayusculasPipe } from './mayusculas.pipe';
import { PrefixPipe } from './prefix.pipe';
import { CapitalizarPrimeraLetraPipe } from './capitalizar-primera-letra.pipe';
import { LogsUsuarioGraficoComponent } from './components/logs-usuario-grafico/logs-usuario-grafico.component';


const firebaseConfig = {
  apiKey: "AIzaSyDb5YkkEi29_nrQqwy-Mwu__uDqqvo7dsU",
  authDomain: "tp-final-clinica.firebaseapp.com",
  projectId: "tp-final-clinica",
  storageBucket: "tp-final-clinica.appspot.com",
  messagingSenderId: "185456180421",
  appId: "1:185456180421:web:6f469d45074f5948ebc4ac"
};

registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    RegisterPacComponent,
    RegisterEspComponent,
    VerifyEmailComponent,
    ToastComponent,
    RegisterAdmComponent,
    MenuComponent,
    UsuariosComponent,
    IngresoRapidoComponent,
    TurnosComponent,
    SolicitarTurnoComponent,
    DoctorCardComponent,
    MisTurnosComponent,
    MisTurnosEspComponent,
    MiPerfilComponent,
    HistoriasClinicasComponent,
    PacientesComponent,
    EstadisticasComponent,
    LogsUsuarioComponent,
    TurnosPorEspecialidadComponent,
    TurnosPorDiaComponent,
    TurnosPorEspecialistaComponent,
    TurnosFinalizadosComponent,
    ResaltarDirective,
    SoloNumerosDirective,
    SoloLetrasDirective,
    MayusculasPipe,
    PrefixPipe,
    CapitalizarPrimeraLetraPipe,
    LogsUsuarioGraficoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    OverlayModule,
    CommonModule,
    NgxCaptchaModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    SpinnerModule,
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()) ,
    NgxEchartsModule.forRoot({
      /**
       * This will import all modules from echarts.
       * If you only need custom modules,
       * please refer to [Custom Build] section.
       */
      echarts: () => import('echarts'), // or import('./path-to-my-custom-echarts')
    }),
  ],
  providers: [DatePipe, { provide: LOCALE_ID, useValue: 'es' },
    {provide: FIREBASE_OPTIONS, useValue: firebaseConfig},
    {provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi : true}],
  bootstrap: [AppComponent]
})
export class AppModule { }



