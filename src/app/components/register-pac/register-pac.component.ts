import { Component, OnInit  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register-pac',
  templateUrl: './register-pac.component.html',
  styleUrls: ['./register-pac.component.css']
})
export class RegisterPacComponent implements OnInit {
  nombre : string = ""
  apellido : string = ""
  dni : number = 0
  edad : number = 0
  obraSocial : string = ""
  mail : string = ""
  password : string = ""
  foto1 : string = ""
  foto2 : string = ""

  vieneDeRegistro : boolean = false;

  registerForm: FormGroup = this.formBuilder.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    dni: ['', Validators.required],
    edad: ['', Validators.required],
    obraSocial: ['', Validators.required],
    mail: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.pattern("[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"),
      ],
    ],
    password: ['', Validators.required],
    foto1: ['', Validators.required],
    foto2: ['', Validators.required],
  });

  constructor(public formBuilder: FormBuilder,private toastr: ToastrService, private router: Router, private auth:AuthenticationService, private dataServ : DataService, public route: ActivatedRoute) {
  }

  ngOnInit(){
    console.log(this.auth.usuarioLogueado);
    this.vieneDeRegistro = this.route.parent?.snapshot.url[0]?.path === 'usuarios'
  }

  async OnRegisterClick() {
    if (this.registerForm.valid) {
      /*Object.keys(this.registerForm.controls).forEach(key => {
        const controlValue = this.registerForm.get(key)?.value;
        console.log(`Valor de ${key}: ${controlValue}`);
        
        const controlErrors = this.registerForm.get(key)?.errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            console.error(`Control ${key} tiene el error ${keyError}`);
          });
        }
      });*/

      try {
        const success = await this.auth.registerPac(
          this.registerForm.value.nombre,
          this.registerForm.value.apellido,
          this.registerForm.value.edad,
          this.registerForm.value.dni,
          this.registerForm.value.obraSocial,
          this.registerForm.value.mail,
          this.registerForm.value.password,
          this.registerForm.value.foto1,
          this.registerForm.value.foto2,
        );
  
        if (success) {
          if (this.route.parent?.snapshot.url[0]?.path === 'usuarios') {
            this.router.navigateByUrl('/usuarios/verify-email');
          } else {
            this.router.navigateByUrl('/verify-email');
          }
        } else {
          this.toastr.error('Error al registrar el usuario.');
        }
      } catch (error) {
        this.toastr.error('Error, intentelo de nuevo más tarde');
      }
    } else {
      this.toastr.error('Por favor, complete todos los campos correctamente.');
    }
  }

  handleFileInput(event: any, index : number)
  {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        if(index == 1)
        {
          this.foto1 = reader.result as string;
        }
        else
        {
          this.foto2 = reader.result as string;
        }
      };
    }
  }
}
