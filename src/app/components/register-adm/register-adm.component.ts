import { Component, OnInit  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register-adm',
  templateUrl: './register-adm.component.html',
  styleUrls: ['./register-adm.component.css']
})
export class RegisterAdmComponent implements OnInit {
  registerForm: FormGroup = this.formBuilder.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    dni: ['', Validators.required],
    edad: ['', Validators.required],
    mail: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.pattern("[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"),
      ],
    ],
    password: ['', Validators.required],
    foto: ['', Validators.required]
  });

  vieneDeRegistro : boolean = false;


  constructor(private toastr : ToastrService, public formBuilder: FormBuilder, private router: Router, private auth:AuthenticationService, private dataServ : DataService,private route: ActivatedRoute) {
  }

  ngOnInit(){
    console.log(this.auth.usuarioLogueado);
    this.vieneDeRegistro = this.route.parent?.snapshot.url[0]?.path === 'usuarios';
  }

  async OnRegisterClick() {
    if (this.registerForm.valid) {
      try {
        const success = await this.auth.registerAdm(
          this.registerForm.value.nombre,
          this.registerForm.value.apellido,
          this.registerForm.value.edad,
          this.registerForm.value.dni,
          this.registerForm.value.mail,
          this.registerForm.value.password,
          this.registerForm.value.foto
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

  handleFileInput(event: any)
  {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
          this.registerForm.value.foto = reader.result as string;
      };
    }
  }
}
