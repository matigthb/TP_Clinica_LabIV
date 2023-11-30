import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './services/auth.service';
import { RouterOutlet } from '@angular/router';
import { fader, slider } from './route-animations'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [ // <-- add your animations here
    // fader,
    slider,
    // transformer,
    // stepper
  ]
})
export class AppComponent implements OnInit{
  mostrarMensaje : boolean = true;
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  constructor(public auth : AuthenticationService)
  {
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  async ngOnInit()
  {
    this.auth.isLoading = true;
    if(this.auth.usuarioLogueado == null)
    {
      await this.auth.reLogin();
    }
    this.auth.isLoading = false;
  }

  logOut()
  {
    this.auth.logOut();
  }
}
