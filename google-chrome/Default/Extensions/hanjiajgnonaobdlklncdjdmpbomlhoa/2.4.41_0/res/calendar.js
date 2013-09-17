var divw = 0, divh = 0;
function $c(a, b) {
  if(a == "#text" || a == "#") {
    return document.createTextNode(b)
  }else {
    if(typeof a == "string" && a.substr(0, 1) == "#") {
      return document.createTextNode(a.substr(1))
    }else {
      var c = document.createElement(a)
    }
  }
  for(var d in b) {
    if(d == "kids") {
      for(var e in b[d]) {
        typeof b[d][e] == "object" && c.appendChild(b[d][e])
      }
    }else {
      if(d == "#text") {
        c.appendChild(document.createTextNode(b[d]))
      }else {
        if(d == "#html") {
          c.innerHTML = b[d]
        }else {
          c.setAttribute(d, b[d])
        }
      }
    }
  }
  return c
}
function hz_cal_showevent(a) {
  var b = geByClass("selected", calendarex)[0];
  if(b) {
    if(b.id == a + "pic0") {
      hz_ev.innerHTML = "";
      removeClass(b, "selected");
      hide("hz_ev");
      return
    }else {
      removeClass(b, "selected");
      addClass(a + "pic0", "selected")
    }
  }else {
    addClass(a + "pic0", "selected")
  }
  window.hz_ev || calendarex.appendChild($c("div", {id:"hz_ev"}));
  show("hz_ev");
  hz_ev.innerHTML = "";
  for(b = "0";ge(a + "pic" + b);) {
    var c = ge(a + "pic" + b).cloneNode(true);
    c.setAttribute("onclick", "");
    hz_ev.appendChild(c);
    b++
  }
  hz_ev.innerHTML = hz_ev.innerHTML.replace(/(<a[^>]+>)(<img[^>]+>)([^<>]+<\/a>)/gi, "$1$2</a>$1$3")
}
function outputCalendar(a, b) {
  if(!window.calendarex) {
    return console.log("!calendarex")
  }
  var c = a == undefined || b == undefined ? "" : "?month=" + a + "&year=" + b;
  (new Ajax(function(d, e) {
    e = e.replace(/navigate\(/g, "outputCalendar(");
    e = e.replace(/>(\d+)<\/div>(?:<a[^>]+>\+<\/a>)?<div class='calPic'/g, ">$1</div><div class='calPic' onclick='hz_cal_showevent(\"$1\");' ");
    e = e.replace(/(<div.class=.dayNum.>)(\d+)(<\/div><div)/g, "$1<b>$2</b>$3");
    calendarex.innerHTML = '<div id="hz_cal">' + e + "</div>"
  })).get("/calendar_ajax.php" + c)
}
if(!window.Ajax) {
  throw"No Ajax on this page";
}
sideBar = window.sideBar || window.side_bar;
if(!window.calendar) {
  sideBar && outputCalendar();
  if(window.imgtrailer) {
    imgtrailer.style.cssText += "z-index: 65000;"
  }else {
    document.body.appendChild($c("div", {id:"imgtrailer", style:"position:absolute;visibility:hidden;z-index:65000;"}))
  }
}
function trailOff() {
  if(window.imgtrailer && imgtrailer.style) {
    document.onmousemove = "";
    imgtrailer.style.visibility = "hidden"
  }
}
function trailOn(a, b, c, d) {
  if(window.imgtrailer && imgtrailer.style) {
    imgtrailer.style.left = "-500px";
    divthw = parseInt(c) + 2;
    imgtrailer.innerHTML = '<div style="background-color: #DAE2E8; layer-background-color: #DAE2E8; border: 1px solid #ADBBCA; padding:10px; width: ' + divthw + 'px; "><div style="background-color: #FFFFFF; layer-background-color: #FFFFFF; border: 1px solid #ADBBCA; background-image: url(images/lloading.gif);"><img src="' + a + '" border="0"><div style="padding:3px; text-align:center">' + b + "</div></div>";
    imgtrailer.style.visibility = "visible";
    divw = parseInt(c) + 25;
    divh = parseInt(d) + 130;
    document.onmousemove = followmouse
  }
}
function followmouse(a) {
  var b = Math.min(document.body.offsetHeight, window.innerHeight);
  xcoord = pageXOffset + window.innerWidth - 15 < 15 + a.pageX + divw ? a.pageX - divw - 5 : 15 + a.pageX;
  ycoord = b < 15 + a.pageY + divh ? 15 + a.pageY - Math.max(0, divh + a.pageY - b - document.body.scrollTop - 30) : 15 + a.pageY;
  imgtrailer.style.left = xcoord + "px";
  imgtrailer.style.top = ycoord + "px"
}
