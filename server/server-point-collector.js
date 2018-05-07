"use strict";

var Path = require('path');
var backendPlus = require("backend-plus");
var MiniTools = require('mini-tools');
var serveContent = require('serve-content');
var changing = require('best-globals').changing;
var date = require('best-globals').date;

class AppPointCollector extends backendPlus.AppBackend{
    constructor(){
        super();
    }    
    addLoggedServices(){
        var be = this;
        super.addLoggedServices();
        this.app.get('/echo', function(req,res){
            res.end('echo');
        });
    }
    addSchrödingerServices(mainApp,baseUrl){
        var be = this;
        super.addSchrödingerServices(mainApp,baseUrl);
        var optsGenericForFiles={
            allowedExts:['', 'js', 'html', 'css', 'jpg', 'jpeg', 'png', 'ico', 'gif', 'eot', 'svg', 'ttf', 'woff', 'woff2', 'appcache']
        }
        mainApp.use(baseUrl+'/webapp/',serveContent(be.rootPath+'/webapp/',optsGenericForFiles));
        mainApp.post(baseUrl+'/save/positions',function(req,res){
            var result = {};
            var client = null;
            return Promise.resolve().then(function(){
                return be.getDbClient(req).then(function(cli){
                    client = cli;
                    return client.query("BEGIN TRANSACTION").execute();
                });
            }).then(function(){
                var today = date.today();
                return client.query("select * " + 
                                 "from tareas " + 
                                 "where tarea = $1 and vencimiento >= $2"
                                 ,[req.body.token.tarea, today.toYmd()]).fetchOneRowIfExists();    
            }).then(function(queryResult){
                if(queryResult.rowCount){
                    var posiciones = JSON.parse(req.body.position_collection);
                    if(posiciones.length){
                        var promiseChain=Promise.resolve();
                        posiciones.forEach(function(pos){
                            promiseChain = promiseChain.then(function(){
                                pos.observaciones = (pos.observaciones)?"'"+pos.observaciones+"'":"null";
                                pos.puerta = (pos.puerta)?"'"+pos.puerta+"'":"null";
                                var values = [];
                                values.push("'" + (req.body.token.token) + "'");
                                values.push("'" + pos.fecha_relevamiento + "'");
                                values.push("'" + pos.sector + "'");
                                values.push("'" + pos.manzana + "'");
                                values.push("'" + pos.lado + "'");
                                values.push(pos.secuencia);
                                values.push(pos.puerta);
                                values.push(pos.nivel);
                                values.push(pos.observaciones);
                                return client.query("INSERT INTO lecturas " + 
                                             "(token, fecha_relevamiento, sector, manzana, lado, secuencia, puerta, nivel, observaciones) " +
                                             "VALUES ("+values.join(",")+") returning id" ,[]).fetchUniqueRow();
                            }).then(function(insertedResult){
                                var lecturaId = insertedResult.row.id;
                                var promiseChain2=Promise.resolve();
                                pos.puntos.forEach(function(punto){
                                    promiseChain2 = promiseChain2.then(function(){
                                        var values = [];
                                        values.push(lecturaId);
                                        values.push("'" + punto.datetime + "'");
                                        values.push(punto.latitud);
                                        values.push(punto.longitud);
                                        return client.query("INSERT INTO puntos " + 
                                                        "(lectura, fecha, latitud, longitud) " +
                                                        "VALUES ("+values.join(",")+") "
                                        ,[]).execute();
                                    }).catch(function(err){
                                        throw err;
                                    });
                                });
                                return promiseChain2;
                            }).catch(function(err){
                                throw err;
                            });
                        }); 
                        result = { code: 200, message: 'Posiciones guardadas correctamente'};                        
                        return promiseChain;
                    }else{
                        result = { code: 204, message: 'No se recibieron posiciones nuevas.'};
                    }
                }else{
                    throw new Error('La tarea no existe o se encuentra vencida. No se guardaron los puntos');
                }
            }).then(function(){
                return client.query("COMMIT").execute();
            }).then(function(){
                client.done();
            }).then(function(){
                res.send(result);
            }).catch(function(err){
                if(client && typeof client.done === "function"){
                    client.query("ROLLBACK").execute().then(function(){
                        client.done();
                    });
                }
                console.log('ERROR: ',err.message);
                result = { code: 500, message: "Error al guardar los puntos. " + err.message};
                res.send(result);
            });
        });
    }
    getProcedures(){
        var be = this;
        return super.getProcedures().then(function(procedures){
            return procedures.concat(
                require('./procedures-point-collector.js').map(be.procedureDefCompleter, be)
            );
        });
    }
    getMenu(context){
        return {menu:[
            {menuType:'menu', name:'recolector',  selectedByDefault:true, menuContent:[
                {menuType:'path', name:'app', path:'/webapp/'},
                {menuType:'proc', name:'obtener/token', label:'token'},
            ]},
            {menuType:'menu', name:'administrar', menuContent:[
                {menuType:'table', name:'lecturas', selectedByDefault:true},
                {menuType:'table', name:'lecturas_planas'},
            ]},
            {menuType:'menu', name:'configuración', menuContent:[
                {menuType:'table', name:'variables', selectedByDefault:true},
                {menuType:'table', name:'tareas'},
                {menuType:'table', name:'tokens'},
                {menuType:'table', name:'usuarios' },
            ]},
        ]}
    }
    getTables(){
        return super.getTables().concat([
            'usuarios', 
            'variables',
            'tokens',
            'tareas',
            'lecturas',
            'lecturas_planas',
            'puntos'
        ]);
    }
}

new AppPointCollector().start();