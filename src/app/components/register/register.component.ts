import { Component, OnInit  } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent{

  constructor(public formBuilder: FormBuilder, private router: Router, private auth:AuthenticationService, private dataServ : DataService) {
  }

  
}
