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
  foto1 : string = ""
  foto2 : string = ""

  siteKey : string ="6LeswB8pAAAAAJSSf1KiQiMTaE-WyOjjdQXHCBck"

  vieneDeRegistro : boolean = false;

  registerForm: FormGroup = this.formBuilder.group({
    nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúüÁÉÍÓÚÜ\s]*$/)]],
    apellido: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúüÁÉÍÓÚÜ\s]*$/)]],
    dni: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    edad: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
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
    recaptcha: ['', Validators.required]
  });

  constructor(public formBuilder: FormBuilder,private toastr: ToastrService, private router: Router, private auth:AuthenticationService, private dataServ : DataService, public route: ActivatedRoute) {
  }

  ngOnInit(){
    console.log(this.auth.usuarioLogueado);
    this.vieneDeRegistro = this.route.parent?.snapshot.url[0]?.path === 'usuarios'
  }

  async OnRegisterClick() {
    if (this.registerForm.valid) {

      try {
        const success = await this.auth.registerPac(
          this.registerForm.value.nombre,
          this.registerForm.value.apellido,
          this.registerForm.value.edad,
          this.registerForm.value.dni,
          this.registerForm.value.obraSocial,
          this.registerForm.value.mail,
          this.registerForm.value.password,
          this.foto1,
          this.foto2,
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
