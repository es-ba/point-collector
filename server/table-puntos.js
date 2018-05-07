"use strict";

module.exports = function(context){
    var admin=context.user.rol==='admin';
    return context.be.tableDefAdapt({
        name:'puntos',
        title:'punto',
        editable: admin,
        fields:[
            {name:'id'          , typeName:'integer'     , nullable:false, sequence:{name: 'secuencia_puntos', firstValue: 1}},
            {name:'lectura'     , typeName:'integer'     , nullable:false },
            {name:'fecha'       , typeName:'timestamp'   , nullable:false },
            {name:'latitud'     , typeName:'decimal'     , nullable:false },
            {name:'longitud'    , typeName:'decimal'     , nullable:false },
        ],
        primaryKey:['id'],
        foreignKeys:[
            {references:'lecturas', fields:[{source:'lectura', target:'id'}]},
        ],
    }, context);
}
