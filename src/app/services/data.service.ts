import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore, getDoc, getDocs, updateDoc, collectionData, doc, query, where, orderBy, setDoc, onSnapshot, deleteDoc } from
'@angular/fire/firestore';
import { BehaviorSubject, Observable, map, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private usuariosChanged = new Subject<void>();

  usuariosCambiados(): Observable<void> {
    return this.usuariosChanged.asObservable();
  }

  constructor(private firestore : Firestore) { 
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
      console.log('hola rec');
      deleteDoc(documentRef);
      console.log("chaurec");
      this.usuariosChanged.next();
      return true;
    }
    else
    {
      console.log("chaurec234234SD");
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
        UID: especialista.UID
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


  public async getUserNameByUID(UIDUser: string)
  {
    const userCollection = collection(this.firestore, 'Users');
    const q = query(userCollection, where('UID', '==', UIDUser));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) 
    {
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      console.log(userData['UserName']);
      let userName = userData['UserName'];

      return userName;
    }
    
    return "";
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
