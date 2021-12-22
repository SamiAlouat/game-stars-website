(function(document){"use strict";var PlayerManager={callbacks:{}},initialized=false,fullscreenSupport,videoSupport,pageHasCaptions=false,inlineSvgSupport=false,windowsPhone,IE10,usePlayer,assetUrls,playerLoadQueue=[],assetStartTime,jsDone=false,cssDone=false,script,link,shouldDispatchReady=false,readyPlayerObjects=[],playerObjects={},defaultDelegate={willOpenShareOverlay:function(id){if(typeof window.shareWindowPopup==="function"){_pauseAllVideos();window.shareWindowPopup(id);return false}},willOpenLoginForm:function(id,context){if(typeof vimeo.Modal!=="undefined"){_pauseAllVideos();if(context){vimeo.Session.create({player:1,clip_id:id,context:context})}else{vimeo.Session.create()}return false}},didLikeVideo:function(id){if(typeof Signal!=="undefined"&&"player"in Signal&&"like"in Signal.player){Signal.player.like.dispatch()}},didUnlikeVideo:function(id){if(typeof Signal!=="undefined"&&"player"in Signal&&"unlike"in Signal.player){Signal.player.unlike.dispatch()}},willOpenVodPurchaseForm:function(clip_id,popup_uri,onsite_uri){var product_id=popup_uri!==undefined&&popup_uri.match(/^[0-9]+$/)?parseInt(popup_uri,10):null,checkout_hash;popup_uri=popup_uri!==undefined&&popup_uri.match(/^\/store\/ondemand\//)?popup_uri:null;if(typeof OnDemand!=="undefined"){var leaveFullScreen=function(){if(typeof window.BigScreen!=="undefined"&&BigScreen.element){BigScreen.exit()}};leaveFullScreen();if(OnDemand.isGeoBlocked){OnDemand.openCheckout("//"+vimeo.url+"/store/ondemand/purchase/"+OnDemand.vodId)}else if(product_id){OnDemand.openCheckout("//"+vimeo.url+"/store/ondemand/byproduct/"+product_id)}else if(popup_uri){OnDemand.openCheckout("//"+vimeo.url+popup_uri)}else{OnDemand.openCheckout("//"+vimeo.url+"/store/ondemand/purchase/"+OnDemand.vodId+"/"+clip_id)}return false}if(product_id){checkout_hash="#product_id="+product_id}else if(clip_id){checkout_hash="#purchase"}else if(onsite_uri){window.location.href=onsite_uri;return false}window.location.href="/"+clip_id+checkout_hash;return false}};function _initAssets(){if(!assetUrls){return}var firstScript=document.getElementsByTagName("script")[0];script=document.createElement("script");var playerObject=false;if(usePlayer){assetStartTime=(new Date).getTime();script.src=assetUrls.js;firstScript.parentNode.insertBefore(script,firstScript);script["onreadystatechange"in script?"onreadystatechange":"onload"]=function(){if(!jsDone&&(!this.readyState||this.readyState==="loaded"||this.readyState==="complete")){jsDone=true;while(playerLoadQueue.length){_initPlayer(playerLoadQueue.shift())}}};link=document.createElement("link");link.rel="stylesheet";link.href=assetUrls.css;firstScript.parentNode.insertBefore(link,firstScript);link.addEventListener("load",function(){cssDone=true},false);return}}function _init(){if(initialized){return}fullscreenSupport="exitFullscreen"in document||"webkitExitFullscreen"in document||"webkitCancelFullScreen"in document||"mozCancelFullScreen"in document||"msExitFullscreen"in document||"webkitEnterFullScreen"in document.createElement("video");videoSupport=function(){var video=document.createElement("video");return{h264:"canPlayType"in video&&video.canPlayType("video/mp4")!=="",textTracks:typeof TextTrackList!==undefined&&typeof video.textTracks!=="undefined"&&video.textTracks instanceof TextTrackList}}();inlineSvgSupport=function(){var div=document.createElement("div");div.innerHTML="<svg/>";return(div.firstChild&&div.firstChild.namespaceURI)==="http://www.w3.org/2000/svg"}();windowsPhone=/MSIE 9/.test(navigator.userAgent)&&/Windows Phone/.test(navigator.userAgent);IE10=/IE 10/.test(navigator.userAgent);usePlayer=fullscreenSupport||IE10||windowsPhone;_checkForFeaturesOnPage();if(!inlineSvgSupport){usePlayer=false}_initAssets();initialized=true}function _createNewPlayer(player,config){var playerObject,delegateToUse=player.getAttribute("data-embed")==="true"?{}:defaultDelegate;var cssInfo=cssDone||{link:link,startTime:assetStartTime};config=config||player.getAttribute("data-config-url");var VimeoPlayer=window.VimeoPlayer||window.ChromelessPlayer;playerObject=new VimeoPlayer(player,config,cssInfo,delegateToUse);player.classList.add("loading");playerObject.ready(function(){_playerReady(playerObject,player)});_setUpEvents(playerObject);_storePlayerObject(player,playerObject);player.removeAttribute("data-config-url");player.setAttribute("data-player","true");return playerObject}function _renderErrorForPlayer(player){var str='<div class="error" style="display:table-cell;vertical-align:middle;background:rgba(20,20,20,0.8);text-align:center;color:#FFF;"><h1 style="color:#fff">'+Copy.dict.oops+'</h1><p style="color:#fff">'+Copy.dict.player_try_again+"</p></div>";player.removeAttribute("data-config-url");player.setAttribute("data-player","true");player.parentNode.className+=" player_error";player.style.display="table";player.innerHTML=str}function _initPlayer(player){if(player.getAttribute("data-player")==="true"){return}if(!assetUrls){_renderErrorForPlayer(player);return}if(usePlayer){if(jsDone){return _createNewPlayer(player)}playerLoadQueue.push(player);return}var fallbackUrl=player.getAttribute("data-fallback-url");player.innerHTML='<div class="fallback"><iframe src="'+fallbackUrl+'" frameborder="0"></iframe></div>'}function _getPlayerElements(initialized,element){var attribute=initialized?"data-player":"data-config-url";return(element||document).querySelectorAll(".player["+attribute+"]")}function _checkForFeaturesOnPage(){var playersOnPage=_getPlayerElements();for(var i=0,length=playersOnPage.length;i<length;i++){if(playersOnPage[i].getAttribute("data-captions")){pageHasCaptions=true}}}function _containsElement(outerElement,innerElement){if("contains"in outerElement){return outerElement.contains(innerElement)}if("compareDocumentPosition"in outerElement){return outerElement.compareDocumentPosition(innerElement)===20}return false}function _initPlayers(){var players=_getPlayerElements();for(var i=0,length=players.length;i<length;i++){_initPlayer(players[i])}}function _cleanUpPlayers(){for(var id in playerObjects){if(playerObjects.hasOwnProperty(id)){if(!document.getElementById(id)){delete playerObjects[id]}}}}function _makeEventHandler(name,player){return function(event){if(typeof Signal!=="undefined"&&"player"in Signal&&name in Signal.player){Signal.player[name].dispatch(player,event);if(name==="play"&&typeof vimeo!=="undefined"){vimeo.active_player=player;vimeo.active_player.unpauseKeyboard();_disableKeyboard(vimeo.active_player)}}}}function _setUpEvents(player){player.ready(function(){player.addEventListener("play",_makeEventHandler("play",player));player.addEventListener("pause",_makeEventHandler("pause",player));player.addEventListener("finish",_makeEventHandler("finish",player));player.addEventListener("playProgress",_makeEventHandler("playProgress",player))})}function _playerReady(playerObject,playerElement){if(shouldDispatchReady&&typeof Signal!=="undefined"&&"player"in Signal&&"ready"in Signal.player){Signal.player.ready.dispatch(playerObject,playerElement);return}readyPlayerObjects.push(playerObject)}function _dispatchReadySignals(playerObject){shouldDispatchReady=true;if(typeof Signal!=="undefined"&&"player"in Signal&&"ready"in Signal.player&&readyPlayerObjects.length){while(readyPlayerObjects.length){Signal.player.ready.dispatch(readyPlayerObjects.shift())}}}function _storePlayerObject(element,object){playerObjects[element.id]=object}function _getPlayerObject(element,initialized,traverse){if(element.getAttribute("data-player")==="true"){return playerObjects[element.id]}if(initialized===undefined){initialized=true}if(traverse===undefined){traverse=true}var players=_getPlayerElements(initialized,element),length=players.length,player_obj;if(players.length>0){if(!initialized){try{player_obj=players[0]}catch(x){throw new Error("Error accessing players[0]")}}else{try{player_obj=playerObjects[players[0].id]}catch(x){throw new Error("Error accessing players[0].id")}}return player_obj}players=_getPlayerElements(initialized);length=players.length;if(!traverse){return}while(element=element.parentNode){for(var i=0;i<length;i++){if(_containsElement(element,players[i])){try{player_obj=playerObjects[players[i].id]}catch(x){throw new Error("Error accessing players[i].id")}return player_obj}}}}function _getPlayerWithinContainer(element,traverse){var player=_getPlayerObject(element,false,traverse);if(!player){player=_getPlayerObject(element,true,traverse)}return player}function _pauseAllVideos(){for(var id in playerObjects){if(playerObjects.hasOwnProperty(id)&&!playerObjects[id].paused&&playerObjects[id].pause){playerObjects[id].pause()}}}function _disableKeyboard(player){for(var id in playerObjects){if(playerObjects.hasOwnProperty(id)&&playerObjects[id]!==player){playerObjects[id].pauseKeyboard()}}}function _setDefaultDelegate(obj){defaultDelegate=_extend(defaultDelegate,obj)}function _extend(){if(arguments.length<2){return}var master=arguments[0];for(var i=1,l=arguments.length;i<l;i++){var object=arguments[i];for(var key in object){if(object.hasOwnProperty(key)){master[key]=object[key]}}}return master}function _run(urls,defer){if(urls){assetUrls=urls}_init();if(defer){return}_initPlayers();_cleanUpPlayers()}function _runAndDefer(urls){_run(urls,true)}function _reRun(urls){initialized=false;jsDone=false;cssDone=false;var script=document.querySelector('script[src$="player.js"], script[src$= "chromeless.js"]');var link=document.querySelector('link[href$="player.css"], link[href$="chromeless.css"]');if(script){script.remove()}if(link){link.remove()}_run(urls)}PlayerManager.run=_run;PlayerManager.reRun=_reRun;PlayerManager.runAndDefer=_runAndDefer;PlayerManager.initPlayer=_initPlayer;PlayerManager.getPlayer=_getPlayerObject;PlayerManager.getAnyPlayer=_getPlayerWithinContainer;PlayerManager.setDefaultDelegate=_setDefaultDelegate;PlayerManager.dispatchReadySignals=_dispatchReadySignals;PlayerManager.pauseAllPlayers=_pauseAllVideos;window.PlayerManager=PlayerManager})(document);
//# sourceMappingURL= 