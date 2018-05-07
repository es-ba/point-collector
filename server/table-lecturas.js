"use strict";

module.exports = function(context){
    var admin=context.user.rol==='admin';
    return context.be.tableDefAdapt({
        name:'lecturas',
        title:'Lecturas',
        editable: admin,
        fields:[
            {name:'id'                    , typeName:'integer'     , nullable:false, sequence:{name: 'secuencia_lecturas', firstValue: 1}},
            {name:'token'                 , typeName:'text'        , nullable:false },
            {name:'fecha_relevamiento'    , typeName:'timestamp'   , nullable:false },
            {name:'sector'                , typeName:'text'        , nullable:false },
            {name:'manzana'               , typeName:'text'        , nullable:false },
            {name:'lado'                  , typeName:'text'        , nullable:false },
            {name:'secuencia'             , typeName:'integer'     , nullable:false },
            {name:'puerta'                , typeName:'text'                         },
            {name:'nivel'                 , typeName:'integer'     , nullable:false },
            {name:'observaciones'         , typeName:'text'                         }
        ],
        primaryKey:['id'],
        foreignKeys:[
            {references:'tokens', fields:['token']},
        ],
        detailTables:[
            {table: 'puntos' , fields:[{source:'id', target:'lectura'}], abr:'P', label:'Puntos'},
        ]
    }, context);
}
