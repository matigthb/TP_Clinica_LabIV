import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';
import { AuthenticationService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-historias-clinicas',
  templateUrl: './historias-clinicas.component.html',
  styleUrls: ['./historias-clinicas.component.css']
})
export class HistoriasClinicasComponent implements OnInit, AfterViewInit{
  turnos : any[] = [];
  @Input() pacienteInput: any = null;

  @ViewChild('content',{static:false}) el!: ElementRef

  constructor(public auth : AuthenticationService, private data : DataService, public datePipe : DatePipe)
  {
    
  }

  async ngOnInit() {
    if(this.pacienteInput != null)
    {
      console.log(this.pacienteInput + "asdasdasd")
      this.turnos = await this.data.getMisTurnos(this.pacienteInput, true);
    }
    else
    {
      this.turnos = await this.data.getMisTurnos(this.auth.usuarioLogueado, true);
    }
  }

  ngAfterViewInit() {
    // Verifica si hay datos antes de intentar generar el PDF
    if (this.turnos && this.turnos.length > 0) {
      this.makePDF();
    }
  }

  makePDF() {
    if (this.turnos && this.turnos.length > 0) {
      const pdf = new jsPDF();
      const margenIzquierdo = 10;
      let margenSuperior = 10;
      const espacioEntreFilas = 10;
      const fontSize = 12;
      let contador = 0;
      let contadorRows = 0;
      const maxRowsPerPage = 20; // Número máximo de filas por página
  
      // Configura la fuente para el primer encabezado
      pdf.setFontSize(16);
  
      // Agrega el logo de la clínica arriba del primer encabezado
      const logo = '../../favicon.ico'; // Ruta a la imagen del logo
      pdf.addImage(logo, 'JPEG', margenIzquierdo, margenSuperior, 30, 30);
  
      // Incrementa la posición superior para dejar espacio después del logo
      margenSuperior += 40;
  
      // Agrega el primer encabezado centrado
      const hoy = new Date()
      const encabezado1 = 'Historia Clínica al día ' + this.datePipe.transform(hoy, 'fullDate', 'es');
      const anchoPagina = pdf.internal.pageSize.width;
      pdf.text(encabezado1, anchoPagina / 2, margenSuperior, { align: 'center' });
  
      // Restablece la fuente para el contenido de los turnos
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica');

      // Incrementa la posición superior para dejar espacio después del primer encabezado
      margenSuperior += 20;
  
      // Configura la fuente para el segundo encabezado
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'italic');

      // Agrega el segundo encabezado centrado
      const encabezado2 = 'Información de turnos realizados a ' + this.auth.usuarioLogueado.Nombre + " " + this.auth.usuarioLogueado.Apellido;
      pdf.text(encabezado2, anchoPagina / 2, margenSuperior, { align: 'center' });
  
      // Restablece la fuente para el contenido de los turnos
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica');
  
      // Incrementa la posición superior para dejar espacio después del segundo encabezado
      margenSuperior += 20;
      
      console.log(this.turnos); 
      // Itera sobre los turnos y agrega la información al PDF
      this.turnos.forEach((turno, index) => {
        if(index>0)
        {
          pdf.addPage(); // Agrega una nueva página
          margenSuperior = 90; // Reinicia la posición superior
          contadorRows = 0; // Reinicia el contador
        }
        console.log(index);

        pdf.text(`Especialidad: ${turno.Especialidad} Atendido por: Dr/a. ${turno.EspecialistaApellido}`, margenIzquierdo, margenSuperior + espacioEntreFilas);
        pdf.text(`Fecha: ${this.datePipe.transform(turno.Fecha.toDate(), 'fullDate', 'es')} Horario: ${turno.Horario}`, margenIzquierdo, margenSuperior + espacioEntreFilas * 2);
        pdf.text(`Altura: ${turno.Historia.altura}`, margenIzquierdo, margenSuperior + espacioEntreFilas * 3);
        pdf.text(`Peso: ${turno.Historia.peso}`, margenIzquierdo, margenSuperior + espacioEntreFilas * 4);
        pdf.text(`Temperatura: ${turno.Historia.temperatura}`, margenIzquierdo, margenSuperior + espacioEntreFilas * 5);
        contador = 5;

        if (turno.Historia.valor1 != '') {
          contador++;
          contadorRows++;
          pdf.text(`${turno.Historia.clave1}: ${turno.Historia.valor1}`, margenIzquierdo, margenSuperior + espacioEntreFilas * contador);
        }

        if (turno.Historia.valor2 != '') {
          contador++;
          contadorRows++;
          pdf.text(`${turno.Historia.clave2}: ${turno.Historia.valor2}`, margenIzquierdo, margenSuperior + espacioEntreFilas * contador);
        }

        if (turno.Historia.valor3 != '') {
          contador++;
          contadorRows++;
          pdf.text(`${turno.Historia.clave3}: ${turno.Historia.valor3}`, margenIzquierdo, margenSuperior + espacioEntreFilas * contador);
        }

        // Ajusta la posición superior para la siguiente fila
        margenSuperior += espacioEntreFilas * (contador + 1);

        contador++;
        // Agrega un espacio entre turnos
        pdf.text('----------------------------------------------------------------------------------------------', margenIzquierdo, margenSuperior + espacioEntreFilas);
  
        // Ajusta la posición superior para el próximo espacio entre turnos
        margenSuperior += espacioEntreFilas;
      });
  
      // Guarda el PDF
      pdf.save('Historia_Clinica.pdf');
    } else {
      console.log("No hay datos para generar el PDF");
    }
  }
  

  


}
