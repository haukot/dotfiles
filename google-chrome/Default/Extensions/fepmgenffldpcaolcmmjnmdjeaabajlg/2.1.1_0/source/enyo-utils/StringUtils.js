enyo.kind({
    name: "StringUtils",
    kind: "Component",
    statics: {
        
      getHostname : function ( str ) {
          if (str == null || str === undefined) {
              return "";
          }
          var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
          if (str.match(re) != null) {
              var hostname = str.match(re)[1].toString();
              if (hostname.indexOf("www.") == 0) {
                  hostname = hostname.substr(4, hostname.length);
              } 
              return hostname;
          }
          return str;
      },
      
      getFilenameFromURL : function( url ) {
          if (url !== undefined && url != null) {
              url = String(url).replace(/^.*[\\\/]/, '');
              url = url.substring(0, (url.indexOf("&") == -1) ? url.length : url.indexOf("&"));
              url = url.substring(0, (url.indexOf("#") == -1) ? url.length : url.indexOf("#"));
              url = url.substring(0, (url.indexOf("?") == -1) ? url.length : url.indexOf("?"));
              return url;
          }
          return "";
      },
  
      getRandomString : function () {
          var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
          var string_length = 8;
          var randomstring = '';
          for (var i=0; i<string_length; i++) {
              var rnum = Math.floor(Math.random() * chars.length);
              randomstring += chars.substring(rnum,rnum+1);
          }
          return randomstring;
      },
      
      convertToHTML : function (oldString) {
          oldString = oldString.replace(/ä/g, '&auml;');
          oldString = oldString.replace(/ü/g, '&uuml;');
          oldString = oldString.replace(/ö/g, '&ouml;');
          oldString = oldString.replace(/Ä/g, '&Auml;');
          oldString = oldString.replace(/Ü/g, '&Uuml;');
          oldString = oldString.replace(/Ö/g, '&Ouml;');
          oldString = oldString.replace(/&nbsp;/g, ' ');
          oldString = oldString.replace(/ß/g, '&szlig;');
          oldString = oldString.replace(/…/g, '&hellip;');
          oldString = oldString.replace(/‘/g, '&lsquo;');
          oldString = oldString.replace(/’/g, '&rsquo;');
          oldString = oldString.replace(/“/g, '&ldquo;');
          oldString = oldString.replace(/”/g, '&rdquo;');
          oldString = oldString.replace(/"/g, '&quot;;');
          return oldString;
      },
      
      stripHTML : function (oldString) {
          oldString = oldString.replace(/<.*?>/g, '');
          oldString = oldString.replace(/&auml;/g, 'ä');
          oldString = oldString.replace(/&uuml;/g, 'ü');
          oldString = oldString.replace(/&ouml;/g, 'ö');
          oldString = oldString.replace(/&Auml;/g, 'Ä');
          oldString = oldString.replace(/&Uuml;/g, 'Ü');
          oldString = oldString.replace(/&Ouml;/g, 'Ö');
          oldString = oldString.replace(/&nbsp;/g, ' ');
          oldString = oldString.replace(/&szlig;/g, 'ß');
          oldString = oldString.replace(/&hellip;/g, '…');
          oldString = oldString.replace(/&lsquo;/g, '‘');
          oldString = oldString.replace(/&rsquo;/g, '’');
          oldString = oldString.replace(/&ldquo;/g, '“');
          oldString = oldString.replace(/&rdquo;/g, '”');
          return oldString;
      },
      
      stripHtmlCodes : function ( str ) {
          if (str == "" || str == null || str === undefined) {
              return str;
          }
          str = str.replace(/ class=[^\s|>]*/g, "");
          str = str.replace(/ style=\"[^>]*\"/g, "");
          str = str.replace(/ align=[^\s|>]*/g, "");  
          str = str.replace(/<\/?font[^>]*>/g, "");  
          str = str.replace(/<\/?iframe[^>]*>/g, "");  
          str = str.replace(/<\/?pre[^>]*>/g, "");  
          return str;
      },
      
      encodeString : function ( s ) {
          // s = encodeURIComponent(s);
          // Now replace the values which encodeURIComponent doesn't do
          // encodeURIComponent ignores: - _ . ! ~ * ' ( )
          // OAuth dictates the only ones you can ignore are: - _ . ~
          // Source: http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Functions:encodeURIComponent
          s = s.replace(/\#/g, "%23");
          // s = s.replace(/\*/g, "%2A");
          // s = s.replace(/\'/g, "%27");
          // s = s.replace(/\(/g, "%28");
          // s = s.replace(/\)/g, "%29");
          return s;        
      },
      
      getValueFromString : function( str ) {
          if (str !== undefined && str != null) {
              var posStart = str.indexOf("(");
              var posEnd = str.lastIndexOf(")");
              var value = str.substring(posStart+1, posEnd);
              return value;
          } else {
              return null;                
          }  
      },
      
      applyFilterHighlight : function( inText, inSearchString, className) {
          
          if (inText === undefined || inText == "undefined") {
              return "";
          }
          
          // 1. match
          var regex = new RegExp(inSearchString,"gi");
          var regex2 = new RegExp(inSearchString,"i");
          if (regex.test(inText)) {
              // 2. search
              var original = inText.match(regex);
              // console.log("original: " + original);
              
              var newString = "";
              var tmpString = "";
              var restString = inText;
              var counter = 0;
              var pos = inText.search(regex);
              while (pos != -1 && counter < original.length) {
                  tmpString = restString.substring(0, Number(pos)+ Number(inSearchString.length));
                  // console.log("tmpString: " + tmpString);
                  tmpString = tmpString.replace(regex2,"<span class=\"" + className + "\">" + original[counter] + "</span>");
                  // console.log("tmpString: " + tmpString);
                  newString += tmpString;
                  // console.log("newString: " + newString);
                  
                  restString = restString.substring(Number(pos)+ Number(inSearchString.length), restString.length);
                  // console.log("restString: " + restString);

                  counter++;
                  pos = restString.search(regex);
              }
              
              return newString + restString;
          }
          
          return inText;
      },
      
      
      createLink : function( str ) {
          return String(str).replace(/(http:\/\/[^\s()]+)/g, "<a href='$1'>$1</a>")
      },
      

    },
    
    published: {
    	mimeTypeTable: {
            '.aif': 'audio/aiff',
            '.aifc':    'audio/aiff',
            '.aiff':    'audio/aiff',
            '.art': 'image/x-jg',
            '.asf': 'video/x-ms-asf',
            '.au':  'audio/basic',
            '.avi': 'video/avi',
            '.avs': 'video/avs-video',
            '.bin': 'application/octet-stream',
            '.bm':  'image/bmp',
            '.bmp': 'image/bmp',
            '.doc': 'application/msword',
            '.docx':    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.dot': 'application/msword',
            '.dv':  'video/x-dv',
            '.dvi': 'application/x-dvi',
            '.exe': 'application/octet-stream',
            '.gif': 'image/gif',
            '.gl':  'video/gl',
            '.gz':  'application/x-compressed',
            '.htm': 'text/html',
            '.html':    'text/html',
            '.ico': 'image/x-icon',
            '.jam': 'audio/x-jam',
            '.jfif':    'image/jpeg',
            '.jfif-tbnl':   'image/jpeg',
            '.jpe': 'image/jpeg',
            '.jpeg':    'image/jpeg',
            '.jpg': 'image/jpeg',
            '.kar': 'audio/midi',
            '.la':  'audio/nspaudio',
            '.log': 'text/plain',
            '.m1v': 'video/mpeg',
            '.m2a': 'audio/mpeg',
            '.m2v': 'video/mpeg',
            '.mid': 'audio/midi',
            '.midi':    'audio/midi',
            '.mjpg':    'video/x-motion-jpeg',
            '.mov': 'video/quicktime',
            '.movie':   'video/x-sgi-movie',
            '.mp2': 'audio/mpeg',
            '.mp3': 'audio/mpeg3',
            '.mpa': 'video/mpeg',
            '.mpe': 'video/mpeg',
            '.mpeg':    'video/mpeg',
            '.mpg': 'video/mpeg',
            '.mpga':    'audio/mpeg',
            '.mpp': 'application/vnd.ms-project',
            '.mv':  'video/x-sgi-movie',
            '.pct': 'image/x-pict',
            '.pcx': 'image/x-pcx',
            '.pdf': 'application/pdf',
            '.png': 'image/png',
            '.pot': 'application/vnd.ms-powerpoint',
            '.ppa': 'application/vnd.ms-powerpoint',
            '.pps': 'application/vnd.ms-powerpoint',
            '.ppt': 'application/vnd.ms-powerpoint',
            '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            '.ppz': 'application/mspowerpoint',
            '.pwz': 'application/vnd.ms-powerpoint',
            '.rmi': 'audio/mid',
            '.rpm': 'audio/x-pn-realaudio-plugin',
            '.snd': 'audio/basic',
            '.text':    'text/plain',
            //'.tif':   'image/tiff',
            //'.tiff':  'image/tiff',
            '.txt': 'text/plain',
            '.uu':  'text/x-uuencode',
            '.uue': 'text/x-uuencode',
            '.vcf': 'text/x-vcard',
            '.vcs': 'text/x-vcalendar',
            '.vdo': 'video/vdo',
            '.viv': 'video/vivo',
            '.vivo':    'video/vivo',
            '.w6w': 'application/msword',
            '.wav': 'audio/wav',
            '.wiz': 'application/msword',
            '.word':    'application/msword',
            '.xlb': 'application/vnd.ms-excel',
            '.xlc': 'application/vnd.ms-excel',
            '.xll': 'application/vnd.ms-excel',
            '.xlm': 'application/vnd.ms-excel',
            '.xls': 'application/vnd.ms-excel',
            '.xlsx':    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            '.xlw': 'application/vnd.ms-excel',
            '.xm':  'audio/xm',
            '.xml': 'text/xml',
            '.xmz': 'xgl/movie',
    //      '.xpm': 'image/x-xpixmap',
            '.xpm': 'image/xpm',
            '.x-png':   'image/png',
            '.zip': 'application/zip'
    	}
    }
});

