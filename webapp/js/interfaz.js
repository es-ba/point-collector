var Interfaz = {};
Interfaz.addHistory=function(positionObject){
    $('#history').prepend(
                           'fecha-relevamiento: ' + positionObject.fecha_relevamiento + 
                           ' | sector: ' + positionObject.sector +
                           ' | manzana: ' + positionObject.manzana +
                           ' | lado: ' + positionObject.lado +
                           ' | secuencia: ' + positionObject.secuencia +
                           ' | puerta: ' + positionObject.puerta +
                           ' | nivel: ' + positionObject.nivel + 
                           ' | observaciones: ' + positionObject.observaciones + 
                           ' | puntos: ' + JSON.stringify(positionObject.puntos) + 
                           '\n' + '\n'
                          );
}
Interfaz.setAppData=function(){
    Relevador.token = token;
    $('#version').text(Relevador.version);
    var token = LocalStorage.get('token');
    if($.isEmptyObject(token)){
        $('#logout').addClass('hidden');
        $('#login').removeClass('hidden');
        $('#tarea').text('');
        $('#usuario').text('');
    }else{
        $('#usuario').text(token.usuario);
        $('#tarea').text(token.tarea);
        $('#logout').removeClass('hidden');
        $('#login').addClass('hidden');
    }
}
Interfaz.loadReadings=function(){
    var self = this;
    $.each(LocalStorage.get('readings'), function(key, val) {
        $.each(val, function(key, positionObject) {
            self.addHistory(positionObject);
        });
    });
}
Interfaz.showPosition=function(position, latitudeId, longitudeId, datetimeId, secuencia) {
    if($("#secuencia").val() == secuencia){
        $(latitudeId).val(position.coords.latitude);
        $(longitudeId).val(position.coords.longitude);
        $(datetimeId).val(calcDatetime());
    }
}
Interfaz.resetForm=function(){
    $("#obtener-posicion").prop("disabled",true);
    $('#secuencia').val("");
    $('#puerta').val("");
    $('input[name="nivel"]').prop('checked', false);
    $('#observaciones').val("");
    $('#pto-1-lat').val("");
    $('#pto-1-long').val("");
    $('#pto-1-datetime').val("");
    $('#pto-2-lat').val("");
    $('#pto-2-long').val("");
    $('#pto-2-datetime').val("");
    $('#lado').change();
    $("#point-1").removeClass("error");
    $("#point-2").removeClass("error");
    this.enableDisableNavigationButtons();
}
Interfaz.loadForm=function(positionObject){
    $('#sector').val(positionObject.sector);
    $('#manzana').val(positionObject.manzana);
    $('#lado').val(positionObject.lado);
    $('#secuencia').val(positionObject.secuencia);
    $('#puerta').val(positionObject.puerta);
    $("input[name=nivel][value=" + positionObject.nivel + "]").prop('checked', true);
    $('#observaciones').val(positionObject.observaciones);
    $("#obtener-posicion").prop("disabled",true);
    var puntos = positionObject.puntos;
    if(puntos[0].latitud == 0 && puntos[0].latitud == 0){
        $("#point-1").addClass("error");
    }
    if(puntos[1].latitud == 0 && puntos[1].latitud == 0){
        $("#point-2").addClass("error");
    }
    $('#pto-1-lat').val(puntos[0].latitud);
    $('#pto-1-long').val(puntos[0].longitud);
    $('#pto-1-datetime').val(puntos[0].datetime);
    $('#pto-2-lat').val(puntos[1].latitud);
    $('#pto-2-long').val(puntos[1].longitud);
    $('#pto-2-datetime').val(puntos[1].datetime);
    this.enableDisableNavigationButtons();
}
Interfaz.enableDisableNavigationButtons=function(){
    var secuencia = $('#secuencia').val();
    var lado = $('#lado').val();
    
    if((parseInt(lado.replace(/\D/g, '') || 1) * 1000 + 1) == parseInt(secuencia)){
        $("#anterior").prop("disabled",true);
    }else{
        $("#anterior").prop("disabled",false);
    }
    $("#siguiente").prop("disabled",false);
}
Interfaz.setModoLadoView=function(){
    $("#modo-lado").hide();
    $("#sector").prop("disabled",false);
    $("#manzana").prop("disabled",false);
    $("#lado").prop("disabled",false);
    $("#secuencia").prop("disabled",true);
    $("#puerta").prop("disabled",true);
    $(".nivel").prop("disabled",true);
    $("#niveles label.btn").addClass("disabled");
    $("#observaciones").prop("disabled",true);
    $("#siguiente").prop("disabled",true);
    $("#anterior").prop("disabled",true);
    $("#obtener-posicion").prop("disabled",true);
    $("#modo-punto").show();
    $('#sector').focus();
}
Interfaz.setModoPuntoView=function(){
    $("#modo-punto").hide();
    $("#sector").prop("disabled",true);
    $("#manzana").prop("disabled",true);
    $("#lado").prop("disabled",true);
    $("#secuencia").prop("disabled",false);
    $("#puerta").prop("disabled",false);
    $(".nivel").prop("disabled",false);
    $("#niveles label.btn").removeClass("disabled");
    $("#observaciones").prop("disabled",false);
    $("#siguiente").prop("disabled",false);
    $("#anterior").prop("disabled",false);
    $("#modo-lado").show();
    $('#puerta').focus();        
}
Interfaz.addListeners=function(){
    var self = this;
    $('#logout').click(function(){
        LocalStorage.clear('token');
        Interfaz.setAppData();
    });
    $('#login').click(function(){
        if(self.saveCurrentForm()){
            window.location.href = '../logout';
        }
    });
    $('#sector').keypress(function(e){
        if(e.which == 13){//Enter key pressed
            $('#manzana').focus();
        }
    });
    $('#manzana').keypress(function(e){
        if(e.which == 13){//Enter key pressed
            $('#lado').focus();
        }
    });
    $('#lado').keypress(function(e){
        if(e.which == 13){//Enter key pressed
            $('#modo-punto').click();
        }
    });
    $('#secuencia').keypress(function(e){
        if(e.which == 13){//Enter key pressed
            $('#puerta').focus();
        }
    });
    $("#sector, #manzana, #lado").change(function(){
        var sector = $('#sector').val();
        var manzana = $('#manzana').val();
        var lado = $('#lado').val();
        if(sector && manzana && lado){
            $('#secuencia').val(parseInt(Relevador.getMaxForLado(sector, manzana, lado)) + 1);
        }
    });
    $("#secuencia").focusin(function(){
        $(this).prop('oldValue',$(this).val());
    });
    $("#secuencia").change(function(){
        $("#required-data").addClass('hidden');
        $("#point-1").removeClass("error");
        $("#point-2").removeClass("error");
        var secuenciaOld = parseInt($(this).prop('oldValue'));
        if(secuenciaOld){
            var positionObject = self.createPositionObjectFromForm(secuenciaOld);
            if(Relevador.getAndSaveCurrentPosition(positionObject)){
                $(this).prop('oldValue','');
            }else{
                $("#secuencia").val(secuenciaOld);
                $("#required-data").removeClass('hidden');
                $(window).scrollTop(0);
                return;
            }
        }
        var sector = $('#sector').val();
        var manzana = $('#manzana').val();
        var lado = $('#lado').val();
        var secuencia = $("#secuencia").val();
        if(sector && manzana && lado && secuencia){
            var positionObject = Relevador.getPositionObjectFromReadings(sector, manzana, lado, secuencia);
            if(positionObject){
                self.loadForm(positionObject);
                return;
            }
        }
        self.resetForm();
    });
    $(".nivel").change(function(){
        $("#obtener-posicion").click();
        $("#obtener-posicion").prop("disabled",false);
    });
    $("#obtener-posicion").click(function(){
        var secuencia = $("#secuencia").val();
        if(secuencia){
            var callBackFun = function(position, sec, numeroPunto){
                numeroPunto = numeroPunto.toString();
                self.showPosition(position,'#pto-' + numeroPunto + '-lat','#pto-' + numeroPunto + '-long', '#pto-' + numeroPunto + '-datetime', sec);
                $("#point-" + numeroPunto).removeClass("error");
            };
            var callBackFunErr = function(where, sec, numeroPunto){
                numeroPunto = numeroPunto.toString();
                var position = {coords: {latitude: 0, longitude: 0}};
                self.showPosition(position,'#pto-' + numeroPunto + '-lat','#pto-' + numeroPunto + '-long', '#pto-' + numeroPunto + '-datetime', sec);
                $("#point-" + numeroPunto).addClass("error");
                $('#punto-lectura-error-' + numeroPunto).removeClass("hidden");
                $('#punto-lectura-error-' + numeroPunto).text('(' + where + ') Error al obtener la posición N°' + numeroPunto + '.');
                setTimeout(function(){
                    $('#punto-lectura-error-' + numeroPunto).addClass("hidden");
                }, 3000);
            };
            Geolocator.getCurrentLocation(callBackFun, callBackFunErr, secuencia, 1, {enableHighAccuracy: true, maximumAge: 0, timeout: 15000 });
            Geolocator.getCurrentLocation(callBackFun, callBackFunErr, secuencia, 2, {enableHighAccuracy: false, maximumAge: 0, timeout: 5000 });
        }
    });
    $("#modo-lado").click(function(){
        if(self.saveCurrentForm()){
            self.setModoLadoView();
        }
    });
    $("#modo-punto").click(function(){
        $("#required-data").addClass('hidden');
        var sector = $("#sector").val();
        var manzana = $("#manzana").val();
        var lado = $("#lado").val();
        if(sector && manzana && lado){
            self.setModoPuntoView();
            self.resetForm();
        }else{
            $("#required-data").removeClass('hidden');
            $(window).scrollTop(0);
        }
    });
    $("#anterior").click(function(){
        $('#secuencia').prop('oldValue',$("#secuencia").val());
        var secuencia = parseInt($("#secuencia").val());
        $("#secuencia").val(secuencia-1);
        $("#secuencia").change();
    });
    $("#siguiente").click(function(e){
       $('#secuencia').prop('oldValue',$("#secuencia").val());
        var secuencia = parseInt($("#secuencia").val());
        $("#secuencia").val(secuencia+1);
        $("#secuencia").change();
    });
    $("#enviar-lecturas-server").click(function(){
        if(self.saveCurrentForm()){
            $("#enviar-lecturas-server").prop("disabled", true);
            var token = LocalStorage.get('token');
            if($.isEmptyObject(token)){
                $('#login').click();
            }else{
                var customElement = $("<div class='col-md-6 col-md-offset-3 wait-message'>");
                $.LoadingOverlay("show", {
                    custom: customElement
                });
                customElement.text("Por favor espere...");
                //si se marca como enviados, levantar solamente los no enviados
                var position_collection = Relevador.getAllPositionsFromLocalStorage();
                var removeAlert=function(alertId, miliseconds){
                    setTimeout(function(){
                        $(alertId).addClass("hidden");
                        $("#enviar-lecturas-server").prop("disabled", false);
                    }, miliseconds);
                };
                setTimeout(function(){
                    $.ajax({
                        url: '../save/positions', 
                        type: 'post',
                        data: {
                                position_collection: JSON.stringify(position_collection),
                                token: token,
                              },
                        success: function(result) {
                            console.log(result);
                            if(result.code === 200){
                                alertId = '#server-response-success';
                                LocalStorage.clear('readings');
                                self.setModoLadoView();
                            }else{
                                if(result.code === 204){
                                    alertId = '#server-response-info';
                                    
                                }else{
                                    alertId = '#server-response-error';
                                }
                            }
                            $(window).scrollTop(0);
                            $(alertId).removeClass("hidden");
                            $(alertId).text(result.message);
                            removeAlert(alertId, 3000);
                            $.LoadingOverlay("hide", true);
                            $('#subir-modal').modal('hide');
                        },
                        error: function(err) {
                            console.log("err: ", err);
                            $.LoadingOverlay("hide", true);
                            $(window).scrollTop(0);
                            alertId = '#server-response-error';
                            $(alertId).removeClass("hidden");
                            $(alertId).text('No se pudo conectar con el servidor.');
                            $('#subir-modal').modal('hide');
                            removeAlert(alertId, 3000);
                        }
                    })
                }, 500);
            }
        }
    });
}
Interfaz.saveCurrentForm=function(){
    var secuencia = $("#secuencia").val();
    var positionObject = this.createPositionObjectFromForm(secuencia);
    if(!Relevador.getAndSaveCurrentPosition(positionObject)){
        $("#required-data").removeClass('hidden');
        $(window).scrollTop(0);
        return false;
    }
    $("#required-data").addClass('hidden');
    return true;
}
Interfaz.createPositionObjectFromForm=function(secuencia){
    var positionObject = Relevador.newPositionObject();
    positionObject.sector = $('#sector').val();
    positionObject.manzana = $('#manzana').val();
    positionObject.lado = $('#lado').val();
    positionObject.secuencia = secuencia;
    positionObject.puerta = $('#puerta').val();
    positionObject.nivel = $('input[name=nivel]:checked').val();
    positionObject.observaciones = $('#observaciones').val();
    positionObject.fecha_relevamiento = calcDatetime();
    positionObject.puntos[0].latitud = $('#pto-1-lat').val();
    positionObject.puntos[0].longitud = $('#pto-1-long').val();
    positionObject.puntos[0].datetime = $('#pto-1-datetime').val();
    positionObject.puntos[1].latitud = $('#pto-2-lat').val();
    positionObject.puntos[1].longitud = $('#pto-2-long').val();
    positionObject.puntos[1].datetime = $('#pto-2-datetime').val();
    return positionObject;
}
Interfaz.botonEnviar=function(){
    if(Offline.state === 'up'){
        $("#enviar-lecturas-server").prop("disabled", false);
    }else{
        $("#enviar-lecturas-server").prop("disabled", true);
    }
    Offline.on('up', function () {
        $("#enviar-lecturas-server").prop("disabled", false);
    });
    Offline.on('down', function () {
        $("#enviar-lecturas-server").prop("disabled", true);
    });
}
Interfaz.mostrarError=function(error){
    var alertId = '#server-response-error';
    $(alertId).removeClass("hidden");
    $(alertId).text(error);
}