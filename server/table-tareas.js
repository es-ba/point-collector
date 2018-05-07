"use strict";

module.exports = function(context){
    var admin=context.user.rol==='admin';
    return context.be.tableDefAdapt({
        name:'tareas',
        elementName:'tarea',
        editable:admin,
        fields:[
            {name:'tarea'           , typeName:'text'  , nullable:false  },
            {name:'nombre'          , typeName:'text'  , nullable:false  },
            {name:'descripcion'     , typeName:'text'  , nullable:false  },
            {name:'vencimiento'     , typeName:'date'  , nullable:false  },
        ],
        primaryKey:['tarea'],
    }, context);
}