"use strict";

var viewPortTag=document.createElement('meta');
viewPortTag.id="viewport";
viewPortTag.name = "viewport";
viewPortTag.content = "width=device-width, initial-scale=1.0, user-scalable=0";
document.getElementsByTagName('head')[0].appendChild(viewPortTag);