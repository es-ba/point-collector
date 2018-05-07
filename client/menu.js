"use strict";

var viewPortTag=document.createElement('meta');
viewPortTag.id="viewport";
viewPortTag.name = "viewport";
viewPortTag.content = "width=device-width, initial-scale=1.0, user-scalable=0";
document.getElementsByTagName('head')[0].appendChild(viewPortTag);

myOwn.wScreens.proc.result.setToken=function(result, div){
    localStorage.setItem('token', JSON.stringify(result));
    div.innerText='El token para el usuario ' + result.usuario + ' y la tarea "' + result.tarea + '" es '+result.token + '. Redirigiendo a la app...';
    div.style.backgroundColor = '#5F5';
    setTimeout(function(){
        window.location.href = 'webapp/';
    },1500);
};