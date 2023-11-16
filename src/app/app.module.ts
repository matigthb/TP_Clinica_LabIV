import { NgModule } from '@angular/core';
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
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const firebaseConfig = {
  apiKey: "AIzaSyDb5YkkEi29_nrQqwy-Mwu__uDqqvo7dsU",
  authDomain: "tp-final-clinica.firebaseapp.com",
  projectId: "tp-final-clinica",
  storageBucket: "tp-final-clinica.appspot.com",
  messagingSenderId: "185456180421",
  appId: "1:185456180421:web:6f469d45074f5948ebc4ac"
};

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    OverlayModule,
    CommonModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()) 
  ],
  providers: [
    {provide: FIREBASE_OPTIONS, useValue: firebaseConfig}],
  bootstrap: [AppComponent]
})
export class AppModule { }



