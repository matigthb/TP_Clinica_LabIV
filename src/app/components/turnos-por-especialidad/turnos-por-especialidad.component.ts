import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { AuthenticationService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-turnos-por-especialidad',
  templateUrl: './turnos-por-especialidad.component.html',
  styleUrls: ['./turnos-por-especialidad.component.css']
})
export class TurnosPorEspecialidadComponent implements OnInit{

  chartOption: echarts.EChartsOption = {};
  loading: boolean = true;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    try {
      // Supongamos que tu servicio devuelve un array de objetos con propiedades "Especialidad" y "Cantidad"
      const data = await this.dataService.getCantidadTurnosPorEspecialidad();

      console.log(data);

      this.chartOption = {
        title: {
          text: 'Cantidad de Turnos (Finalizados y NO Finalizados) por Especialidad'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: data.map(item => item.Especialidad)
        },
        yAxis: {
          type: 'value',
          name: 'Cantidad'
        },
        series: [
          {
            name: 'Turnos',
            type: 'bar',
            data: data.map(item => item.Cantidad),
            itemStyle: {
              color: '#5e83ba' // Puedes cambiar el color según tu preferencia
            }
          }
        ]
      };

      this.loading = false;
    } catch (error) {
      console.error('Error al cargar los datos', error);
    }
  }

}
