function calcDatetime(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var hh = today.getHours();
    var min = today.getMinutes();
    var ss = today.getSeconds();

    var yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd;
    } 
    if(mm<10){
        mm='0'+mm;
    } 
    
    if(hh<10){
        hh='0'+hh;
    } 
    
    if(min<10){
        min='0'+min;
    } 
    
    if(ss<10){
        ss='0'+ss;
    } 
    
    return (yyyy+'-'+mm+'-'+dd+' '+hh+':'+min+':'+ss);
    
}

function utf8_to_b64( str ) {
  return window.btoa(unescape(encodeURIComponent( str )));
}

function b64_to_utf8( str ) {
  return decodeURIComponent(escape(window.atob( str )));
}