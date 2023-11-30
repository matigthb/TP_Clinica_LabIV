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

  public usuarioLogueado : any = null;
  public esAdmin : boolean = false;
  public esEspecialista : boolean = false;
  public esPaciente : boolean = false;
  public uid : string = "";
  private usuariosChanged = new Subject<void>();
  public mailSinConfirmar : string = "";
  public isLoading : boolean = false;

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
        this.mailSinConfirmar = email;
      }) ;
      this.uid = await this.getUserUid() || '';
      
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
        UID: this.uid
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
        this.mailSinConfirmar = email;
        sendEmailVerification(res.user);
      }) ;
      this.uid = await this.getUserUid() || '';

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
        UID: this.uid
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
        this.mailSinConfirmar = email;
        sendEmailVerification(res.user);
      }) ;
      this.uid = await this.getUserUid() || '';

      await addDoc(usersCollection, {
        Nombre: nombre,
        Apellido: apellido,
        Edad: edad,
        Dni: dni,
        Email: email,
        Password: password,
        Foto : foto,
        UID: this.uid
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
          this.mailSinConfirmar = email;
          this.uid = "";
          this.usuarioLogueado = null;
          this.router.navigateByUrl('/verify-email');
          this.toastr.info('El correo electrónico no se encuentra verificado');
          return null; // El correo electrónico no está verificado
        } else {
          this.uid = await this.getUserUid() || '';
          if(await this.data.obtenerUIDDeEspecialista(this.uid) == "")
          {
            this.esAdmin = await this.isAdmin(email);
            this.esEspecialista = await this.isEsp(email);
            this.esPaciente = await this.isPac(email);
            this.usuarioLogueado = await this.data.getUserByUID(this.uid);
            return true; // Autenticación exitosa
          }
          else
          {
            this.toastr.error('Un Admin debe verificar su cuenta de especialista antes de ingresar.');
            return null; // No se obtuvo un usuario (autenticación fallida)
          }
        }
      } else {
        this.toastr.error('No se obtuvo un usuario (autenticación fallida)');
        return null; // No se obtuvo un usuario (autenticación fallida)
      }
    } catch (error) {
      this.toastr.error('Error en la autenticación');
      this.usuarioLogueado = null;
      return null; // Manejo de errores
    }
  }

  async isAdmin(email: string): Promise<boolean> {
    const q = query(collection(this.firestore, 'Admins'), where('Email', '==', email));
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map(doc => doc.data() as User);

    if(users.length > 0)
    {
      return true;
    }
    else{
      return false;
    }
  }

  async isEsp(email: string): Promise<boolean> {
    const q = query(collection(this.firestore, 'Especialistas'), where('Email', '==', email));
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map(doc => doc.data() as User);

    if(users.length > 0)
    {
      return true;
    }
    else{
      return false;
    }
  }

  async isPac(email: string): Promise<boolean> {
    const q = query(collection(this.firestore, 'Pacientes'), where('Email', '==', email));
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map(doc => doc.data() as User);

    if(users.length > 0)
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
    this.usuarioLogueado = await this.data.getUserByUID(uid);
    if(this.usuarioLogueado != null)
    {
      await this.logIn(this.usuarioLogueado.Email, this.usuarioLogueado.Password)
      if(this.usuarioLogueado != null)
      {
        this.esAdmin = await this.isAdmin(this.usuarioLogueado.Email)
        this.esEspecialista = await this.isEsp(this.usuarioLogueado.Email)
        this.esPaciente= await this.isPac(this.usuarioLogueado.Email)
      }
    }

  }

  public async logOut() 
  {
    await this.afAuth.signOut();
    this.uid = '';
    this.usuarioLogueado = null;
    this.esAdmin = false;
    this.esEspecialista = false;
    this.esPaciente = false;
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