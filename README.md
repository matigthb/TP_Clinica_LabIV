# Bienvenido a mi Proyecto de Clínica para LaboratorioIV - UTN 🩺🥼

Así se ve la página que da la BIENVENIDA al usuario, que necesita loguearse para ingresar a las demás funcionalidades. 
![image](https://github.com/matigthb/TP_Clinica_LabIV/assets/98900532/c1c75b77-4c69-4e81-be87-fa2086caeaac)

Página de Log In para que el usuario ingrese sus datos e inicie sesión en la Clínica.
![image](https://github.com/matigthb/TP_Clinica_LabIV/assets/98900532/1ad12244-6352-4172-8d7d-eefca61951be)

Registro de usuarios, separado entre paciente o doctor mediante los dos botónes visuales.
![image](https://github.com/matigthb/TP_Clinica_LabIV/assets/98900532/f6a28ce6-eaec-4999-a1fa-dba1a0075c62)

Formulario para registrar un Especialista.
![image](https://github.com/matigthb/TP_Clinica_LabIV/assets/98900532/4480b622-50b6-47a3-bd64-2430ba6f4662)

Formulario para registrar un Paciente.
![image](https://github.com/matigthb/TP_Clinica_LabIV/assets/98900532/3714e696-04ec-49d7-8790-e424cfcd926c)

Pantalla de Mi Perfil, personalizada al Usuario con sus imágenes y funciones dependiendo de su rol.
![image](https://github.com/matigthb/TP_Clinica_LabIV/assets/98900532/4269d603-9873-4540-a754-4b68fe6221a4)

Pantalla de Mis Turnos, que visualiza los turnos del usuario.
Esta pantalla permite acciones por parte del Usuario como Cancelar un Turno si se trata de un Turno "Pendiente de Aprobación" o Ver Reseña, Responder una Encuesta o Calificar sobre un Turno Finalizado. (En el caso del Paciente)
Si se trata de un Especialista, esta pantalla le permitirá Rechazar o Aceptar un turno "Pendiente de Aprobación"
![image](https://github.com/matigthb/TP_Clinica_LabIV/assets/98900532/092f315d-2043-4bce-892d-b623823676b6)

Pantalla para solicitar un Turno, que progresivamente da más elecciónes al usuario para poder concretarlo.
![image](https://github.com/matigthb/TP_Clinica_LabIV/assets/98900532/2497321d-4417-451d-b746-186816d8f675)

Pantalla para el usuario administrador que permite visualizar todos los usuarios registrados.
Y dá la posibilidad de Habilitar o Rechazar a aquellos Especialistas que se encuentren "En Revisión".
Posibilita también ver la Historia Clínica de los Pacientes.
Implementa regiónes expandibles para verificar la existencia de estos usuarios.
![image](https://github.com/matigthb/TP_Clinica_LabIV/assets/98900532/2e610c86-2473-4d5d-9c8b-1e456d9d7407)

Pantalla de Turnos (Solo para Administradores) que visualiza todos los turnos registrados en la clínica.
![image](https://github.com/matigthb/TP_Clinica_LabIV/assets/98900532/6f4e4473-12ca-40c6-bf7d-a388748f66a8)

Página de Gráficos que presenta 5 opciones, todas descargables como PDF.
![image](https://github.com/matigthb/TP_Clinica_LabIV/assets/98900532/318ef462-8abf-496a-b149-b7b63c4ec006)

Pantalla de Pacientes que se le presenta a un Especialista.
Visualiza todos los pacientes que el Especialista ha atendido al menos 1 vez.
Posibilita ver la Historia Clínica de los Pacientes.
![image](https://github.com/matigthb/TP_Clinica_LabIV/assets/98900532/84498cce-9dcc-480c-bb82-3d637a48a262)


## Captcha

Se implementa el Captcha de Google en los 3 forms de registro, tanto de Paciente, como de Especialista y Admin. (Form de Registro de Especialista mostrado abajo).
![image](https://github.com/matigthb/TP_Clinica_LabIV/assets/98900532/766e21ea-fa91-4fe7-8ce1-1b2f04029cea)

## Directivas, Se implementan 3 directivas propias.

"appResaltar" En "Mi Perfil" para resaltar los datos del Usuario al mover el mouse sobre ellos.
![image](https://github.com/matigthb/TP_Clinica_LabIV/assets/98900532/f389a82d-2bb6-4e61-a57f-619f6b9146c4)

En "Registro" se implementan 2, una que solo permite input de Letras en campos como "Nombre" y "Apellido" (appSoloLetras). Y otra que solo permite input de Numeros como en "DNI" o "Edad" (appSoloNumeros)
![image](https://github.com/matigthb/TP_Clinica_LabIV/assets/98900532/206a1d49-149e-4cd8-a919-e541a9837190)

## Pipes, Se implementan 3 pipes propias.

"prefix" que se utiliza para designar un texto que debe ir por delante al valor que se le asigna.
![image](https://github.com/matigthb/TP_Clinica_LabIV/assets/98900532/52efb40a-7d9b-4ded-b661-99aed3893881)

"mayusculas" que transforma todo el texto a Mayúsculas.
![image](https://github.com/matigthb/TP_Clinica_LabIV/assets/98900532/5a574944-edab-476e-b051-2f66bba708ec)

"capitalizarPrimeraLetra" que pone en Mayúscula la primer letra de cada palabra del texto.
![image](https://github.com/matigthb/TP_Clinica_LabIV/assets/98900532/500b76d5-062b-417c-9983-5d88d6edba70)

## Animaciones

"Spinner" Utilizado en ciertos periodos de carga del sistema.
![image](https://github.com/matigthb/TP_Clinica_LabIV/assets/98900532/83194276-9980-4e93-8b1f-61191d329405)

Las páginas de Login, Registro y Home cuentan con animacion de SlideIn para cumplir con los requisitos mínimos del Sprint 3.







