var pagesize, current_page, cur_photoc, show_qnav, current, pb, itemindex, vkhost = window.location.host, lng = MS().lng;
function geTN(a, b) {
  if(!a) {
    return null
  }
  return a.getElementsByTagName(b)
}
function readCookieCfg(a, b) {
  _cookies = null;
  dt = getCookie(a);
  if(dt == undefined) {
    return b
  }else {
    dt = parseInt(dt)
  }
  return isNaN(dt) ? b : dt
}
function getLink(a, b, d, c) {
  return"<a " + (a ? 'id="' + a + '"' : "") + ' href="' + (d ? d : "") + '" ' + (c ? "" : 'onclick="return false"') + ">" + b + "</a>"
}
function bpshow_all(a) {
  a || (a = 2);
  window.open("#showall" + a)
}
function bpshow_allex(a) {
  a || (a = 2);
  if(a == 3) {
    a = {act:"a_album", oid:location.pathname.split("photo")[1].split("_")[0], aid:ph[0][1].split("/")[4]};
    (new Ajax(function(d, c) {
      var e = "", f = eval(c);
      for(i = 0;i < f.length;i++) {
        e += '<a href="http://' + vkhost + "/photo" + f[i][0] + '" target="_nk"><img src="' + f[i][f[i].length - 1] + '"></a>\n'
      }
      document.body.innerHTML = e;
      document.head.innerHTML = ""
    })).get("/photos.php", a)
  }else {
    var b = "";
    for(i = 0;i < ph.length;i++) {
      b += '<a href="http://' + vkhost + "/photo" + ph[i][0] + '" target="_nk"><img src="' + ph[i][a] + '"></a>\n'
    }
    document.body.innerHTML = b;
    document.head.innerHTML = ""
  }
}
function handleHash() {
  var a = window.location.hash.replace("#photo/", "");
  if(cur_photoc != a) {
    cur_photoc = a;
    for(var b = 0;b < ph.length;b++) {
      if(ph[b][0] == a) {
        selectCurrent(b, false);
        break
      }
    }
  }
}
function selectCurrent(a, b) {
  if(b) {
    location.href = "#photo/" + ph[a][0]
  }
  a = a >= 0 ? a : ph.length;
  a = a > ph.length ? 0 : a;
  current_page != Math.floor(a / pagesize) && pbshow_navbar(Math.floor(a / pagesize));
  a %= pagesize;
  for(var d = geTN(row, "td"), c = 0;c < d.length;c++) {
    d[c].className = c == a ? "cur" : "def"
  }
  quickBrowse.scrollLeft = (a - 1.7) * 136
}
function pbshow_navbar(a, b) {
  if(current_page != a) {
    if(a == undefined) {
      a = Math.floor(current / pagesize)
    }
    current_page = a;
    window.quick_nav_wrapper && pb.removeChild(quick_nav_wrapper);
    var d = document.createElement("div");
    d.style.width = "100%";
    d.align = "center";
    d.id = "quick_nav_wrapper";
    var c = document.createElement("div");
    c.id = "quickBrowse";
    c.setAttribute("style", "width:97%;overflow:auto;");
    c.setAttribute("class", "brphotd");
    if(a) {
      var e = document.createElement("div");
      e.setAttribute("style", "width:97%;text-align:left");
      f = getLink("goUp", "^ " + lang('prev') + " " + pagesize + " " + lang('photo') + " ^");
      e.innerHTML = f;
      e.addEventListener("click", function() {
        pbshow_navbar(a - 1, -1)
      }, false);
      d.appendChild(e)
    }
    var f = '<table><tr id="row">';
    e = a * pagesize;
    var g = e + (pagesize - 1);
    g = g > ph.length -1 ? ph.length - 1 : g;
    for(i = e;i <= g;i++) {
      f += '<td class="' + (i == e ? "cur" : "def") + '" onclick="selectCurrent(' + i + ',true)"><img src="' + ph[i][itemindex] + '"/></td>'
    }
    f += "</tr></table>";
    c.innerHTML = f;
    d.appendChild(c);
    if(g < ph.length - 1) {
      c = document.createElement("div");
      c.setAttribute("style", "width:97%;text-align:right");
      c.innerHTML = getLink("", "v " + lang('next') + " " + (ph.length - g < pagesize ? ph.length - g : pagesize) + " " + lang('photo') + " v");
      c.addEventListener("click", function() {
        pbshow_navbar(a + 1, +1)
      }, false);
      d.appendChild(c)
    }
    pb.appendChild(d);
    photoareaouter.addEventListener("click", function() {
      selectCurrent(window.this_id + 1)
    }, false);
    nextp.addEventListener("click", function() {
      selectCurrent(window.this_id + 1)
    }, false);
    prevp.addEventListener("click", function() {
      selectCurrent(window.this_id - 1)
    }, false);
    if(b > 0) {
      selectCurrent(e)
    }else {
      b < 0 && selectCurrent(g)
    }
  }
}
function switchQuickViewf(a) {
  a = a.target;
  setCookie("quickpbarhide", show_qnav);
  show_qnav = !show_qnav;
  a.innerHTML = show_qnav ? lang('hide') : lang('show');
  if(show_qnav) {
    pbshow_navbar();
    selectCurrent(current)
  }else {
    pb.removeChild(quick_nav_wrapper)
  }
}
function addBrowseBar() {
  if(window.ph) {
    pb = photoborder;
    if(pb[0]) {
      pb = pb[0]
    }
    pagesize = readCookieCfg("quickpbarsize", 100);
    show_qnav = getCookie("quickpbarhide") == "true" ? false : true;
    itemindex = parseInt(MS()._cfg.browsephotofull) + 1;
    var a = ". &nbsp;&nbsp;&nbsp;&nbsp;" + getLink("switchQuickView", show_qnav ? lang('hide') : lang('show'));
    a += ' <input id="pagesize_input" style="height:13px;width:43px" type="number" value="' + pagesize + '" /><br/>' + getLink("showallbutton", lang('showall')) + " (" + getLink("showallmin", lang('showmin')) + "/" + getLink("showallmax", lang('showmax')) + ")";
    photodate.innerHTML += a;
    pagesize_input.addEventListener("change", function() {
      pagesize = this.value;
      setCookie("quickpbarsize", pagesize);
      pbshow_navbar()
    }, false);
    showallmin.addEventListener("click", function() {
      bpshow_all(1)
    }, false);
    showallbutton.addEventListener("click", function() {
      bpshow_all(2)
    }, false);
    showallmax.addEventListener("click", function() {
      bpshow_all(3)
    }, false);
    switchQuickView.addEventListener("click", switchQuickViewf, false);
    current = window.this_id - 1;
    if(show_qnav) {
      pbshow_navbar();
      selectCurrent(current)
    }
  }
}
if(window.ph) {
  if(location.hash.substr(1, 7) == "showall") {
    bpshow_allex(location.hash.substr(8))
  }else {
    window.geByClass && addBrowseBar();
    window.addEventListener("hashchange", handleHash, false);
    handleHash()
  }
}
