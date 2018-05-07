"use strict";

module.exports = function(context){
    var admin=context.user.rol==='admin';
    return context.be.tableDefAdapt({
        name:'lecturas_planas',
        tableName: 'lecturas',
        title:'Lecturas (tabla plana)',
        editable: admin,
        fields:[
            {name:'id'                    , typeName:'integer'     , nullable:false, sequence:{name: 'secuencia_lecturas', firstValue: 1}},
            {name:'fecha_relevamiento'    , typeName:'timestamp'   , nullable:false },
            {name:'sector'                , typeName:'text'        , nullable:false },
            {name:'manzana'               , typeName:'text'        , nullable:false },
            {name:'lado'                  , typeName:'text'        , nullable:false },
            {name:'secuencia'             , typeName:'integer'     , nullable:false },
            {name:'puerta'                , typeName:'text'                         },
            {name:'nivel'                 , typeName:'integer'     , nullable:false },
            {name:'latitud'             , typeName:'decimal'     , nullable:false },
            {name:'longitud'            , typeName:'decimal'     , nullable:false },
            {name:'observaciones'         , typeName:'text'                         }
        ],
        primaryKey:['id'],
        sql: {
                from: `(select distinct l.id, l.fecha_relevamiento, l.sector, l.manzana, l.lado, l.secuencia, l.puerta, l.nivel, l.observaciones, p.latitud, p.longitud
                        from lecturas l join puntos p on l.id = p.lectura)`
             }
    }, context);
}
