import { Component } from '@angular/core';
import { EChartsOption } from 'echarts';
import { DataService } from 'src/app/services/data.service';
import * as echarts from 'echarts';

@Component({
  selector: 'app-logs-usuario',
  templateUrl: './logs-usuario.component.html',
  styleUrls: ['./logs-usuario.component.css']
})
export class LogsUsuarioComponent {
  logsUsuario: any[] = [];

  constructor(private data : DataService) {}
  
  ngOnInit()
  {
    this.getLogsUsuario();
  }

  async getLogsUsuario() {
    // Llama a tu función del servicio, que devuelve una Promesa
    try {
      this.logsUsuario = await this.data.getLogsUsuario();
      console.log(this.logsUsuario);
    } catch (error) {
      console.error('Error al obtener los logs:', error);
    }
  }
}
