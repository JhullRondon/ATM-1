/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//PROPIEDADES DEL CAJERO.
var cajero = [];
//LISTADO DE USUARIOS QUE HAN INICIADO SESIÓN.
var usuarios = [];
var entregados = [];
inicializarCajero();

//FUNCIÓN PARA INICIALIZAR EL CAJERO
function inicializarCajero(){
    cajero = {
        billetes: [],
        dinero: 0
    };
    //GENERAMOS CANTIDAD DE BILLETES ALEATORIA
    cajero.billetes.push(new Billete(100, Utilerias.aleatoria(0, 100)));
    cajero.billetes.push(new Billete(50, Utilerias.aleatoria(0, 100)));
    cajero.billetes.push(new Billete(20, Utilerias.aleatoria(0, 100)));
    cajero.billetes.push(new Billete(10, Utilerias.aleatoria(0, 100)));
    calcularValorCajero();
}

//FUNCIÓN PARA INICIAR SESIÓN
function iniciarSesion(){
    var nip = prompt("Introduce tu nip:");
    if (nip !== null) {
        //AGREGAMOS CANTIDAD DE DINERO ALEATORIA PARA EL USUARIO NUEVO
        var dinero = Utilerias.aleatoria(0, 5000);
        var usuarioActual;
        for (var usuario of usuarios){
            if (usuario.nip === nip) {
                usuario.activo = true; //ATRIBUTO PARA SABER QUÉ USUARIO ESTÁ ACTIVO ACTUALMENTE.
                usuarioActual = usuario;
                break;
            }
        }
        //SI EL USUARIO NO EXISTE, LO CREAMOS Y LO AGREGAMOS EN MEMORIA
        if (!usuarioActual) {
            var nombre = prompt("Oops! Al parecer todavía no sabemos quién eres. Introduce tu nombre");
            usuarioActual = new Usuario(nip, dinero, nombre);
            usuarios.push(usuarioActual);
            alert("Bienvenido " + usuarioActual.nombre);
        }
        //SI YA HA INICIADO SESIÓN ANTES, SOLAMENTE ENVIAMOS UNA ALERTA.
        else {
            alert("Bienvenido de nuevo " + usuarioActual.nombre);
        }
        cargarDatosUsuario(usuarioActual);
        
        //OCULTAMOS ALGUNOS BOTONES Y MOSTRAMOS OTROS.
        document.getElementById('botonInsertarTarjeta').style.display = "none";
        document.getElementById('divSesionIniciada').style.display = "initial";
    }
    else {
        alert("Por favor introduzca un nip para iniciar sesión.");
    }
}

//FUNCIÓN PARA CERRAR LA SESIÓN
function cerrarSesion(){
    for (var usuario of usuarios){
        if (usuario.activo) {
            usuario.activo = false;
            alert("Hasta pronto " + usuario.nombre);
        }
    }
    //OCULTAMOS Y/O MOSTRARMOS ALGUNOS BOTONES.
    document.getElementById('divSesionIniciada').style.display = "none";
    document.getElementById('botonInsertarTarjeta').style.display = "initial";
    var div_billetes = document.getElementById('div_billetes');
    div_billetes.innerHTML = "";
}

//FUNCION PARA RETIRAR DINERO
//ESTE ES EL ALGORITMO QUE DESARROLLO FREDDY
function retirar(){
    var cantidad = prompt("¿Cuánto deseas retirar?");
    var usuarioActual;
    //BUSCAMOS CUÁL ES EL USUARIO ACTUAL
    for (var usuario of usuarios) {
        if (usuario.activo) {
            var usuarioActual = usuario;
            break;
        }
    }
    if (cantidad > 0) {
        //VALIDAMOS QUE EL CAJERO TENGA EL DINERO QUE PIDES.
        if (cajero.dinero >= cantidad) {
            //VALIDAMOS QUE TU CUENTA TENGA EL DINERO SUFICIENTE PARA RETIRAR LO QUE PIDES.
            if (cantidad <= usuarioActual.dinero) {
                var cantidadEntregada = 0;
                var div_billetes = document.getElementById('div_billetes');
                div_billetes.innerHTML = "";
                for (var billete of cajero.billetes){
                    if (cantidad > 0) {
                        var division = Math.floor(cantidad/billete.valor);
                        var papeles;
                        if (division > billete.cantidad) {
                            papeles = billete.cantidad;
                        }
                        else {
                            papeles = division;
                        }
                        entregados.push(new Billete(billete.valor, papeles));
                        //ACTUALIZAMOS LOS BILLETES QUE QUEDA EN EL CAJERO.
                        cajero.billetes[cajero.billetes.indexOf(billete)].cantidad -= papeles;
                        //ACTUALIZAMOS LA CANTIDAD DE DINERO QUE QUEDA EN EL CAJERO.
                        cajero.dinero -= (billete.valor * papeles);
                        //GUARDAMOS CUÁNTO HEMOS ENTREGADO, ESTO LO USAMOS DESPUÉS.
                        cantidadEntregada += (billete.valor * papeles);
                        cantidad -= (billete.valor * papeles);
                        //ACTUALIZAMOS EL DINERO QUE TIENE EL USUARIO EN SU CUENTA.
                        usuarioActual.dinero -= (billete.valor * papeles);
                        //MOSTRAMOS LOS BILLETES
                        for (var i = 0; i < papeles; i++) {
                            div_billetes.innerHTML += "<img alt='billete' src='files/" + billete.valor + ".png' style='margin: 5px;' />";
                        }
                    }
                    else {
                        break;
                    }
                }
                if (cantidad > 0) {
                    //ESTO EN CASO DE QUE NO CONTEMOS CON BILLETES DE BAJA DENOMINACIÓN.
                    //ES DECIR SI PIDES $1999, PERO LA DENOMINACIÓN MÁS BAJA ES DE $10.00 - NO PODEMOS ENTREGAR $9.00
                    alert("Solo pudimos entregarte " + cantidadEntregada);
                }
                cargarDatosUsuario(usuarioActual);
            }
            else {
                alert("Wow wow wow!! No cuentas con tanto dinero en tu cuenta :O");
            }
        }
        else {
            alert("Lo siento, no cuento con el dinero suficiente :(");
        }
    }
    else {
        alert("Es necesario que indiques una cantidad mayor a 0.00");
    }
}

//FUNCIÓN PARA DEPOSITAR
function depositar(){
    //OBTENEMOS EL USUARIO ACTUAL
    var usuarioActual;
    for (var usuario of usuarios){
        if (usuario.activo){
            usuarioActual = usuario;
            break;
        }
    }
    
    //PREGUNTAMOS QUÉ BILLETES VAN A DEPOSITAR.
    var billetesNuevos = [];
    for (var billete of cajero.billetes){
        billetesNuevos.push({
            valor: billete.valor,
            cantidad: billete.cantidad
        });
        //OBTENEMOS LA CANTIDAD DE BILLETES QUE VAN A INSERTAR
        billetesNuevos[billetesNuevos.length - 1].cantidad = parseInt(prompt("¿Cuántos billetes de $" + billete.valor + " agregarás?"));
        //VALIDAMOS QUE LO INSERTADO EN EL PROMPT SEA UNA CANTIDAD VALIDA
        billetesNuevos[billetesNuevos.length - 1].cantidad = Utilerias.NaNInt(billetesNuevos[billetesNuevos.length - 1].cantidad);
        //ACTUALIZAMOS LA CANTIDAD DE BILLETES EN EL CAJERO
        billete.cantidad += billetesNuevos[billetesNuevos.length - 1].cantidad;
        //ACTUALIZAMOS EL BALANCE DEL USUARIO
        usuarioActual.dinero += (billetesNuevos[billetesNuevos.length - 1].cantidad * billete.valor);
    }
    cargarDatosUsuario(usuario);
    calcularValorCajero();
    var div_billetes = document.getElementById('div_billetes');
    div_billetes.innerHTML = "";
}

//FUNCION PARA CARGAR LOS DATOS DEL USUARIO
function cargarDatosUsuario(usuario){
    var datosUsuario = document.getElementById('labelDatosUsuario');
    datosUsuario.innerHTML = "Bienvenido " + usuario.nombre + "<br /> ";
    datosUsuario.innerHTML += "Dinero en la cuenta: $" + usuario.dinero + "<br />";
    datosUsuario.innerHTML += "¿Qué deseas hacer?";
}

//FUNCION PARA CALCULAR EL VALOR EN EL CAJERO
function calcularValorCajero(){
    cajero.dinero = 0;
    for (var billete of cajero.billetes){
        cajero.dinero += billete.valor * billete.cantidad;
    }
}