import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import * as echarts from 'echarts';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-turnos-finalizados',
  templateUrl: './turnos-finalizados.component.html',
  styleUrls: ['./turnos-finalizados.component.css']
})
export class TurnosFinalizadosComponent {
  chartOption: echarts.EChartsOption = {};
  loading: boolean = true;
  fechaSeleccionada1 : string = "";
  fechaSeleccionada2 : string = "";

  constructor(private dataService: DataService, private datePipe : DatePipe) {}

  fechaInicio: Date | null = null; // Inicializa con la fecha actual

  // Función para manejar el cambio en la entrada de fecha
  onFechaInicioChange(event: any) {
    this.fechaInicio = new Date(event.target.value);
    if(this.fechaFin != null)
    {
      this.loadData();
    }
  }
  
  fechaFin: Date | null = null; // Inicializa con la fecha actual

  // Función para manejar el cambio en la entrada de fecha
  onFechaFinChange(event: any) {
    this.fechaFin = new Date(event.target.value);
    if(this.fechaInicio != null)
    {
      this.loadData();
    }
  }

  async loadData() {
    try {
      // Supongamos que tu servicio devuelve un array de objetos con propiedades "EspecialistaDni" y "Cantidad"
      if(this.fechaInicio != null && this.fechaFin != null)
      {
        const data = await this.dataService.getCantidadTurnosPorEspecialista(this.fechaInicio, this.fechaFin, true);
        
        console.log(data);
        
        // Mapea los DNIs a objetos de especialistas
        const especialistasPromises = data.map(async (item) => {
          const especialistaObj = item ? await this.dataService.getEspecialistaObjByDni(item.EspecialistaDni) : null;
          
          if (especialistaObj) {
            return {
              Especialista: {
                Nombre: especialistaObj.data().Nombre,
                Apellido: especialistaObj.data().Apellido,
              },
              Cantidad: item.Cantidad,
            };
          } else {
            return null;
          }
        });
        
        // Espera a que todas las promesas se resuelvan
        const especialistasData = await Promise.all(especialistasPromises);
        
        // Filtra los especialistas nulos (si hubo algún error al obtener el objeto del especialista)
        const especialistasFiltrados = especialistasData.filter(especialista => especialista !== null);
        
        this.chartOption = {
          title: {
            text: 'Cantidad de Turnos Finalizados por Especialista'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          xAxis: {
            type: 'category',
            data: especialistasFiltrados.map(item => item?.Especialista?.Nombre && item?.Especialista?.Apellido ? `${item.Especialista.Nombre} ${item.Especialista.Apellido}` : '')
          },
          yAxis: {
            type: 'value',
            name: 'Cantidad'
          },
          series: [
            {
              name: 'Turnos',
              type: 'bar',
              data: especialistasFiltrados.map(item => item?.Cantidad ?? 0),
              itemStyle: {
                color: '#5e83ba' // Puedes cambiar el color según tu preferencia
              }
            }
          ]
        };
        
        // Inicializa ECharts en el elemento con ID "turnosPorEspecialistaChart" después de haber asignado los datos al gráfico
        this.initializeECharts();
        
        this.loading = false;
      }
      } catch (error) {
        console.error('Error al cargar los datos', error);
      }
  }
  
  initializeECharts() {
    const chartElement = document.getElementById('turnosPorEspecialistaChart');
    if (chartElement) {
      // Verifica si ya hay una instancia de gráfico en el elemento
      if (echarts.getInstanceByDom(chartElement)) {
        // Si ya está inicializado, destrúyelo antes de crear uno nuevo
        echarts.dispose(chartElement);
      }

      // Inicializa el nuevo gráfico
      const chart = echarts.init(chartElement);
      chart.setOption(this.chartOption);
    }
  }
}
