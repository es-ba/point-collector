"use strict";

module.exports = function(context){
    var admin=context.user.rol==='admin';
    return context.be.tableDefAdapt({
        name:'tokens',
        elementName:'token',
        editable:admin,
        fields:[
            {name:'token'    , typeName:'text'      , nullable:false },
            {name:'fecha'    , typeName:'timestamp' , nullable:false },
            {name:'tarea'    , typeName:'text'      , nullable:false, isName: true },
            {name:'usuario'  , typeName:'text'      , nullable:false, isName: true },
        ],
        primaryKey:['token'],
        foreignKeys:[
            {references:'tareas', fields:['tarea']},
            {references:'usuarios', fields:['usuario']},
        ],
        sql:{
            isTable: true,
            from: `(select * from tokens order by fecha desc)`
        },
    }, context);
}