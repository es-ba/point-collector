"use strict";

var changing = require('best-globals').changing;
var fs = require('fs-promise');
var Path = require('path');
var bestGlobals = require('best-globals');
var datetime = bestGlobals.datetime;

var ProceduresPointCollector = {};

ProceduresPointCollector = [
    {
        action: 'obtener/token',
        parameters:[
            {name:'tarea', references: 'tareas'},
        ],
        resultOk:'setToken',
        coreFunction:function(context, parameters){
            var now = datetime.now();
            var token = context.user.usuario + parameters.tarea + now;
            var client=context.client;
            var be=context.be;
            return Promise.resolve().then(function(){
                return client.query("insert into tokens(usuario, tarea, token, fecha) values ($1, $2, md5($3), $4) returning token",
                    [context.user.usuario, parameters.tarea, token, now]).fetchUniqueRow();
            }).then(function(result){
                var token = result.row.token;
                return {token:token, tarea: parameters.tarea, usuario: context.user.usuario}    
            }).catch(function(err){
                console.log('ERROR',err.message);
                throw err;
            });
        }
    }
];

module.exports = ProceduresPointCollector;