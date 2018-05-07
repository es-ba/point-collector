"use strict";

module.exports = function(context){
    var admin=context.user.rol==='admin';
    return context.be.tableDefAdapt({
        name:'variables',
        elementName:'usuario',
        editable:admin,
        fields:[
            {name:'variable'        , typeName:'text'   , nullable:false },
            {name:'pantalla'        , typeName:'text'                    },
            {name:'padre'           , typeName:'text'                    },
            {name:'tipo'            , typeName:'text'                    },
            {name:'leyenda'         , typeName:'text'                    },
            {name:'ubicacion'       , typeName:'text'                    },
            {name:'orden'           , typeName:'integer'                 },
        ],
        primaryKey:['variable'],
        foreignKeys:[
            {references:'variables', alias:'v', fields:[{source:'padre', target:'variable'}]},
        ],
        sql:{orderBy: ['orden']},
    }, context);
}