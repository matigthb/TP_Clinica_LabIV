import { Component, OnInit  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register-esp',
  templateUrl: './register-esp.component.html',
  styleUrls: ['./register-esp.component.css']
})
export class RegisterEspComponent implements OnInit{

  especialidades : any ;
  selectedSpecialties: string[] = [];
  especialidadesAgregadas : string[] = [];
  especialidadesOtras: string[] = [];

  vieneDeRegistro : boolean = false;

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

  especialidadesForm : FormGroup = this.formBuilder.group({
    especialidadOtra: ['', Validators.required],
  });


  constructor(private toastr: ToastrService,public formBuilder: FormBuilder, private router: Router, private auth:AuthenticationService, private dataServ : DataService, private route: ActivatedRoute) {
  }

  async ngOnInit(){
    this.especialidades = await this.dataServ.GetEspecialidades();

    this.vieneDeRegistro = this.route.parent?.snapshot.url[0]?.path === 'usuarios';
  }

  async OnRegisterClick() {
    if (this.registerForm.valid && (this.selectedSpecialties.length > 0 || this.especialidadesAgregadas.length > 0)) {
      try {
        const success = await this.auth.registerEsp(
          this.registerForm.value.nombre,
          this.registerForm.value.apellido,
          this.registerForm.value.edad,
          this.registerForm.value.dni,
          this.selectedSpecialties,
          this.especialidadesAgregadas,
          this.registerForm.value.mail,
          this.registerForm.value.password,
          this.registerForm.value.foto,
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
        this.toastr.error('Error, intentelo de nuevo más tarde.');
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

  toggleSpecialty(specialty: string): void {
    
    if(this.especialidades.includes(specialty))
    {
      const index = this.selectedSpecialties.indexOf(specialty);
      if (index === -1) {
        this.selectedSpecialties.push(specialty);
      } else {
        this.selectedSpecialties.splice(index, 1);
      }
    }
    else
    {
      const index = this.especialidadesAgregadas.indexOf(specialty);

      if (index === -1) {
        this.especialidadesAgregadas.push(specialty);
      } else {
        this.especialidadesAgregadas.splice(index, 1);
      }
    }
  }

  isSelected(specialty: string): boolean {
    return (this.selectedSpecialties.includes(specialty) || this.especialidadesAgregadas.includes(specialty));
  }

  agregarEsp(){
    if(!this.especialidades.includes(this.especialidadesForm.value.especialidadOtra) && !this.especialidadesOtras.includes(this.especialidadesForm.value.especialidadOtra) )
    {
      this.especialidadesOtras.push(this.especialidadesForm.value.especialidadOtra);
    }
  }
}
