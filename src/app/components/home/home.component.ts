import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent{

  constructor(public auth : AuthenticationService)
  {
  }
}
