window.geTN=function(j,b){if(!j)return null;return j.getElementsByTagName(b)};window.confirmGo=window.goAway=function(){return true};window.show_del_all=function(){if(window.del_all_link)del_all_link.style.display="inline"};window.photoarea&&MS().setPhotoScroll(photoarea);function HookFunc(j,b,e){var d=eval(j).toString();d=d.match(/function.*\((.*)\)[\s\S]{0,1}{([\s\S]+)}$/im);eval(j+"=function("+d[1]+"){"+(e?b+" "+d[2]:d[2]+" "+b)+"}")}window.set_posts_or_topics_data&&HookFunc("set_posts_or_topics_data","MS().C5D();");
var crex=null;if(window.Ajax)var crex=Ajax.current; 
(function(){window.Ajax=function(b,e,d){var f=this;this.onDone=b;this.onFail=e;var a=null;try{a=new XMLHttpRequest}catch(h){a=null}if(!a)try{a||(a=new ActiveXObject("Msxml2.XMLHTTP"))}catch(k){a=null}if(!a)try{a||(a=new ActiveXObject("Microsoft.XMLHTTP"))}catch(m){a=null}var o=function(i,c){if(a.readyState==4)if(a.status>=200&&a.status<300){if(d)if(a&&a.responseText){var g=a.responseText.replace(/^[\s\n]+/g,"");if(g.substr(0,10)=="<noscript>")try{var l=g.substr(10).split("</noscript>");eval(l[0]);
a.responseText=l[1]}catch(n){debugLog("eval ajax script:"+n.message)}}f.onDone&&f.onDone(extend(f,{url:i,data:c}),a.responseText);MS().C5D()}else{f.status=a.status;f.readyState=a.readyState;f.onFail&&f.onFail(extend(f,{url:i,data:c}),a.responseText)}};this.get=function(i,c,g){a.onreadystatechange=function(){o(i,c)};g=g||false;var l=typeof c!="string"?ajx2q(c):c;i+=l?"?"+l:"";a.open("GET",i,!g);a.setRequestHeader("X-Requested-With","XMLHttpRequest");a.send("")};this.post=function(i,c,g){a.onreadystatechange=
function(){o(i,c)};g=g||false;var l=typeof c!="string"?ajx2q(c):c;try{a.open("POST",i,!g)}catch(n){debugLog("ajax post error: "+n.message)}a.setRequestHeader("Content-Type","application/x-www-form-urlencoded");a.setRequestHeader("X-Requested-With","XMLHttpRequest");a.send(l)}};if(!window.ajaxObjs)var j={};window.Ajax.Get=function(b){var e=b.key?j[b.key]:null;if(!e){e=new Ajax(b.onDone,b.onFail,b.eval);if(b.key)j[b.key]=e}e.get(b.url,b.query,b.sync)};window.Ajax.Post=function(b){var e=b.key?j[b.key]:
null;if(!e){e=new Ajax(b.onDone,b.onFail,b.eval);if(b.key)j[b.key]=e}e.post(b.url,b.query,b.sync)};window.Ajax.postWithCaptcha=function(b,e,d){var f,a,h,k,m;d||(d={});if(isFunction(d))f=d;else{f=d.onSuccess;a=d.onFail;h=d.onCaptchaShow;k=d.onCaptchaHide}m={url:b,query:e,onFail:function(o,i){isFunction(a)&&a(o,i);if(window.Ajax._captchaBox){window.Ajax._captchaBox.setOptions({onHide:function(){}}).hide();isFunction(k)&&k(true)}},onDone:function(o,i){var c;try{c=eval("("+i+")");if(c.ok==-5)if(ge("please_confirm_mail"))c.ok=
-4;switch(c.ok){case -6:var g=new MessageBox({title:c.title||getLang("global_charged_zone_title"),returnHidden:true});g.addButton({label:getLang("global_cancel"),style:"button_no",onClick:function(){g.setOptions({returnHidden:false});g.hide()}}).addButton({label:getLang("global_charged_zone_continue"),onClick:function(){g.hide();m.query.charged_confirm=c.hash;Ajax.Post(m)}}).content(c.message).show();break;case -5:isFunction(h)&&h();if(c.title||c.message){g=new MessageBox({title:c.title||"\u041f\u043e\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043d\u0438\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044f"});
g.addButton({label:getLang("global_close"),onClick:g.hide});g.content(c.message||"\u041f\u0440\u0435\u0432\u044b\u0448\u0435\u043d\u043e \u043e\u0433\u0440\u0430\u043d\u0438\u0447\u0435\u043d\u0438\u0435 \u043d\u0430 \u043a\u043e\u043b\u0438\u0447\u0435\u0441\u0442\u0432\u043e \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0439, \u043f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u043f\u043e\u0437\u0436\u0435.").show()}else{window.validated=false;activate_mobile(false,function(){window.validated&&
Ajax.Post(m);k&&k(!window.need_mobile_act)},c.hash)}break;case -4:isFunction(h)&&h();if(ge("please_confirm_mail"))show_change_mail_box(k);else k&&k();break;case -3:var l=ce("iframe",{src:"http://login.vk.com/"},{visibility:"hidden",position:"absolute"});document.body.appendChild(l);var n=function(){try{var p=l.contentWindow.location.href;if(p.indexOf("slogin")!=-1){if(p.indexOf("nonenone")!=-1){location.href=base_domain+"login.php?op=logout";return false}else Ajax.Post(m);clearInterval(i)}}catch(q){}};
if(browser.msie)setInterval(function(){l.document.readyState=="complete"&&n()},200);else l.onload=n;break;case -2:var r="";if(c.difficult===undefined)c.difficult=d.difficultCaptcha?1:0;if(c.difficult!==undefined)r=intval(c.difficult)?"":"s=1&";showCaptcha(c.captcha_sid,base_domain+"captcha.php?"+r+"sid="+c.captcha_sid,function(p,q){if(typeof m.query=="object")extend(m.query,{captcha_sid:p,captcha_key:q});else m.query+="&captcha_sid="+p+"&captcha_key="+q;Ajax.Post(m);return false},h,k);break;default:throw"Exit";
}MS().C5D()}catch(s){if(d.json&&c)i=c;else if(c&&typeof c.text=="string")i=c.text;if(window.Ajax._captchaBox){window.Ajax._captchaBox.setOptions({onHide:function(){}}).hide();isFunction(k)&&k(true)}isFunction(f)&&f(o,i)}}};Ajax.Post(m)};window.Ajax.History=function(b,e,d){ajaxHistory.useCache=false;ajaxHistory.prepare({url:b,done:function(f,a){try{var h=eval("("+a+")");if(h.data)Ajax.current=h.data;d(h)}catch(k){debugLog(k)}},def:e});Ajax.current=e};window.Ajax.Go=function(b){b=extend(clone(Ajax.current),
b);ajaxHistory.go(b);return false};window.Ajax.Send=Ajax.postWithCaptcha;Ajax.current=crex})();
if(window.wwall)postStatus=function(j,b,e){if(!posting_on_wall){var d=ge("add_wall_media_link_status"),f=data(d,"postFunc"),a=data(ge("status_warn"),"note");d=ge("status_field");if(f)f();else{f=a?ge(a).getValue():"";if(a&&!f)notaBene(a);else{a=isFunction(d.getValue)?d.getValue():d.value;if(trim(a).length){status_export=(d=ge("export_to_twitter"))&&d.value?d.value:false;if(e){hide("status_progress_hide");show("status_progress_show")}j={act:"a_post_wall",hash:decodehash(b),message:a,to_id:j,reply_to:-1,
status_export:status_export,note_title:f};Ajax.Send("wall.php",j,function(){if(e){hide("status_progress_show");show("status_progress_hide")}var h=ge("status_field");h.style.color="#777";h.value=h.getAttribute("placeholder");h.active=0;h.blur();hideReplyBox(currentFocus);setupReply();MS().updateOldWall()});hide("status_warn")}else window.mentions_mod?triggerEvent(d,"focus"):d.focus()}}}};

function removeFuckingEvent(elem, types, handler) {
  //elem = ge(elem);
  if (!elem) return;
  var events = data(elem, 'events');
  if (!events) return;
  if (typeof(types) != 'string') {
    for (var i in events) {
      removeEvent(elem, i);
    }
    return;
  }
  each(types.split(/\s+/), function(index, type) {
    if (!isArray(events[type])) return;
    var l = events[type].length;
    if (isFunction(handler)) {
      for (var i = l - 1; i >= 0; i--) {
        if (events[type][i] == handler) {
          events[type].splice(i, 1);
          l--;
          break;
        }
      }
    } else {
      for (var i = 0; i<l; i++) {
		if(!events[type][i])continue;
		var st=events[type][i].toString();
		if(st.indexOf('autosize')!=-1&&st.indexOf('.send(')==-1){
		  //console.log(events[type][i]);
          delete events[type][i];
		}
      }
      l = 0;
    }
    /*if (!l) {
      if (elem.removeEventListener) {
        elem.removeEventListener(type, data(elem, 'handle'), false);
      } else if (elem.detachEvent) {
        elem.detachEvent('on' + type, data(elem, 'handle'));
      }
      delete events[type];
    }*/
  });
}

function blackjackAndLadies()
{
  if(window.geByTag){
    var ta=geByTag('textarea');
    for(var i=0;i<ta.length;i++)if(/*ta[i].id||*/true){
      removeFuckingEvent(ta[i],'keydown keyup keypress');
    }
  }
  return setTimeout(blackjackAndLadies,500);
}blackjackAndLadies();