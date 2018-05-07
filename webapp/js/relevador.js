var Relevador = {version: '', tarea: ''};
Relevador.generateKey=function(sector, manzana, lado){
    return encodeURIComponent("s" + sector + "m" + manzana + "l" + lado)
}
Relevador.newPositionObject=function(){
    var punto1 = {
                 latitud : '', 
                 longitud : '',
                 datetime: '', 
                };
    var punto2 = {
                 latitud : '', 
                 longitud : '',
                 datetime: '', 
                };
    var positionObject = { 
                            fecha_relevamiento: '', 
                            sector: '',
                            manzana: '',
                            lado: '',
                            secuencia: '',
                            puerta: '',
                            nivel: '',
                            observaciones: '',
                            puntos : [punto1, punto2], 
                          };
    return positionObject;
}
Relevador.getMaxForLado=function(sector, manzana, lado){
    var key = this.generateKey(sector, manzana, lado);
    var max = 0;
    var readings = LocalStorage.get('readings');
    if(readings[key]){
        $.each(readings[key], function(key, positionObject) {
            if(positionObject.secuencia > max){
                max = positionObject.secuencia;
            }
        });
    }else{
        max = parseInt(lado.replace(/\D/g, '') || 1) * 1000;
    }
    return max;
}
Relevador.getAndSaveCurrentPosition=function(positionObject){
    if(!this.isEmptyPositionObject(positionObject)){
        var result = this.savePositionObject(positionObject);
        if(result){
            Interfaz.addHistory(positionObject);
        }else{
            return false;
        }
    }
    return true;
}
Relevador.validatePositionObject=function(positionObject){
    if(positionObject.sector && positionObject.manzana && positionObject.lado && positionObject.secuencia && positionObject.nivel && positionObject.puntos[0].latitud && positionObject.puntos[1].latitud){
        return true;    
    }
    return false;
}
Relevador.isEmptyPositionObject=function(positionObject){
    if(!positionObject.puerta && !positionObject.nivel && !positionObject.observaciones && !positionObject.puntos[0].latitud && !positionObject.puntos[1].latitud){
        return true;    
    }
    return false;
}
Relevador.savePositionObject=function(positionObject){
    if(this.validatePositionObject(positionObject)){
        var key = this.generateKey(positionObject.sector, positionObject.manzana, positionObject.lado);
        var readings = LocalStorage.get('readings');
        if(!readings[key]){
            readings[key] = {};
        }
        readings[key][positionObject.secuencia] = positionObject;
        LocalStorage.set('readings', readings);
        return true;
    }
    return false;
}
Relevador.getPositionObjectFromReadings=function(sector, manzana, lado, secuencia){
    var key = this.generateKey(sector, manzana, lado);
    var readings = LocalStorage.get('readings');
    if(readings[key]){
        return readings[key][secuencia];
    }
    return false
}
Relevador.getAllPositionsFromLocalStorage=function(){
    var positionCollection = [];
    $.each(LocalStorage.get('readings'), function(key, val) {
        $.each(val, function(key, positionObject) {
            positionCollection.push(positionObject);
        });
    });
    return positionCollection;
}