import { Component } from '@angular/core';
import * as echarts from 'echarts';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-logs-usuario-grafico',
  templateUrl: './logs-usuario-grafico.component.html',
  styleUrls: ['./logs-usuario-grafico.component.css']
})
export class LogsUsuarioGraficoComponent {
  logsUsuario: any[] = [];

  constructor(private data : DataService) {}
  
  ngOnInit()
  {
    this.getLogsUsuario();
  }

  async getLogsUsuario() {
    // Llama a tu función del servicio, que devuelve una Promesa
    try {
      this.logsUsuario = await this.data.getLogsUsuarioFecha();
      console.log(this.logsUsuario);
  
      // Después de obtener los datos, renderiza el gráfico
      this.renderChart();
    } catch (error) {
      console.error('Error al obtener los logs:', error);
    }
  }

  private renderChart() {
    if (this.logsUsuario && this.logsUsuario.length > 0) {
      const chartElement = document.getElementById('echarts-container');
      const chart = echarts.init(chartElement);
  
      const xAxisData = this.logsUsuario.map(log => log.fecha);
      const yAxisData = this.logsUsuario.map(log => log.cantidad);
  
      const option: echarts.EChartsOption = {
        title: {
          text: 'Cantidad de Logs por Fecha'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: xAxisData
        },
        yAxis: {
          type: 'value',
          name: 'Cantidad'
        },
        series: [{
          name: 'Logs',
          type: 'bar',
          data: yAxisData
        }]
      };
  
      chart.setOption(option);
    }
  }
}
