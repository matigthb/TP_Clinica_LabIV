import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  loginForm: FormGroup = this.formBuilder.group({
    email: ['', [
      Validators.required,
      Validators.email,
      Validators.pattern("[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$")
    ]],
    pass: ['', Validators.required]
  });

  constructor(private toastr : ToastrService ,public formBuilder: FormBuilder, public router : Router, private auth: AuthenticationService, private data : DataService) { }

  ngOnInit() {
    console.log(this.auth.usuarioLogueado);
  }

  async login() {
    if (this.loginForm?.valid) {
      this.auth.isLoading = true;
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.pass;
      
      const loginSuccessful = await this.auth.logIn(email, password);
  
      if (loginSuccessful) {
        console.log(this.auth.usuarioLogueado)
        if(this.auth.usuarioLogueado != null)
        {
          this.data.guardarLog(this.auth.usuarioLogueado);
          this.router.navigateByUrl('/home');
        }
        else
        {
          this.router.navigateByUrl('/home');
          this.toastr.error('Error: Usuario no encontrado o contraseña incorrecta');
        }
      }
      this.auth.isLoading = false;
    }else{
      this.toastr.error('Error: Usuario no encontrado o contraseña incorrecta');
    }
  }
  
  ingresoRapido(email :string , pass : string)
  {
    this.loginForm.patchValue({
      email: email,
      pass: pass
    });
  }

  manejarCredencialesSeleccionadas(credenciales : any) {
    this.loginForm.patchValue({
      email: credenciales.email,
      pass: credenciales.password
    });
  }

}
