var LocalStorage = {};
LocalStorage.clear=function(key){
    localStorage.removeItem(key);
    return {};
}
LocalStorage.get=function(key){
    var values = JSON.parse(localStorage.getItem(key));
    if (values !== null) {
        return values;
    }else{
        return {};
    }
}
LocalStorage.set=function(key, value){
    localStorage.setItem(key, JSON.stringify(value));
}