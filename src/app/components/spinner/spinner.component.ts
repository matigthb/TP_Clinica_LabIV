import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/services/auth.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent {


  constructor(private spinner : SpinnerService, public auth : AuthenticationService)
  {

  }


}
