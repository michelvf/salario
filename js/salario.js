function fechaMes(){
    /* convierte la fecha ingresada por el usuario a fecha útil para JavaScript */

    // Tomar valor del formulario
    let mesEnvio = document.getElementById("datepicker").value;

    // Transformar la fecha para que sea reconocida por el módulo Date
    // let fechaMes = mesEnvio.replace('/', ',') + ',15';
    // let fechaMes =  '15,' +mesEnvio.replace('/', ',');
    let b = mesEnvio.split('/')
    let fechaMes = b[1] + ',' + b[0] + ',15';

    // Convertir la fecha en un dato Date
    let fecha = new Date(fechaMes);

    //console.log("fecha para el cálculo " + fecha);

    // Devolver la fecha
    return fecha;
}
function dias_laborables(){
    /* Calcula los días laborables del mes ingresado por el usuario */

    let fecha = fechaMes();

    let primerDia = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
    let ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);
    const intervalo = 1000 * 60 * 60 *24;
    let paraCiclo = ultimoDia.getDate();

    //console.log("Primer día del mes: " + primerDia + ", último día del mes: " + ultimoDia + ", Valor a usar: " + paraCiclo);

    //let ciclo = new Date(primerDia.getDate());
    let ciclo = primerDia;

    let dias = 0;
    let finSemana = 0;
    //for(i = 1; i < paraCiclo; i++) {
    for (let i = primerDia; i <= ultimoDia; i = new Date(i.getTime() + intervalo)) {
        if( (i.getDay() == 0) || (i.getDay() == 6) ) {
            finSemana++ }
        else {
            dias++;
        }
        //console.log('valor de i: ' + i + ', valor de dia: ' + dias + ', dia de la semana: ' + i.getDay());
        //ciclo.setDate(primerDia.getDate() + i);
    }

    let diasLaborables = Number(dias) + Number(sabados_laborables());

    console.log('dias laborables: ' + diasLaborables + ', sábados laborables: ' + sabados_laborables() );

    // Quitar dia feriado
    fecha = fechaMes();
    diasFeriadoss = 0;

    for (z = 0; z < diasFeriados.length; z++) {
        fechaAno = fecha.getFullYear() + "," + diasFeriados[z][0].replace('-', ',');
        fechaCompleta = new Date(fechaAno);
        fechaMesUsuario = fecha.getMonth() + 1;
        fechaMesFichero = fechaCompleta.getMonth() + 1;

        console.log('fechaAño: ' + fechaAno + ', fechaCompleta:' + fechaCompleta + ', fechaMesUsuario: ' + fechaMesUsuario + ', fechaMesFichero: ' + fechaMesFichero);

        if (fechaMesFichero == fechaMesUsuario) {
            if ( (fechaCompleta.getDay() == 0) || (fechaCompleta.getDay() == 6) ) {
                diasFeriadoss = diasFeriadoss + 1;

            }
        }

    }

    console.log("Dias Feriados: " + diasFeriadoss);
    //diaCalculado = diasLaborables - diasFeriadoss;

    //return diaCalculado;
    return diasLaborables;
}

function calcularSalario(){

    // valores fijos
    var grupoX = 3260;
    var grupo32 = 9510;
    var profesional = 685;

    // valores del html
    var salario = Number(document.getElementById("salario").value);
    //var mesEnvio = document.getElementById("datepicker").value;
    var plus = document.getElementsByName('plus');
    var pro = document.getElementById("pro");
    var pcc = document.getElementById("pcc");
    var sind = document.getElementById("sindicato");

    var salarioEscala = salario;
    var salarioVirtual = Number(salario) / 190.6;
    var diasDelMes = dias_laborables();
    var salario = salarioVirtual * 8 * diasDelMes;

    // Cálculo
    if(plus){
        for(i=0; i<plus.length; i++){
            if(plus[i].checked){
                var pluss = Number(plus[i].value);
                var salario = salario + pluss;
            }
        }
    }

    if (pro.checked) {
        var salario = salario + profesional;
    }

    let fecha = fechaMes();
    let nombre_mes = nombreDelMes(fecha.getMonth());
    let anno = fecha.getFullYear();

    var fila = "<tbody>";

    var fila = fila.concat("<tr class='text-primary'><td>Salario Escala</td><td>$ " + moneda(salarioEscala) + "</td></tr>");
    var fila = fila.concat("<tr class='text-primary'><td>Dias laborables que trae el mes de " + nombre_mes + " del año " + anno + "</td><td>" + diasDelMes + "</td></tr>");
    var fila = fila.concat("<tr class='text-primary'><td>Salario por días laborables que trae el mes</td><td>$ "+ moneda(salario) + "</td></tr>");

     // Calculo del 5%
     var SegSoc = salario * 0.05;

     fila = fila.concat("<tr class='text-danger'><td>5% Seguridad Social</td><td>$ -"+moneda(SegSoc)+"</td></tr>");

     // Cálculo del 3%
     if(salario >= grupo32) {
        var ImpIng = ((grupo32 - grupoX) * 0.03) + ((salario - grupo32) * 0.05);
        fila = fila.concat("<tr class='text-danger'><td>3% Impuesto por Ingresos Personales</td><td>$ -"+moneda(ImpIng)+"</td></tr>");
        let totalImpuestos = SegSoc + ImpIng;
        let porcientoSalario = ((totalImpuestos / salario) * 100 ).toFixed(1)
        var fila = fila.concat("<tr class='text-danger fw-bold'><td class='text-end'>Subtotal de todos los impuestos</td><td><span class='border-bottom border-danger'>$ -"+moneda(totalImpuestos)+"</span> (el " + porcientoSalario + " % del salario)</td></tr>");

    } else if (salario > grupoX) {
        var ImpIng = (salario - grupoX) * 0.03;
        var fila = fila.concat("<tr class='text-danger'><td>3% Impuesto por Ingresos Personales</td><td>$ -"+moneda(ImpIng)+"</td></tr>");
        var totalImpuestos = SegSoc + ImpIng;
        var porcientoSalario = ((totalImpuestos / salario) * 100 ).toFixed(1)
        var fila = fila.concat("<tr class='text-danger fw-bold'><td class='text-end'>Subtotal de todos los impuestos</td><td><span class='border-bottom border-danger'>$ -"+moneda(totalImpuestos)+"</span> (el " + porcientoSalario + " % del salario) </td></tr>");
    } else {
        var ImpIng = 0;
        var fila = fila.concat("<tr class='text-secondary'><td>Salario menor que $ 3.260, no paga Impuestos por Ingresos Personales</td><td>$ 0.00</td></tr>");
        var totalImpuestos = SegSoc + ImpIng;
        var porcientoSalario = ((totalImpuestos / salario) * 100 ).toFixed(1)
        var fila = fila.concat("<tr class='text-danger fw-bold'><td class='text-end'>Subtotal de todos los impuestos</td><td class='text-end'><span class='border-bottom border-danger'>$ -"+moneda(totalImpuestos)+"</span> (el " + porcientoSalario + " % del salario) </td></tr>");
    }

    var aCobrar = salario - SegSoc - ImpIng;
    var salario = aCobrar;

    // Calculo del PCC
    if (pcc.checked) {
        var pcc = salario * 0.02;
        fila = fila.concat("<tr class='text-secondary'><td>Pago mensual del PCC: $" + moneda(pcc) + ",&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;en el año:</td><td>$ "+moneda(pcc*12)+"</td></tr>");
    }

    // Calculo del Sindicato
    if (sind.checked) {
        if (salario >= 2100) {
            for (i = 0; i < sindicatos.length; i++) {
                if (salario >= sindicatos[i][1] && salario <= sindicatos[i][2]) {
                    var sindicato = Number(sindicatos[i][3]);
                }
            }
            var fila = fila.concat("<tr class='text-secondary'><td>Pago Sindicato mensual: $"+ moneda(sindicato/12) +",&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;en el año:</td><td>$ "+moneda(sindicato)+"</td></tr>");
        } else {
            var fila = fila.concat("<tr class='text-secondary'><td>Salario menor que $2100, no sabemos cuanto paga, favor dirigirse a su secretario(a) de sindicato</td><td></td></tr>");
        }
    }

    var fila = fila.concat("<tr class='text-success fs-5 fw-bold'><td>A Cobrar:</td><td><span class='border-bottom border-success border-2'>$ "+moneda(aCobrar)+"</span></td></tr>");
    let salarioDia = aCobrar / diasDelMes;
    let salarioHora = salarioDia / 8;
    var fila = fila.concat("<tr class='text-primary'><td>Usted gana en un día:</td><td>$ " + moneda(salarioDia) + "</td></tr>");
    var fila = fila.concat("<tr class='text-primary'><td>Usted gana en 1 hora:</td><td>$ " + moneda(salarioHora) + "</td></tr>");
    let platano = 50 / salarioHora;
    var fila = fila.concat("<tr class='text-primary'><td>Si una mano de plátano vale $50 CUP, usted debe trabajar:</td><td>$ " + decimalAHora(platano) + " </td></tr>");
    var fila = fila.concat("</tbody>");
    document.getElementById("resultado").innerHTML = fila;

}

function calcularElectricidad(){

    // tomando el valor escrito por el usuario
    var consumo = Number(document.getElementById("electricidad").value);

    // Inicializo 2 variables para realizar el cálculo
    var a_pagar = 0;
    var rango = 0;
    var fila = "<thead class='table-light'><tr><th scope='col'>Rangos</th><th scope='col'>Consumo</th><th scope='col'>Tarifa</th><th scope='col'>Precio</th><th scope='col'>subtotal a pagar</th></tr></thead><tbody>";

    for (i = 0; i < tarifas.length; i++ ) {

        if (i == 0) {
            rango1 = 0;
        }

        if (i == 17) {
            var rango_chico = 999999999 - rango1
        } else {
            var rango_chico = Number(tarifas[i][1]) - rango1
        }

        if (rango1 == 0) {
            var rango_inicio = 0;
        } else {
            var rango_inicio = Number(rango1) + 1;
        }

        if (consumo <= rango_chico) {

            // El cálculo de lo que se paga en este rango.
            var pago_parcial = tarifas[i][0] * consumo;

            // El cálculo del pago total.
            var a_pagar = a_pagar + pago_parcial;

            // Se imprime este cálculo.
            var rango_muestra = rango_inicio + " - " + tarifas[i][1];
            //fila = fila.concat("<tr class=''><td>" + rango_inicio + "</td><td>$ "+rangos[i]+"</td></tr>");

            if (i == 17){
               var fila = fila.concat("<tr class=''><td>+ de 5000</td><td>"+consumo+"</td><td>"+tarifas[i][0]+"</td><td>$ "+moneda(pago_parcial)+"</td></tr>");
            } else {
               var fila = fila.concat("<tr class=''><td>"+rango_muestra+"</td><td>"+consumo+"</td><td>"+tarifas[i][0]+"</td><td>$ "+moneda(pago_parcial)+"</td></tr>");
            }

            // Se usa este: break, para detener el ciclo: for, y se sale de él.
            break;
        }

        var consumo = consumo - rango_chico;

        // Se hace el cálculo de este rango.
        var pago_parcial = rango_chico * tarifas[i][0];

        // Se va acumlando lo que se va a pagar
        var a_pagar = a_pagar + pago_parcial;

        // Se imprimen lo que se va calculando
        var rango_muestra = rango_inicio + " - " + tarifas[i][1];

        if (i == 17){
            var rango_muestra = rango_inicio + " - " + rango1;
            var fila = fila.concat("<tr class=''><td>+ de 5000</td><td>"+rango_chico+"</td><td>"+tarifas[i][0]+"</td><td>$ "+moneda(pago_parcial)+"</td></tr>");
        } else {
            var fila = fila.concat("<tr class=''><td>"+rango_muestra+"</td><td>"+rango_chico+"</td><td>"+tarifas[i][0]+"</td><td>$ "+moneda(pago_parcial)+"</td><td>$ "+ moneda(a_pagar)+"</td></tr>");
        }

        // Se toma el rango ahora para compararlo cuando inicie el ciclo otra vez
        var rango1 = tarifas[i][1];
    }

    var fila = fila.concat("<tr class='text-danger fs-5 fw-bold'><td></td><td></td><td>Total a pagar: </td><td><span class='border-bottom border-danger border-2'>$ " + moneda(a_pagar) + "</span></td></tr>");
    var fila = fila.concat("</tbody>");

    document.getElementById("resultado").innerHTML = fila;
}

function moneda(dinero) {
    return new Intl.NumberFormat("ca", {style: "currency", currency: "CUP", currencyDisplay: "symbol"}).format(dinero);
}

function escalaSalario(){

    var fila = "<colgroup span='3'><colgroup span='2'><thead class='table-light'><tr><td colspan='3'>Anterior<br /><a href='https://www.gacetaoficial.gob.cu/sites/default/files/goc-2020-ex69.pdf'>Resolución 29/2020 MTSS</a></td><td colspan='2'>Nuevo<br /><a href='https://www.gacetaoficial.gob.cu/sites/default/files/goc-2021-ex80.pdf'>Decreto 53/2021</a></td></tr><tr><th>Grupo</th><th>Escala 44h</th><th>Escala 40h</th><th>Grupo de Complejidad</th><th>Salario Escala según régimen de trabajo y descanso</th></tr></thead><tbody>";

    for ( i=0; i < escalasSalariales.length; i++){
        var fila = fila.concat("<tr><td class='align-middle'>" + escalasSalariales[i][0] + "</td><td>" + escalasSalariales[i][1] + "</td><td>" + escalasSalariales[i][2] + "</td><td>" + (escalasSalariales[i][3] ? escalasSalariales[i][3] : '') + "</td><td>" + (escalasSalariales[i][4] ? escalasSalariales[i][4] : '') + "</td></tr>");

    }

    var fila = fila.concat("</tbody>");
    document.getElementById("salarioEscalaTabla").innerHTML = fila;
}

function sabados_laborables() {

    var fechaHoy = fechaMes();

    var mes = fechaHoy.getMonth() + 1;
    var anno = fechaHoy.getYear() + 1900;
    for (i = 0; i < sabados.length; i++){
        if (sabados[i][1] == mes && sabados[i][0] == anno) {
            var diasLaborables = sabados[i][2];
            break;
        } else {
            var diasLaborables = 2;
        }
    };

    return diasLaborables;
}

function nombreDelMes(mes){
    let nombres = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    return nombres[mes];
}

function limpiar(){
    let fila = "";
    document.getElementById("resultado").innerHTML = fila;

}

function decimalAHora(decimal) {
  let horas = Math.floor(decimal), // Obtenemos la parte entera
    restoHoras = Math.floor(decimal % 1 * 100), // Obtenemos la parde decimal
    decimalMinutos = restoHoras * 60 / 100, // Obtenemos los minutos expresado en decimal

    minutos = Math.floor(decimalMinutos), // Obtenemos la parte entera
    restoMins = Math.floor(decimalMinutos % 1 * 100), // Obtenemos la parde decimal
    segundos = Math.floor(restoMins * 60 / 100); // Obtenemos los segundos expresado en entero

  return `${('00'+horas).slice(-2)} hora(s), ${('00'+minutos).slice(-2)} minuto(s), y ${('00'+segundos).slice(-2)} segundo(s)`;
}

// Asignar valor al input de la fecha actual
var d = new Date();
var mes =  ("0" + (d.getMonth() + 1));
var anio = d.getFullYear();
var fechatotal = mes + "/" + anio
$("#datepicker").val(fechatotal);

function tarifasElectricidad() {
    const url = './js/tarifas-electricidad.json';
    fetch(url)
     .then( respuesta => respuesta.json() )
     .then( resultado => mostrarListado(resultado) )
}

function mostrarListado(listado){
    let html = '<thead><tr><th>Escala</th><th>Precio</th><th>Pago máximo</th></tr></thead><tbody>';
    ini = 0;
    listado.forEach(lista => {
        const { tarifa, consumo } = lista;

        tarifas = moneda(tarifa);
        precio = moneda(tarifa * consumo);
        valores = ini + " - " + consumo;
        if (consumo == 'infinito') {            
            html += `<tr><td>${valores}</td><td> $ ${tarifas}</td><td> ¡¡ Aguántate !! </td></tr>`;
        } else {     
            html += `<tr><td>${valores}</td><td> $ ${tarifas}</td><td> $ ${precio}</td></tr>`;
            ini = consumo + 1;
        }
        
    });
    html +=  '</tbody>';
    document.getElementById("tarifasElectricidadTabla").innerHTML = html;
}
