$(function() {
	restore_options();
	$("#tabs").tabs(  {
        selected: defaulttab,
        select: function(e, ui) {
            loadtab(String(ui.index)); 
            return true;
        }
	});
})
function loadipv4() {
	if ($('#ipv4').html()=='')
		chrome.tabs.query( {'active': true, currentWindow: true}, function(tabArray) {
			$('#ipv4').html('<p>Getting IPv4 Address information....<img src="http://www.tcpiputils.com/images/loading.gif" /></p>');
			$('#ipv4').load('http://www.tcpiputils.com/inc/tools.php?browseipv4='+getHostname(tabArray[0].url)+'&source=chromeext');
			_gaq.push(['_trackEvent', 'ip-address', getHostname(tabArray[0].url), 'chromeext']);
		});
}
function loadipv6() {
	if ($('#ipv6').html()=='')
		chrome.tabs.query( {'active': true, currentWindow: true}, function(tabArray) {
			$('#ipv6').html('<p>Getting IPv6 Address information....<img src="http://www.tcpiputils.com/images/loading.gif" /></p>');
			$('#ipv6').load('http://www.tcpiputils.com/inc/tools.php?browseipv6='+getHostname(tabArray[0].url)+'&source=chromeext');
			_gaq.push(['_trackEvent', 'ipv6-address', getHostname(tabArray[0].url), 'chromeext']);
		});
}
function loadisp() {
	if ($('#isp').html()=='')
		chrome.tabs.query( {'active': true, currentWindow: true}, function(tabArray) {
			$('#isp').html('<p>Getting ISP information....<img src="http://www.tcpiputils.com/images/loading.gif" /></p>');
			$('#isp').load('http://www.tcpiputils.com/inc/tools.php?browseas='+getHostname(tabArray[0].url)+'&source=chromeext');
			_gaq.push(['_trackEvent', 'as', getHostname(tabArray[0].url), 'chromeext']);
		});
}
function loaddomain() {
	if ($('#domain').html()=='')
		chrome.tabs.query( {'active': true, currentWindow: true}, function(tabArray) {
			$('#domain').html('<p>Getting Domain information....<img src="http://www.tcpiputils.com/images/loading.gif" /></p>');
			$('#domain').load('http://www.tcpiputils.com/inc/tools.php?browsedomain='+getHostname(tabArray[0].url)+'&source=chromeext');
			_gaq.push(['_trackEvent', 'domain', getHostname(tabArray[0].url), 'chromeext']);
		});
}
function loadmyip() {
	if ($('#myip').html()=='') {
		$('#myip').html('<p>Getting My IP Address information....<img src="http://www.tcpiputils.com/images/loading.gif" /></p>');
		$('#myip').load('http://www.tcpiputils.com/inc/tools.php?myip=1&source=chromeext');
		_gaq.push(['_trackEvent', 'ip-address', 'myip', 'chromeext']);
	}
}
function restore_options() {
  defaulttab = localStorage["defaulttab"];
  if (!defaulttab) {
	localStorage["defaulttab"] = "0";
	defaulttab= "0";
	return;
  }
  var select = document.getElementById("defaulttab");
  for (var i = 0; i < select.children.length; i++) {
	var child = select.children[i];
	if (child.value == defaulttab) {
	  child.selected = "true";
	  break;
	}
  }
}
function loadtab(tab) {
	switch(tab) {
	case "1":
	  loadipv6();
	  break;
	case "2":
	  loadisp();
	  break;
	case "3":
	  loaddomain();
	  break;
	case "4":
	  loadmyip();
	default:
	  loadipv4();
	}
};
function ChangeDefaultTab() {
	localStorage['defaulttab'] = this.options[this.selectedIndex].value;
};

document.addEventListener('DOMContentLoaded', function () {
  loadtab(defaulttab);
  document.querySelector('#defaulttab').addEventListener('change', ChangeDefaultTab);
});

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-15589237-1']);
_gaq.push(['_gat._anonymizeIp']);
_gaq.push(['_trackPageview']);
(function() {
var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
ga.src = 'https://ssl.google-analytics.com/ga.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

(function() {
	var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
	po.src = 'https://apis.google.com/js/plusone.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
})();

function SelectAll(id) {
    document.getElementById(id).focus();
    document.getElementById(id).select();
}
function getHostname(str) {
	var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
	return str.match(re)[1].toString();
};