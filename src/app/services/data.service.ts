import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore, getDoc, getDocs, updateDoc, collectionData, doc, query, where, orderBy, setDoc, onSnapshot, deleteDoc } from
'@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, map, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
 
  private usuariosChanged = new Subject<void>();

  usuariosCambiados(): Observable<void> {
    return this.usuariosChanged.asObservable();
  }

  turnosObsEsp(usuario : any) : Observable<any[]>{
    return this.firestoreAng.collection('Turnos', ref => ref.where('EspecialistaDni', '==', usuario.Dni)).valueChanges({ idField: 'id' });
  }

  turnosObsPac(usuario : any) : Observable<any[]>{
    return this.firestoreAng.collection('Turnos', ref => ref.where('PacienteDni', '==', usuario.Dni)).valueChanges({ idField: 'id' });
  }

  turnosObsAdm() : Observable<any[]>{
    return this.firestoreAng.collection('Turnos').valueChanges({ idField: 'id' });
  }

  constructor(private firestore : Firestore, private toastr : ToastrService, private firestoreAng: AngularFirestore) { 
  }

  async getHorariosUsados(doctor: any, fecha : Date): Promise<any[]> {
    const userCollection = collection(this.firestore, 'Turnos');
    const q = query(userCollection, where('EspecialistaDni', '==', doctor.Dni), where('Estado', '==', 'Pendiente de Aprobación'));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) 
    {
      return [];
    } 

    const especialidades = querySnapshot.docs.map(doc => doc.data());
    let horarios : any = [];

    for(let esp of especialidades)
    {
      const fechaTurno = esp['Fecha'].toDate();
      // Comparar solo día, mes y año
      if (
        fechaTurno.getDate() === fecha.getDate() &&
        fechaTurno.getMonth() === fecha.getMonth() &&
        fechaTurno.getFullYear() === fecha.getFullYear()
      ) {
        horarios.push(esp['Horario']);
      }
    }

    return horarios;
  }

  public async GetEspecialidades() : Promise<any | null> 
  {
    const userCollection = collection(this.firestore, 'Especialidades');
    const q = query(userCollection);
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) 
    {
      return null;
    }

    const especialidades = querySnapshot.docs.map(doc => doc.data()['Nombre']);

    return especialidades;
  }

  async rechazarEspecialista(id: string): Promise<boolean> {
    const path = 'Especialista-Review';
    const documentRef = doc(this.firestore, path, await this.obtenerUIDDeEspecialista(id));

    console.log(this.obtenerUIDDeEspecialista(id));

    if(documentRef)
    {
      deleteDoc(documentRef);
      this.usuariosChanged.next();
      return true;
    }
    else
    {
      return false;
    }
  }

  async habilitarEspecialista(especialista : any): Promise<boolean> {
    
    if(await this.rechazarEspecialista(especialista.UID))
    {
      if(await this.AprobarEspecialista(especialista)){
        this.usuariosChanged.next();
        return true
      }else
      {
        return false;
      }
    };

    return false;
  }

  async guardarCalificacion(turno : any, calificacion : number, comentario : string)
  {
    try {
      {
        const uid =  await this.getTurnoByFechaAndTime(turno.Fecha, turno.Horario)

        if (!uid) {
          console.error('No se encontró el turno para calificar');
          return;
        }
        else
        {
          console.log(uid);
        }

        const turnoRef = doc(this.firestore, 'Turnos', uid);

        try {
          await updateDoc(turnoRef, {
              Calificacion : calificacion,
              ComentarioCalificacion : comentario,
          });

          this.toastr.success('Turno calificado correctamente');
        } catch (error) {
          this.toastr.error('Error al calificar el turno');
        }
      }
      
      // La operación de escritura en la base de datos ha sido completada con éxito.
      // Puedes devolver algún resultado si lo necesitas, por ejemplo, un mensaje de éxito.
    
      return true; // Puedes devolver cualquier valor o promesa aquí si es necesario.
    } catch (error) {
      // Manejar errores aquí si la operación de escritura falla.
      // Puedes lanzar una excepción o devolver un mensaje de error, dependiendo de tus necesidades.
      console.log(error);
      return false;
    }
  }

  async guardarEncuesta(turno : any, form : any)
  {
    try {
      {
        const uid =  await this.getTurnoByFechaAndTime(turno.Fecha, turno.Horario)

        if (!uid) {
          console.error('No se encontró el turno para cancelar');
          return;
        }
        else
        {
          console.log(uid);
        }

        const turnoRef = doc(this.firestore, 'Turnos', uid);

        try {
          await updateDoc(turnoRef, {
              EncSatisfecho : form.recomendacion,
              EncCualidad: form.cualidad,
              EncAmabilidad : form.amabilidad,
              EncDemoras : form.demoras,
              EncRegistro : form.registro,
              EncPlan : form.plan
            // Aquí puedes agregar otros campos que desees actualizar
          });

          this.toastr.success('Turno actualizado correctamente');
        } catch (error) {
          this.toastr.error('Error al actualizar el turno');
          // Puedes manejar el error según tus necesidades
        }
      }
      
      // La operación de escritura en la base de datos ha sido completada con éxito.
      // Puedes devolver algún resultado si lo necesitas, por ejemplo, un mensaje de éxito.
    
      return true; // Puedes devolver cualquier valor o promesa aquí si es necesario.
    } catch (error) {
      // Manejar errores aquí si la operación de escritura falla.
      // Puedes lanzar una excepción o devolver un mensaje de error, dependiendo de tus necesidades.
      console.log(error);
      return false;
    }
  }

  async cancelarTurno(turno : any, canceladoPor : string, razon:  string)
  { 
    const uid =  await this.getTurnoByFechaAndTime(turno.Fecha, turno.Horario)

    if (!uid) {
      console.error('No se encontró el turno para cancelar');
      return;
    }
    else
    {
      console.log(uid);
    }

    const turnoRef = doc(this.firestore, 'Turnos', uid);

    try {
      await updateDoc(turnoRef, {
          Estado: 'Cancelado',
          RazonCancelado : razon,
          CanceladoPor: canceladoPor,
        // Aquí puedes agregar otros campos que desees actualizar
      });

      console.log('Turno actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar el turno', error);
      // Puedes manejar el error según tus necesidades
    }
  }

  async rechazarTurno(turno : any, razon:  string)
  { 
    const uid =  await this.getTurnoByFechaAndTime(turno.Fecha, turno.Horario)

    if (!uid) {
      this.toastr.error('No se encontró el turno para rechazar');
      return;
    }

    const turnoRef = doc(this.firestore, 'Turnos', uid);

    try {
      await updateDoc(turnoRef, {
          Estado: 'Rechazado',
          RazonRechazado : razon,
        // Aquí puedes agregar otros campos que desees actualizar
      });

      this.toastr.success('Turno rechazado correctamente');
    } catch (error) {
      this.toastr.error('Error al rechazar el turno');
      // Puedes manejar el error según tus necesidades
    }
  }

  async aceptarTurno(turno : any)
  { 
    const uid =  await this.getTurnoByFechaAndTime(turno.Fecha, turno.Horario)

    if (!uid) {
      this.toastr.error('No se encontró el turno para aceptar');
      return;
    }
    else
    {
      console.log(uid);
    }

    const turnoRef = doc(this.firestore, 'Turnos', uid);

    try {
      await updateDoc(turnoRef, {
          Estado: 'Aceptado',
      });

      this.toastr.success('Turno aceptado correctamente');
    } catch (error) {
      this.toastr.error('Error al aceptar el turno');
      // Puedes manejar el error según tus necesidades
    }
  }

  async finalizarTurno(turno : any, historia: any, comentario : string)
  { 
    const uid =  await this.getTurnoByFechaAndTime(turno.Fecha, turno.Horario)

    if (!uid) {
      this.toastr.error('No se encontró el turno para finalizar');
      return;
    }

    const turnoRef = doc(this.firestore, 'Turnos', uid);

    try {
      await updateDoc(turnoRef, {
          Estado: 'Finalizado',
          Resenia : comentario,
          /*Historia : {
            Altura : historia.altura,
            Peso : historia.peso,
            Temperatura : historia.temperatura,
            Presion : historia.presion,
            campo1 : historia.altura,
            Altura : historia.altura,
            Altura : historia.altura,
            Altura : historia.altura,
          },*/ 
          Historia : historia
      });

      this.toastr.success('Turno finalizado correctamente');
    } catch (error) {
      this.toastr.error('Error al finalizar el turno');
      // Puedes manejar el error según tus necesidades
    }
  }
  

  async getTurnoByFechaAndTime(fecha: Date, horario: string): Promise<string | null> {
    const turnoCollection = collection(this.firestore, 'Turnos');

    const q = query(turnoCollection,
      where('Fecha', '==', fecha),
      where('Horario', '==', horario)
      // Puedes agregar más condiciones si es necesario
    );

    try {
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Devolver el UID del primer documento encontrado
        return querySnapshot.docs[0].id;
      } else {
        // Si no se encuentra ningún turno, puedes devolver null
        return null;
      }
    } catch (error) {
      console.error('Error al obtener el UID del turno', error);
      // Puedes manejar el error según tus necesidades
      throw error;
    }
  }


  async guardarTurno(especialista : any, paciente : any, especialidad : string, fecha : Date, horarios : string[])
  {
    const turnosCollection = collection(this.firestore, 'Turnos');
    try {
      for (const horario of horarios) {
        await addDoc(turnosCollection, {
          EspecialistaDni: especialista.Dni,
          EspecialistaNombre: especialista.Nombre,
          EspecialistaApellido: especialista.Apellido,
          PacienteNombre: paciente.Nombre,
          PacienteApellido: paciente.Apellido,
          PacienteDni: paciente.Dni,
          Especialidad: especialidad,
          Fecha: fecha,
          Horario: horario,
          Estado: 'Pendiente de Aprobación',
          RazonRechazado : '',
          RazonCancelado : '',
          CanceladoPor: '',
          Resenia: '',
          Comentario: '',
          EncSatisfecho : '',
          EncCualidad: '',
          EncAmabilidad : '', 
          EncDemoras : '',
          EncRegistro : '',
          EncPlan : '',
          Calificacion : '',
          CalificacionComentario : '',
        });
      }
      
      // La operación de escritura en la base de datos ha sido completada con éxito.
      // Puedes devolver algún resultado si lo necesitas, por ejemplo, un mensaje de éxito.
    
      return true; // Puedes devolver cualquier valor o promesa aquí si es necesario.
    } catch (error) {
      // Manejar errores aquí si la operación de escritura falla.
      // Puedes lanzar una excepción o devolver un mensaje de error, dependiendo de tus necesidades.
      console.log(error);
      return false;
    }
  }

  public async guardarLog(usuario : any)
  {
    const logCollection = collection(this.firestore, 'Logs');
    // Obtiene la fecha actual
    const fechaActual = new Date();

    // Accede a las partes de la fecha (año, mes, día)
    const anio = fechaActual.getFullYear();
    const mes = fechaActual.getMonth() + 1; // Ten en cuenta que los meses van de 0 a 11, por lo que sumamos 1
    const dia = fechaActual.getDate();

    // Obtiene la hora actual
    const horaActual = new Date();

    // Accede a las partes de la hora (hora, minutos, segundos)
    const horas = horaActual.getHours();
    const minutos = horaActual.getMinutes();
    const segundos = horaActual.getSeconds();
    try {
      await addDoc(logCollection, {
        Usuario : usuario,
        Fecha : dia + '/' + mes + '/' + anio,
        Horario : horas +':' + minutos +':' + segundos,
      });
      
      // La operación de escritura en la base de datos ha sido completada con éxito.
      // Puedes devolver algún resultado si lo necesitas, por ejemplo, un mensaje de éxito.
    
      return true; // Puedes devolver cualquier valor o promesa aquí si es necesario.
    } catch (error) {
      // Manejar errores aquí si la operación de escritura falla.
      // Puedes lanzar una excepción o devolver un mensaje de error, dependiendo de tus necesidades.
      console.log(error);
      return false;
    }
  }

  public async getLogsUsuario()
  {
    const userCollection = collection(this.firestore, 'Logs');
    const q = query(userCollection);
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) 
    {
      return [];
    }

    const especialidades = querySnapshot.docs.map(doc => doc.data());

    return especialidades;
  }

  public async getLogsUsuarioFecha() {
    const userCollection = collection(this.firestore, 'Logs');
    const q = query(userCollection, orderBy('Fecha'));  // Ordena por fecha para asegurar un orden consistente
    const querySnapshot = await getDocs(q);
  
    if (querySnapshot.empty) {
      return [];
    }
  
    // Agrupa y cuenta la cantidad de logs por fecha
    const logsPorFecha: Record<string, number> = {};
  
    querySnapshot.docs.forEach((doc) => {
      const fecha = doc.data()['Fecha'];  // Ajusta a la propiedad real de fecha en tus documentos
      if (logsPorFecha[fecha]) {
        logsPorFecha[fecha]++;
      } else {
        logsPorFecha[fecha] = 1;
      }
    });
  
    // Convierte el objeto en un array de objetos
    const logsUsuario = Object.keys(logsPorFecha).map((fecha) => ({
      fecha,
      cantidad: logsPorFecha[fecha]
    }));
  
    return logsUsuario;
  }

  async getCantidadTurnosPorEspecialidad() : Promise<any[]>
  {
    try {
      const userCollection = collection(this.firestore, 'Turnos');
      const q = query(userCollection,
        where('Estado', '==', 'Finalizado'));
      const querySnapshot = await getDocs(q);
      const cantidadPorEspecialidad: { [especialidad: string]: number } = {};

      if (querySnapshot.empty) 
      {
        return [];
      }

      querySnapshot.docs.forEach((doc) => {
        const especialidad = doc.data()['Especialidad'];

        if (especialidad in cantidadPorEspecialidad) {
          cantidadPorEspecialidad[especialidad]++;
        } else {
          cantidadPorEspecialidad[especialidad] = 1;
        }
      });

      // Convierte el objeto a un array de objetos
      const resultado = Object.keys(cantidadPorEspecialidad).map((key) => ({
        Especialidad: key,
        Cantidad: cantidadPorEspecialidad[key]
      }));

      return resultado;

    } catch (error) {
      console.error('Error al obtener la cantidad de turnos por especialidad', error);
      throw error;
    }
  }

  async getCantidadTurnosPorDia(): Promise<any[]> {
    try {
      const turnosCollection = collection(this.firestore, 'Turnos');
      const q = query(turnosCollection,
        where('Estado', '==', 'Finalizado'));
      const querySnapshot = await getDocs(q);
  
      const cantidadPorDia: { [dia: string]: number } = {};
  
      if (querySnapshot.empty) {
        return [];
      }
  
      querySnapshot.docs.forEach((doc) => {
        const fecha = doc.data()['Fecha']; // Ajusta el nombre según el campo real en Firestore
  
        const dia = fecha.toDate().toLocaleDateString(); // Convertir a cadena en formato de fecha corta
  
        if (dia in cantidadPorDia) {
          cantidadPorDia[dia]++;
        } else {
          cantidadPorDia[dia] = 1;
        }
      });
  
      // Convierte el objeto a un array de objetos
      const resultado = Object.keys(cantidadPorDia).map((key) => ({
        Dia: key,
        Cantidad: cantidadPorDia[key]
      }));
  
      return resultado;
  
    } catch (error) {
      console.error('Error al obtener la cantidad de turnos por día', error);
      throw error;
    }
  }

  async getCantidadTurnosPorEspecialista(fechaInicio : Date, fechaFin : Date, finalizados : boolean): Promise<any[]> {
    try {
      const inicioDelDia = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), fechaInicio.getDate()+ 1);

      // Obtén la fecha de fin del día correspondiente (agregando 1 día y restando 1 milisegundo)
      const finDelDia = new Date(fechaFin.getFullYear(), fechaFin.getMonth(), fechaFin.getDate() + 2);
      finDelDia.setMilliseconds(finDelDia.getMilliseconds() - 1);

      console.log(finalizados)

      const userCollection = collection(this.firestore, 'Turnos');

      let q;
      if(finalizados)
      {
        q = query(userCollection, where('Estado', '==', 'Finalizado'), where("Fecha", '>=', inicioDelDia), where("Fecha", '<=', finDelDia));
        console.log('FINALIZADOS')
      }
      else
      {
        q = query(userCollection, where("Fecha", '>=', inicioDelDia), where("Fecha", '<=', finDelDia));
        console.log('NO FINALIZADOS')
      }

      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return [];
      }
  
      const cantidadPorEspecialista: { [especialistaDni: string]: number } = {};
  
      querySnapshot.docs.forEach((doc) => {
        const especialistaDni = doc.data()['EspecialistaDni'];
  
        if (especialistaDni in cantidadPorEspecialista) {
          cantidadPorEspecialista[especialistaDni]++;
        } else {
          cantidadPorEspecialista[especialistaDni] = 1;
        }
      });
  
      // Convierte el objeto a un array de objetos
      const resultado = Object.keys(cantidadPorEspecialista).map((dni) => ({
        EspecialistaDni: dni,
        Cantidad: cantidadPorEspecialista[dni]
      }));
  
      return resultado;
  
    } catch (error) {
      console.error('Error al obtener la cantidad de turnos por especialista', error);
      throw error;
    }
  }

  async getEspecialistaByDni(dni: string): Promise<string | null> {
    const turnoCollection = collection(this.firestore, 'Especialistas');

    const q = query(turnoCollection,
      where('Dni', '==', dni),
    );

    try {
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Devolver el UID del primer documento encontrado
        return querySnapshot.docs[0].id;
      } else {
        // Si no se encuentra ningún turno, puedes devolver null
        return null;
      }
    } catch (error) {
      console.error('Error al obtener el UID del turno', error);
      // Puedes manejar el error según tus necesidades
      throw error;
    }
  }

  async getEspecialistaObjByDni(dni: string): Promise<any> {
    const turnoCollection = collection(this.firestore, 'Especialistas');

    const q = query(turnoCollection,
      where('Dni', '==', dni),
    );

    try {
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Devolver el UID del primer documento encontrado
        return querySnapshot.docs[0];
      } else {
        // Si no se encuentra ningún turno, puedes devolver null
        return null;
      }
    } catch (error) {
      console.error('Error al obtener el UID del turno', error);
      // Puedes manejar el error según tus necesidades
      throw error;
    }
  }

  async getPacienteByDni(dni: string): Promise<any | null> {
    const turnoCollection = collection(this.firestore, 'Pacientes');

    const q = query(turnoCollection,
      where('Dni', '==', dni),
    );

    try {
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Devolver el UID del primer documento encontrado
        return querySnapshot.docs[0];
      } else {
        // Si no se encuentra ningún turno, puedes devolver null
        return null;
      }
    } catch (error) {
      // Puedes manejar el error según tus necesidades
      throw error;
    }
  }

  async actualizarHorarios(especialista :  any, horariosSem : any[], horariosSab : any[])
  {
    try {
      {
        const uid =  await this.getEspecialistaByDni(especialista.Dni)

        if (!uid) {
          console.error('No se encontró el especialista para actualizar');
          return;
        }
        else
        {
          console.log(uid);
        }

        const turnoRef = doc(this.firestore, 'Especialistas', uid);

        try {
          await updateDoc(turnoRef, {
              HorariosSemana : horariosSem,
              HorariosSabado: horariosSab
            // Aquí puedes agregar otros campos que desees actualizar
          });

          this.toastr.success('Horarios actualizados correctamente');
        } catch (error) {
          console.log(error)
          this.toastr.error('Error al actualizar horarios');
          // Puedes manejar el error según tus necesidades
        }
      }
      
      // La operación de escritura en la base de datos ha sido completada con éxito.
      // Puedes devolver algún resultado si lo necesitas, por ejemplo, un mensaje de éxito.
    
      return true; // Puedes devolver cualquier valor o promesa aquí si es necesario.
    } catch (error) {
      // Manejar errores aquí si la operación de escritura falla.
      // Puedes lanzar una excepción o devolver un mensaje de error, dependiendo de tus necesidades.
      console.log(error);
      return false;
    }
  }

  generarHorarios(diaSeleccionado: number) : any[]{
    const horarios = [];

    const inicio = diaSeleccionado === 6 ? 8 * 60 : 8 * 60; 
    const fin = diaSeleccionado === 6 ? 14 * 60 : 19 * 60; 

    for (let minutos = inicio; minutos <= fin; minutos += 30) {
      const hora = Math.floor(minutos / 60);
      const minuto = minutos % 60;

      const horaFormateada = hora < 10 ? `0${hora}` : `${hora}`;
      const minutoFormateado = minuto === 0 ? '00' : `${minuto}`;

      const horario = `${horaFormateada}:${minutoFormateado}`;

      horarios.push(horario);
      
    }

    return horarios;
  }


  async AprobarEspecialista(especialista : any)
  {
    const usersCollection = collection(this.firestore, 'Especialistas');
    const especialidadesCollection = collection(this.firestore, 'Especialidades');
    const timestamp = new Date();
    try {

      await addDoc(usersCollection, {
        Nombre: especialista.Nombre,
        Apellido: especialista.Apellido,
        Edad: especialista.Edad,
        Dni: especialista.Dni,
        Especialidades: especialista.Especialidades,
        Email: especialista.Email,
        Password: especialista.Password,
        Foto : especialista.Foto,
        UID: especialista.UID,
        HorariosSemana : this.generarHorarios(1),
        HorariosSabado : this.generarHorarios(6),
      });

      for (const especialidad of especialista.EspecialidadesAgregadas) {
        const nuevaEspecialidadRef = doc(especialidadesCollection);
        await setDoc(nuevaEspecialidadRef, { Nombre: especialidad });
      }
      
      // La operación de escritura en la base de datos ha sido completada con éxito.
      // Puedes devolver algún resultado si lo necesitas, por ejemplo, un mensaje de éxito.
    
      return true; // Puedes devolver cualquier valor o promesa aquí si es necesario.
    } catch (error) {
      // Manejar errores aquí si la operación de escritura falla.
      // Puedes lanzar una excepción o devolver un mensaje de error, dependiendo de tus necesidades.
      console.log(error);
      return false;
    }
  }

  public async getPacientesDe(especialista : any) : Promise<any | null> 
  {
    console.log(especialista)
    const userCollection = collection(this.firestore, 'Turnos');
    const q = query(userCollection, where('EspecialistaDni', '==', especialista.Dni), where('Estado', '==', 'Finalizado'));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) 
    {
      return null;
    }

    const dnipacientes = querySnapshot.docs.map(doc => doc.data());
    let pacientes : any[] = [];
    let pacientesdniusados : any[] = [];

    dnipacientes.forEach(async element => {
      if(!pacientesdniusados.includes(element['PacienteDni']))
      {
        pacientesdniusados.push(element['PacienteDni'])
        pacientes.push({
          Dni : element['PacienteDni'],
          Nombre : element['PacienteNombre'],
          Apellido : element['PacienteApellido'],
        })
      }
    });

    return pacientes;
  }

  public async GetUsuarios(tablaOrigen : string) : Promise<any | null> 
  {
    const userCollection = collection(this.firestore, tablaOrigen);
    const q = query(userCollection);
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) 
    {
      return null;
    }

    const especialistas = querySnapshot.docs.map(doc => doc.data());

    return especialistas;
  }

  public async getTurnos(finalizados : boolean) : Promise<any | null> 
  {
    const userCollection = collection(this.firestore, 'Turnos');
    let q;
    
    if(finalizados)
    {
      q = query(userCollection, where('Estado', '==', 'Finalizado'));
    }
    else
    {
      q = query(userCollection);
    }

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) 
    {
      return null;
    }

    const turnos = querySnapshot.docs.map(doc => doc.data());

    return turnos;
  }

  public async getMisTurnos(paciente : any, finalizados : boolean) : Promise<any | null> 
  {
    const userCollection = collection(this.firestore, "Turnos");

    let q;
    
    if(finalizados)
    {
      q = query(userCollection, where('PacienteDni', '==', paciente.Dni), where('Estado', '==', 'Finalizado'));
    }
    else
    {
      q = query(userCollection, where('PacienteDni', '==', paciente.Dni));
    }

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) 
    {
      return null;
    }

    const especialistas = querySnapshot.docs.map(doc => doc.data());

    return especialistas;
  }

  public async getMisTurnosEsp(paciente : any, finalizados : boolean) : Promise<any | null> 
  {
    const userCollection = collection(this.firestore, "Turnos");
    let q;

    if(finalizados)
    {
      q = query(userCollection, where('EspecialistaDni', '==', paciente.Dni), where('Estado', '==', 'Finalizado'));
    }
    else
    {
      q = query(userCollection, where('EspecialistaDni', '==', paciente.Dni));
    }

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) 
    {
      return null;
    }

    const especialistas = querySnapshot.docs.map(doc => doc.data());

    return especialistas;
  }


  public async getUserByUID(UIDUser: string)
  {
    const userCollection = collection(this.firestore, "Pacientes");
    const q = query(userCollection, where('UID', '==', UIDUser));
    const querySnapshot = await getDocs(q);

    console.log("getUserByUID !!!!" + UIDUser)

    if (!querySnapshot.empty) 
    {
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
    

      return userData;
    }
    else
    {
      const userCollection = collection(this.firestore, "Especialistas");
      const q = query(userCollection, where('UID', '==', UIDUser));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) 
      {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
      

        return userData;
      }
      else
      {
        const userCollection = collection(this.firestore, "Admins");
        const q = query(userCollection, where('UID', '==', UIDUser));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) 
        {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
        

          return userData;
        }
      }
    }
    
    return null;
  }

  public async getFotoEspecialidad(especialidad: string): Promise<string> {
    const userCollection = collection(this.firestore, 'Especialidades');
    const q = query(userCollection, where('Nombre', '==', especialidad));
  
    try {
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        const fotoPromise = userData['Foto'];
  
        if (fotoPromise instanceof Promise) {
          try {
            const foto = await fotoPromise;
            console.log("Error al obtener la asdasdfoto:");
            return foto || "../../../assets/clinica.png";
          } catch (error) {
            console.error("Error al obtener la foto:", error);
            return "../../../assets/clinica.png";
          }
        } else if (typeof fotoPromise === 'string') {
          console.log(fotoPromise);
          return fotoPromise;
        }
      }
    } catch (error) {
      console.error("Error al obtener la foto:", error);
    }
  
    return "../../../assets/clinica.png";
  }

  async obtenerUIDDeEspecialista(especialistaID: string): Promise<string> {
    const especialistasCollection = collection(this.firestore, 'Especialista-Review');
    const q = query(especialistasCollection, where('UID', '==', especialistaID));

    try {
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Devolver el ID del primer documento que cumple con la condición
        return querySnapshot.docs[0].id;
      } else {
        // No se encontraron documentos que cumplan con la condición
        return "";
      }
    } catch (error) {
      console.error(error);
      return "";
    }
  }
}
