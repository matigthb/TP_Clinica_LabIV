import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore, getDoc, getDocs, updateDoc, collectionData, doc, query, where, orderBy, setDoc, onSnapshot } from
'@angular/fire/firestore';
import { BehaviorSubject, Observable, Subject, map } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { DataService } from './data.service';
import { sendEmailVerification, createUserWithEmailAndPassword, Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public usuarioLogueado : string = "";
  public esAdmin : boolean = false;
  private usuariosChanged = new Subject<void>();

  constructor(private router: Router,private auth : Auth, private afAuth: AngularFireAuth, private firestore: Firestore, private data : DataService, private toastr : ToastrService) { }

  usuariosCambiados(): Observable<void> {
    return this.usuariosChanged.asObservable();
  }

  async registerPac(nombre:string, apellido:string, edad: number, dni:number, obraSocial: string, email:string, password : string, foto1 : string, foto2 : string)
  {
    const usersCollection = collection(this.firestore, 'Pacientes');
    const timestamp = new Date();
    try {
      await createUserWithEmailAndPassword(this.auth, email,password).then( res => {
        sendEmailVerification(res.user);
        this.usuarioLogueado = email;
      }) ;
      const uid = await this.getUserUid() || '';

      await addDoc(usersCollection, {
        Nombre: nombre,
        Apellido: apellido,
        Edad: edad,
        Dni: dni,
        ObraSocial: obraSocial,
        Email: email,
        Password: password,
        Foto1: foto1,
        Foto2: foto2,
        UID: uid
      });

      this.usuariosChanged.next();
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

  /*sendEmailForVerification(user : any)
  {
    user.sendEmailForVerification().then((res : any) => {
      console.log("mail enviado")
    }, (err : any) =>{
      console.log("error enviando mail")
    })
  }*/

  async registerEsp(nombre:string, apellido:string, edad: number, dni:number, especialidadesArray : string[], espAgregadaas : string[], email:string, password : string, foto : string)
  {
    const usersCollection = collection(this.firestore, 'Especialista-Review');
    const timestamp = new Date();
    try {
      await createUserWithEmailAndPassword(this.auth, email,password).then( res => {
        this.usuarioLogueado = email;
        sendEmailVerification(res.user);
      }) ;
      const uid = await this.getUserUid() || '';

      console.log(especialidadesArray + nombre);

      await addDoc(usersCollection, {
        Nombre: nombre,
        Apellido: apellido,
        Edad: edad,
        Dni: dni,
        Especialidades: especialidadesArray,
        EspecialidadesAgregadas : espAgregadaas,
        Email: email,
        Password: password,
        Foto : foto,
        UID: uid
      });

      
      // La operación de escritura en la base de datos ha sido completada con éxito.
      // Puedes devolver algún resultado si lo necesitas, por ejemplo, un mensaje de éxito.
      this.usuariosChanged.next();
      return true; // Puedes devolver cualquier valor o promesa aquí si es necesario.
    } catch (error) {
      // Manejar errores aquí si la operación de escritura falla.
      // Puedes lanzar una excepción o devolver un mensaje de error, dependiendo de tus necesidades.
      console.log(error);
      return false;
    }
  }

  async registerAdm(nombre:string, apellido:string, edad: number, dni:number, email:string, password : string, foto : string)
  {
    const usersCollection = collection(this.firestore, 'Admins');
    const timestamp = new Date();
    try {
      await createUserWithEmailAndPassword(this.auth, email,password).then( res => {
        this.usuarioLogueado = email;
        sendEmailVerification(res.user);
      }) ;
      const uid = await this.getUserUid() || '';

      await addDoc(usersCollection, {
        Nombre: nombre,
        Apellido: apellido,
        Edad: edad,
        Dni: dni,
        Email: email,
        Password: password,
        Foto : foto,
        UID: uid
      });

      
      // La operación de escritura en la base de datos ha sido completada con éxito.
      // Puedes devolver algún resultado si lo necesitas, por ejemplo, un mensaje de éxito.
      this.usuariosChanged.next();
      return true; // Puedes devolver cualquier valor o promesa aquí si es necesario.
    } catch (error) {
      // Manejar errores aquí si la operación de escritura falla.
      // Puedes lanzar una excepción o devolver un mensaje de error, dependiendo de tus necesidades.
      console.log(error);
      return false;
    }
  }

  public async logIn(email: string, password: string) {
    try {
      console.log(email + password);
  
      const { user } = await signInWithEmailAndPassword(this.auth, email, password);
  
      if (user) {
        if (!user.emailVerified) {
          console.log(email + password + 'El correo electrónico no está verificado');
          this.usuarioLogueado = email;
          this.router.navigateByUrl('/verify-email');
          this.toastr.info('El correo electrónico no se encuentra verificado');
          return null; // El correo electrónico no está verificado
        } else {
          console.log(email + password + 'Autenticación exitosa');
          const uid = await this.getUserUid() || '';
          this.usuarioLogueado = await this.data.getUserNameByUID(uid);
          this.esAdmin = await this.isAdmin(email);
          return true; // Autenticación exitosa
        }
      } else {
        this.toastr.error('No se obtuvo un usuario (autenticación fallida)');
        return null; // No se obtuvo un usuario (autenticación fallida)
      }
    } catch (error) {
      this.toastr.error('Error en la autenticación');
      this.usuarioLogueado = "";
      return null; // Manejo de errores
    }
  }

  async isAdmin(email: string): Promise<boolean> {
    const q = query(collection(this.firestore, 'Admins'), where('Email', '==', email));
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map(doc => doc.data() as User);

    if(users != null)
    {
      return true;
    }
    else{
      return false;
    }
  }

  public async getUserUid()
  {
    return new Promise<string | null>((resolve, reject) => 
    {
      this.afAuth.authState.subscribe(user => {
        if (user) {
          resolve(user.uid);
        } else {
          resolve(null); 
        }
      });
    });
  }

  public async reLogin() 
  {
    const uid = await this.getUserUid() || '';
    this.usuarioLogueado = await this.data.getUserNameByUID(uid);
    console.log(uid);
  }

}

interface User {
  Nombre: string,
  Apellido: string,
  Edad: number,
  Dni: number,
  ObraSocial: string,
  Email: string,
  Password: string,
  Foto1 : string,
  Foto2 : string, 
  UID: string
  // ... otras propiedades del usuario
}