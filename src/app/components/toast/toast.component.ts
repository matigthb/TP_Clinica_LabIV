// toast.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-toast',
  template: `
    <div class="toast" [ngClass]="{ 'success': success, 'error': !success }">
      <p>{{ message }} HOKLASDASDKASKDJ</p>
      <button class ="btn btn-secondary"> Boton</button>
    </div>
  `,
  styles: [`
    .toast {
      min-width: 200px;
      padding: 10px 20px;
      border-radius: 5px;
      color: #fff;
      font-size: 16px;
      background-color: #60AFFF;
      z-index: 9999;
      position: fixed;
      bottom: 20px;
      right: 20px;
    }

    .error {
      background-color: #FF6060;
    }
  `]
})
export class ToastComponent {
  @Input() message: string = '';
  @Input() success: boolean = true;
}