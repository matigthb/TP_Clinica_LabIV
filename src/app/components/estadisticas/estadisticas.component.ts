import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EChartsOption } from 'echarts';
import { AuthenticationService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit{
  @ViewChild('chartContainer') chartContainer!: ElementRef;
  
  viewEstadisticas : boolean = false;
  pdfTitulo : string = "";
  turnos : any[] = [];
  chartOption: EChartsOption = {};

  constructor(private auth : AuthenticationService, private data : DataService)
  {
  }

  /*generarPDF() {
    const chartElement = this.chartContainer.nativeElement;

    // Convierte el gráfico a una imagen utilizando html2canvas
    html2canvas(chartElement).then((canvas) => {
      // Convierte la imagen a un archivo PDF utilizando html2pdf
      html2pdf().from(canvas).save();
    });
  }*/

  generarPDF() {
    let DATA;

    if(this.pdfTitulo != 'Clinica_Norte_Logs_Usuario')
    {
      DATA = document.getElementById('chartContainer');
    }
    else
    {
      DATA = document.getElementById('chartLogs');
    }

    const doc = new jsPDF('l', 'pt', 'a4'); // 'l' para orientación horizontal
    const options = {
      background: 'white',
      scale: 3,
    };
    
    if(DATA)
    {
      html2canvas(DATA, options).then((canvas) => {
        const img = canvas.toDataURL('image/PNG');
    
        const bufferX = 15;
        const bufferY = 15;
        const imgProps = (doc as any).getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
        doc.addImage(
          img,
          'PNG',
          bufferX,
          bufferY,
          pdfWidth,
          pdfHeight,
          undefined,
          'FAST'
        );
    
        return doc;
      })
      .then((docResult) =>{
        docResult.save(this.pdfTitulo + '.pdf');
      });
    }
  }

  async ngOnInit()
  {
    this.turnos = await this.data.getTurnos(false);
    const chartData = this.turnos.map((turno) => ({
      value: turno.EspecialistaDni,
      name: turno.Fecha,
    }));

    this.chartOption = {
      backgroundColor: '#2c343c',
      title: {
        text: 'Customized Pie',
        left: 'center',
        top: 20,
        textStyle: {
          color: '#ccc'
        }
      },
      tooltip: {
        trigger: 'item'
      },
      visualMap: {
        show: false,
        min: 80,
        max: 600,
        inRange: {
          colorLightness: [0, 1]
        }
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: '55%',
          center: ['50%', '50%'],
          data: chartData,
          roseType: 'radius',
          label: {
            color: 'rgba(255, 255, 255, 0.3)'
          },
          labelLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.3)'
            },
            smooth: 0.2,
            length: 10,
            length2: 20
          },
          itemStyle: {
            color: '#c23531',
            shadowBlur: 200,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          },
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
            return Math.random() * 200;
          }
        }
      ],
    };
  }
}
