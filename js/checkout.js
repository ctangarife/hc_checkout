jQuery(document).ready(function($){
	//console.log('Carrito');

//Se muestra modal del regalo
if(jQuery('.showGif').length>0){
	var m = '<h3>Hemos agregado un producto de regalo</h3><img src="http://www.clubponds.com/sites/default/files/producto/FlawlessWhite_Serumespanol.jpg"><p>Completa la compra para poder disfrutar de tu regalo.</p>';
	jQuery('#descripcion-modalmensaje').html(m);
	jQuery('#modalTitle').text("Hemos agregado un producto de regalo");
	jQuery('#modalMensajes').modal('show');

}
//Se agrega el cupón
jQuery('.addcouponcustom').click(function(r){
	//console.log('Hola le di click');
	dataLayer.push({'Boton_agregar_cupon': 'agregar', 'event': 'Clic-agregar-cupon'});
	r.preventDefault();
	var coupon=jQuery('#cuponUser').val();
	if(coupon!=''){
		console.log(coupon);
		jQuery.ajax({
		type: "POST",
		url: "/cart/checkout/addCoupon",
		data:{
		  consul:coupon,
		  vartC: 'addcp' 
		},

			success: function(data){
			  console.log(data);
			  if(data.title!='Desconocido'){
			  	jQuery('.titleCoupon').text(data.title);
			  	jQuery('#cuponUser').hide();
			  	if(data.descuento!=0){
				  	jQuery('.titleCupon').parent().removeClass('hidden');
				  	jQuery('.titleCupon').text(data.title);
				  	jQuery('.addcouponcustom').addClass('hidden');
				  	jQuery('.cuponAddd').removeClass('hidden');
				  	jQuery('.table-cupon').removeClass('hidden');
				  	jQuery('.descuentoCupon').text(data.descuento);
				  	jQuery('.totalRecurrenceM').text(data.totalDescuento);
				  	jQuery('.pintaCupon').html('<tr><td class="titleCupon">'+data.title+'</td><td><button type="button" class="btn-recurrence-tres removeCupon" data-line="'+data.line_item+'">ELIMINAR</button></td></tr>');
			  	}
			  }else{
			  	jQuery('#cuponUser').css('border', '1px solid red');
			  }
			  jQuery('.help-block').text('');
			  jQuery('.help-block').html(data.mensaje);
			}
		});
	}
});

//Se remueve el cupón
jQuery(document).on('click','.removeCupon',function(e){
	//console.log('Hola le di click');
	e.preventDefault();
	var coupon=jQuery(this).attr('data-line');
	if(coupon!=''){
		console.log(coupon);
		jQuery.ajax({
		type: "POST",
		url: "/cart/recurrence/removeCupon",
		data:{
		  consul:coupon,
		  vartC: 'rmcp' 
		},

			success: function(data){
				if(data!=0){
					jQuery('.titleCupon').parent().addClass('hidden');
				  	jQuery('.cuponAddd').addClass('hidden');
				  	jQuery('.table-cupon').addClass('hidden');
				  	jQuery('.descuentoCupon').text('');
				  	jQuery('.descuentoCupon').text(data.descuento);
				  	jQuery('.totalRecurrenceM').text(data);
				  	jQuery('.addcouponcustom').removeClass('hidden');
				  	jQuery('#cuponUser').show();
				  	jQuery('.help-block').text('');
				  	jQuery('.help-block').html('El cupón fue removido');
				}
			}
		});
	}
});


//Función para traer las direcciones
jQuery('#addressR').change(function(e){
	//console.log('Hola le di click');
	e.preventDefault();
	var idAdd=jQuery('#addressR').val();
	if(idAdd!=''){
		console.log(idAdd);
		jQuery.ajax({
		type: "POST",
		url: "/cart/checkout/getAddress",
		data:{
		  consul:idAdd,
		  vartC: 'addr' 
		},
		success: function(data){
			//console.log(data);
			//setTimeout(function(){
				jQuery.each(data,function( index, value ){
					console.log(value.delivery_first_name);
					//console.log(jQuery('#nombreEntrega').val());
					jQuery('#nombreEntrega').val(value.delivery_first_name);
					jQuery('#apellidoEntrega').val(value.delivery_last_name);
					jQuery('#direccionEntrega').val(value.delivery_street1);
					jQuery('#telefonoEntrega').val(value.delivery_phone);
					jQuery('#nombreFacturacion').val(value.billing_first_name);
					jQuery('#apellidoFacturacion').val(value.billing_last_name);
					jQuery('#direccionFacturacion').val(value.billing_street1);
					jQuery('#telefonoFacturacion').val(value.billing_phone);
				});
			//},2000);
		}
	});
	}
});
//Se activan la tarjeta registrada
jQuery('.tarjetaR').click(function(l){
	l.preventDefault();
	var tActive=jQuery(this).attr('data-reference');
	var cuotasCu=jQuery('#cuotasAu'+tActive);
	jQuery('#reference-ccu').val('12');
	jQuery('.coutasd').val('');
	jQuery('#reference-c').val(tActive);
	jQuery('.datoshabiente').addClass('hidden');
	jQuery('.datoshabiente').remove();
	var cuotas=12;
	jQuery(document).on('keyup',cuotasCu,function(){
		if(jQuery('#cuotasAu'+tActive).val()>36){
			jQuery('#cuotasAu'+tActive).val('');
		}else{
			cuotas=jQuery('#cuotasAu'+tActive).val();
			jQuery('#reference-ccu').val(cuotas);
		}
	});
});

//Pasar datos si está deschekeado mi direccion de facturación es la misma
jQuery('#copyfacturacion').change(function(){
  if(jQuery(this).prop("checked")) {
    jQuery('.facturacionForm').addClass('hidden');
  } else {
    jQuery('.facturacionForm').removeClass('hidden');
  }
});


//Validación del formulario
jQuery('.comprar-checkout').click(function(r){
    jQuery('.comprar-checkout').hide();
    jQuery('.text-wait').removeClass('hidden');
	var form = jQuery('#checkoutForm');
    var text = jQuery(form).find('input[type=text]');
    var numberT = jQuery(form).find('input[type=number]');
    var selects = jQuery(form).find('select');
    var error = [];
    var msn = '';
    for (var i = 0; i < text.length; i++) {

        var t = jQuery(text[i]).val().trim();
        var nt = jQuery(numberT[i]).val();
        if(nt==''){
        	jQuery(numberT[i]).css('border', '1px solid red');
        }
        if (t == '') {
            if (jQuery(text[i]).attr('name') != 'cuponUser' && jQuery(text[i]).attr('name') != 'cedulaFc') {
                jQuery(text[i]).css('border', '1px solid red');
                error.push(jQuery(text[i]));
                var exist =existMesaje(msn,'todos los campos resaltados son necesarios');
                if(exist==false){
                    msn+='Recuerda que todos los campos resaltados son necesarios *';
                }
            }
        } else {
            if (jQuery(text[i]).attr('name') == 'apellidoEntrega' ||
                //jQuery(text[i]).attr('name') == 'panes[delivery][delivery_city]' ||
                jQuery(text[i]).attr('name') == 'nombreEntrega'

                ||
                jQuery(text[i]).attr('name') == 'nombreFacturacion' ||
                jQuery(text[i]).attr('name') == 'apellidoFacturacion') {
                var r = validaCadena(jQuery(text[i]).val(), 'cadena');
                if (r) {
                    jQuery(text[i]).css('border', '1px solid #fff');
                } else {
                    jQuery(text[i]).css('border', '1px solid red');
                    error.push(jQuery(text[i]));
                    switch (jQuery(text[i]).attr('name')) {
                    case 'apellidoEntrega':
                    case 'apellidoFacturacion':
                        msn += 'Valida la información ingresada en el campo apellido *';
                        break;

                    case 'nombreEntrega':
                    case 'nombreFacturacion':
                        msn += 'Valida la información ingresada en el campo nombre *';
                        break;
                }
                }
            }
            if (jQuery(text[i]).attr('name') == 'direccionEntrega' || jQuery(text[i]).attr('name') == 'direccionFacturacion') {
                jQuery(text[i]).css('border', '1px solid #fff');
            }
            if (jQuery(text[i]).attr('name') == 'telefonoEntrega' ||
                jQuery(text[i]).attr('name') == 'telefonoFacturacion') {
                var r = validaCadena(jQuery(text[i]).val(), 'numero');
                if(jQuery(text[i]).val() != ''){
                    if (r) {
                        jQuery(text[i]).css('border', '1px solid #fff');
                    } else {
                        jQuery(text[i]).css('border', '1px solid red');
                        error.push(jQuery(text[i]));
                         msn += 'Valida la información en el campo teléfono *';
                    }
                }
            }
            if (jQuery(text[i]).attr('name') == 'cedulahabiente') {
                var r = validaCadena(jQuery(text[i]).val(), 'numero');
                if(jQuery(text[i]).val() != ''){
                    if (r) {
                        jQuery(text[i]).css('border', '1px solid #fff');
                    } else {
                        jQuery(text[i]).css('border', '1px solid red');
                        error.push(jQuery(text[i]));
                         msn += 'Valida la información en el campo cédula tarjetahabiente *';
                    }
                }
            }
        }

    }
    if (msn != '') {
        showmodalR(msn);
        jQuery('.comprar-checkout').show();
        jQuery('.text-wait').addClass('hidden');
    }

        if (error.length == 0) {
        //google event
        jQuery('#checkoutForm').submit();
    }
        //jQuery(form).submit();

});
function showmodalR(msn) {
    var split = msn.split('*');
    var m = '<ul>';
    for (var i = 0; i < split.length; i++) {
        m += '<li>' + split[i] + '</li>';
        if ((split.length - 1) == 1) {
            m += '</ul>';
        }
    }
    if (m.indexOf('<li></li>') !== -1) {
        var res = m.replace("<li></li>", "");
        m = res;
    }
    if(msn.indexOf('han enviado')!= -1){
        jQuery('h3#modalTitle').text('Para finalizar el proceso');
        //console.log('desde restore password');
    }else{
        jQuery('#modalTitle').text('Valida la siguiente información');
        //console.log('no  desde restore password');

    }
    jQuery('#descripcion-modalmensaje').html(m);
    jQuery('#modalMensajes').modal('show');

}

jQuery('.cancel-recurrence').click(function(e){
	dataLayer.push({'Boton_cancelar_compra': 'cancelar', 'event': 'Cancelar-compra'});
	window.location="/cart";
});
//Fin validación

jQuery('#nombreEntrega').blur(function(){
	jQuery('#nombreFacturacion').val(jQuery('#nombreEntrega').val());
});
jQuery('#apellidoEntrega').blur(function(){
	jQuery('#apellidoFacturacion').val(jQuery('#apellidoEntrega').val());
});
jQuery('#direccionEntrega').blur(function(){
	jQuery('#direccionFacturacion').val(jQuery('#direccionEntrega').val());
});
jQuery('#telefonoEntrega').blur(function(){
	jQuery('#telefonoFacturacion').val(jQuery('#telefonoEntrega').val());
});
/*if(window.location.href.indexOf('recurrence') > -1){
	setTimeout(function(){
		console.log('Se recarga'); 
		jQuery("#subtotalPrice").load(location.href+ ' #subtotalPrice',"");
		jQuery("#subtotalPrice2").load(location.href+ ' #subtotalPrice2',"");
	}, 500);
	
}*/
if(window.location.href.indexOf('checkoutf') > -1){
	setTimeout(function(){
		jQuery('#uc-cart-checkout-review-form').addClass('hidden');
		jQuery('#uc-cart-checkout-review-form').submit();
		
	}, 100);
	
}

//Marcación analytics commerce
//console.log('Estamos en el review');
var products=[];
var orderU;

setTimeout(function(){
    //traer la orden actual
     jQuery.ajax({
        url:'/ponds/getOrderbySession',
        dataType:'json',
        type:'POST',
        data:{
          vartC:'getOr'
        },
        success:function(data){
            orderU=data;
        }
      });
},3000);

var envio,taxesd,cuponU,totalR;

if(jQuery('.envioC').text()!=''){
    envio= jQuery('.envioC').text();
    envio = envio.replace("$", "");
    envio = envio.replace(",", "");
}
if(jQuery('.totalRecurrenceM').text()==''){
   totalR=jQuery('.totalRecurrenceM').text();
   totalR = totalR.replace("$", "");
   totalR = totalR.replace(",", "");
}
if(jQuery('.iva').text()!=''){
   taxesd= jQuery('.iva').text();
   taxesd = taxesd.replace("$", "");
   taxesd = taxesd.replace(",", "");
}
if(jQuery('.descuentoCupon').text() != ''){
   cuponU=jQuery('.descuentoCupon').text();
   cuponU = cuponU.replace("$", "");
   cuponU = cuponU.replace(",", "");
}else{
    cuponU=0;
}


var qtyReview,productosReview,priceReview,res,productosReview={};
jQuery('.table-striped').find('tbody > tr').each(function(e,value){
if(jQuery(this).find('td').hasClass('qtyCh')){
    qtyReview=jQuery(this).find('td.qtyCh').text();
    //console.log(qtyReview);
    res = qtyReview.split(" ");
}
if(jQuery(this).find('td').hasClass('productsCh')){
    productosReview=jQuery(this).find('td.productsCh').text();
}
if(jQuery(this).find('td').hasClass('priceCh')){
    priceReview=jQuery(this).find('td.priceCh').text();
    priceReview = priceReview.replace("$", "");
    priceReview = priceReview.replace(",", "");
}
productosReview={'name':productosReview,'brand': 'clubponds','price':priceReview,'quantity':res[0],'variant': ''};

products.push(productosReview);
});

setTimeout(function(){
     dataLayer.push({
    'ecommerce': {
        'purchase': {
            'actionField': {
            'id': orderU,
            'affiliation': 'clubponds.com',
            'revenue': totalR,
            'tax':taxesd,
            'shipping': envio,
            'coupon': cuponU,
            'products': products

                },
            }
        }
    });
 },8000);

//Se agrega la cédula para la copia de factura
jQuery('#checkCedula').change(function(){
    jQuery('.cedulaFactura').toggleClass('hidden');
});
   
//No pasar de acá
});


function setCookie(cname, cvalue, exdays) {
   var d = new Date();
   d.setTime(d.getTime() + (exdays*24*60*60*1000));
   var expires = "expires="+ d.toUTCString();
   document.cookie = cname + "=" + btoa(cvalue) + ";" + expires + ";path=/";
}

function getCookie(cname) {
   var name = cname + "=";
   var decodedCookie = decodeURIComponent(document.cookie);
   var ca = decodedCookie.split(';');
   for(var i = 0; i <ca.length; i++) {
       var c = ca[i];
       while (c.charAt(0) == ' ') {
           c = c.substring(1);
       }
       if (c.indexOf(name) == 0) {
           return atob(c.substring(name.length, c.length));
       }
   }
   return "";
}


//funcion para prevenir el ingreso de números
function check(e,value){
//Check Charater
	var unicode=e.charCode? e.charCode : e.keyCode;
	if (value.indexOf(".") != -1)if( unicode == 46 )return false;
	if (unicode!=8)if((unicode<48||unicode>57)&&unicode!=46)return false;
}

function checkLength(len,ele){
	var fieldLength = ele.value.length;
	if(fieldLength <= len){
	    return true;
	}
	else{
		var str = ele.value;
		str = str.substring(0, str.length - 1);
		ele.value = str;
	}
}

//Valida si el mensaje ya exise
function existMesaje(msn,text){
    if (msn.length == 0) {
       
        return false;
    }else{
        if (msn.indexOf(text) != -1) {

            return true;
        }else{

            return false;
        }
    }
}

function validaCadena(ca, control) {
    var cadena = ca;
    ////console.log(cadena,' :cadena  ',control,' control');
    switch (control) {
        case 'cadena':
            ////console.log('entra a la segcion cadena del switch');
            var letters = /^[A-Za-záéíóúÁÉÍÓÚñÑ ]+$/;
            if (cadena.match(letters)) {
                return true;
            } else {
                return false;
            }
            break;

        case 'mail':
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(ca);
            break;
        case 'numero':
            var re = /^([0-9])*$/;
            return re.test(ca);
            break;

    }
}
