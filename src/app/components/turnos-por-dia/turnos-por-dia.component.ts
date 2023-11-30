import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-turnos-por-dia',
  templateUrl: './turnos-por-dia.component.html',
  styleUrls: ['./turnos-por-dia.component.css']
})
export class TurnosPorDiaComponent implements OnInit {

  chartOption: any = {};
  
  constructor(private data: DataService) {}

  async ngOnInit() {
    const cantidadTurnosPorDia = await this.data.getCantidadTurnosPorDia();

    // Preparar datos para el gráfico
    const dias = cantidadTurnosPorDia.map(item => item.Dia);
    const cantidades = cantidadTurnosPorDia.map(item => item.Cantidad);

    // Configurar opciones del gráfico
    this.chartOption = {
      title: {
        text: 'Cantidad de Turnos por Día',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: dias
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: cantidades,
        type: 'line',
        smooth: true
      }]
    };

    // Inicializar el gráfico
    const chartElement = document.getElementById('turnosPorDiaChart');
    const chart = echarts.init(chartElement);
    chart.setOption(this.chartOption);
  }
}