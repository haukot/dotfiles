toWin1251=MS().toWin1251;
(function() {
  if(!window.geByClass)return;
  var b = window, f, m, k, l, g = 0; 
  vkcpe = {addLinks:true, addPhotos:true, addProposal:true};
  g = b.geByClass("closed_profile");
  if(!g.length)return;
  var n = b.ge, s = b.Ajax, q = function() {
    var j = window.profile_info, a = 0, d = function(c) {
      return function() {
        var e = n(c + "_text");
        return{id:c, header:n(c + "_head"), load:n(c + "_load"), setContent:function(h) {
          e.innerHTML = h
        }, append:function(h) {
          e.appendChild(h)
        }}
      }()
    };
    return{add:function() {
      var c = ["", "", false, false, j], e;
      for(e = arguments.length;e--;) {
        c[e] = arguments[e]
      }
      c[4].innerHTML+='<h4 class="simple">'+c[0]+'</h4>'+
      '<div id="additional'+a+'_load" class="clear_fix" style="display:'+(c[1]?'none':'block')+'"><!--img src="/images/upload.gif" alt="Loading" /--></div>'+
      '<div id="additional'+a+'_text" class="clear_fix">'+c[1]+'</div>';
      return d("additional" + a++)
    }}
  }(), r = function(j) {
    var a=$('<div class="profile_info">'),d;//
    return{table:a, addRow:function(c, e, h) {
      a.append($('<div class="clear_fix"><div class="label fl_l">'+c+'</div><div class="labeled fl_l">'+e+'</div></div>')[0]);
      return this
    }}
  };
  MS().reqUserReg();
  profileActions=window.profile_actions;
  if(window.profileActions && g.length) {
    g=cur.oid;
    if(g) {
      var t = profileActions, o = b.left_myphotos.replace(/.*\s/, "");
      if(b.vkcpe.addLinks) {
        t.innerHTML += ['<a href="/photos.php?id=', g, '">', MS().lang('useralb'), '</a><a href="/photos.php?id=', g, '&act=user">', b.All, " ", o, "</a>"].join("")
      }
      m = q.add(b.audio_edit_additionally, "", false, true);
      MS().userApi("id=" + g + "&photos=0-5&profile=" + g + "-" + g, function(j) {
        if(j.ok==-1){
          ge('additional0_text').innerText='Опция временно не доступна. Разработчик в курсе.';
        }
        f = j.profile;
        var a, d, c = f.sx - 1;
        switch(f.fs) {
          case 1:
            a = c ? "m_not_married" : "fm_not_married";
            break;
          case 2:
            a = c ? "m_has_friend" : "fm_has_friend";
            break;
          case 3:
            a = c ? "m_engaged" : "fm_engaged";
            break;
          case 4:
            a = c ? "m_married" : "fm_married";
            break;
          case 5:
            a = "complicated";
            break;
          case 6:
            a = "in_search"
        }
        a = a ? b["Family_" + a] : "";
        switch(f.pv) {
          case 1:
            d = "com";
            break;
          case 2:
            d = "soc";
            break;
          case 3:
            d = "moder";
            break;
          case 4:
            d = "liber";
            break;
          case 5:
            d = "cons";
            break;
          case 6:
            d = "mon";
            break;
          case 7:
            d = "ucons"
        }
        d = d ? b["Politics_" + d] : "";
        k = new r;
        a && k.addRow(b.Family, a);
        d && k.addRow(b.Politics, d);
        m.append(k.table[0]);
        s.Post({url:"select_ajax.php", query:{act:"a_get_country_info", country:f.ht.coi, fields:1}, onDone:function(h, i) {
          b.each(JSON.parse(i).cities, function() {
            if(this[0] == f.ht.cii) {
              k.addRow(b.Town, this[1] + " [" + f.ht.con + "]");
              return false
            }
          });
          b.hide(m.load);
          if(b.vkcpe.addPhotos) {
            if(j.photos.n) {
              var p = ['<table class="friendTable" cellpadding="0" cellspacing="0" border="0" height="100%"><tr>'];
              b.each(j.photos.d, function() {
                p.push('<td><table height="100%" border="0">', "<tr>", '<td height="100%" style="vertical-align: middle;">', '<a href="/photo', this[0], '">', '<img src="', this[1], '" />', "</a>", "</td>", "</tr>", "</table></td>")
              });
              p.push("</tr></table>");
              q.add(o, p.join(""))
            }
          }
        }});
        l = new r;
        for(var e in f.edu) {
          if(a = f.edu[e][2] < 100 ? 1 : 0) {
            l.addRow(a ? b.School : b.Univ, toWin1251(f.edu[e][3]) + " '" + f.edu[e][4])
          }
        }
        if(l.table.length) {
          m.append($('<h4 class="simple">'+b.profile_places_educ+'</h4>')[0]);
          m.append(l.table[0]);
        }
      })
    }
  }
})();
