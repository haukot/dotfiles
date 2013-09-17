enyo.kind({
    name: "Util",
    kind: "Component",
    statics: {

      fetchAppInfo : function() {
    	  console.log();
    	  var response = Util.loadFile("./assets/appinfo.json");
    	  return (response != null ? JSON.parse(response) : null);
      },

      loadFile : function ( filename ) 
      { 
//          if (this.isDebug()) {
//              console.log("filename: " + filename);
//          }
          var xmlHTTP = new XMLHttpRequest(); 
          try 
          { 
              xmlHTTP.open("GET", filename, false); 
              xmlHTTP.send(null); 
          } 
          catch (e) { 
              console.error("filename: " + filename);
              console.error("error: " + e);
              return null; 
          } 
          
          // console.log("xmlHTTP: " + JSON.stringify( xmlHTTP) );
          // console.log("xmlHTTP.responseText: " + xmlHTTP.responseText );
          return xmlHTTP.responseText; 
      },
      
      loadBinaryFile : function( url ) {
          // console.log("url: " + url);
          
          var xmlHTTP = new XMLHttpRequest();
          try 
          { 
              xmlHTTP.open("GET", url, false); 
              // xmlHTTP.responseType = "blob";
              xmlHTTP.overrideMimeType('text\/plain; charset=x-user-defined'); 
              xmlHTTP.send(null); 
          } 
          catch (e) { 
              console.error("url: " + url);
              console.error("error: " + e);
              return null; 
          } 
          
          // console.log("xmlHTTP: " + JSON.stringify( xmlHTTP) );
          // console.log("xmlHTTP.responseText: " + xmlHTTP.responseText );
          return xmlHTTP.responseText; 
      },
      
      saveFile : function ( filename, content ) 
      { 
          // console.log("filename: " + filename);
          // console.log("content: " + content);
          // console.log("content.length: " + content.length);
          var xmlHTTP = new XMLHttpRequest(); 
          try 
          { 
              xmlHTTP.open("POST", filename, false); 
              xmlHTTP.setRequestHeader("Content-type", "application/json;charset=UTF-8");
              xmlHTTP.setRequestHeader("Content-length", content.length);
              // xmlHTTP.setRequestHeader("Connection", "close");
              xmlHTTP.send(content); 
          } 
          catch (e) { 
              console.error("error: " + e);
              return null; 
          } 
          
          // console.log("xmlHTTP: " + JSON.stringify( xmlHTTP) );
          // console.log("xmlHTTP.responseText: " + xmlHTTP.responseText );
          return xmlHTTP.responseText; 
      },
      
      isDebug : function( ) {
          if (Settings.getSettings().debugOutput == true || Settings.getSettings().debugOutput == "true") {
              return true;
          }
          return false;
      }, 
      
      syncIsStillActive : function( ) {
          if (Settings.getSettings().lastActivity == "") {
        	  Settings.setItem("syncInProgress", false);
              Settings.getSettings( true );
              return false;
          }
          
          var ts = new Date();
          
          var oldDate = new Date();
          oldDate.setTime(Settings.getSettings().lastActivity);
          
          var diff = DateTimeUtils.minutes_between(ts, oldDate);
          // console.log("last activity " + diff + " minutes ago...");
          if (diff > 1) {
        	  Settings.setItem("syncInProgress", false);
        	  Settings.getSettings( true );
              return false;
          } 

          return true;
      },
      
      getClassName : function( className ) {
          if (Platform.isTablet() == true) {
              return className;
          }
          return className + "-mobile";
      },
      
      getAbsolutPixel : function( what, faktor, minus ) {
          var pixel = Platform.screenWidth;
          if (what == "h") {
              pixel = Platform.screenHeight;
          }
          if (Platform.isPlaybook()) {
              pixel = screen.width;
              if (what == "h") {
                  pixel = screen.height;
              }
          }
          // console.log("pixel: " + pixel);
          var result = 0;
          if (minus !== undefined) {
              result = Math.round( pixel * faktor ) - Number( minus ) + "px";
          } else {
              result = Math.round( pixel * faktor ) + "px";
          }
          // console.log("result: " + result);
          return result;
      },
      
      getMinContentHeight : function( ) {
          var h = Number(Platform.screenHeight);
          if (Platform.isPlaybook()) {
              h = screen.height;
          }
          var ch = Number(h - 385);
          return Math.round( ch * 0.9 ) + "px";
      },
      
      base64ArrayBuffer: function (arrayBuffer) {
        var base64    = ''
        var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
      
        var bytes         = new Uint8Array(arrayBuffer)
        var byteLength    = bytes.byteLength
        var byteRemainder = byteLength % 3
        var mainLength    = byteLength - byteRemainder
      
        var a, b, c, d
        var chunk
      
        // console.log("mainLength: " + mainLength);
      
        // Main loop deals with bytes in chunks of 3
        for (var i = 0; i < mainLength; i = i + 3) {
          // Combine the three bytes into a single integer
          chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]
      
          // Use bitmasks to extract 6-bit segments from the triplet
          a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
          b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
          c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
          d = chunk & 63               // 63       = 2^6 - 1
      
          // Convert the raw binary segments to the appropriate ASCII encoding
          base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
        }
      
        // Deal with the remaining bytes and padding
        if (byteRemainder == 1) {
          chunk = bytes[mainLength]
      
          a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2
      
          // Set the 4 least significant bits to zero
          b = (chunk & 3)   << 4 // 3   = 2^2 - 1
      
          base64 += encodings[a] + encodings[b] + '=='
        } else if (byteRemainder == 2) {
          chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]
      
          a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
          b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4
      
          // Set the 2 least significant bits to zero
          c = (chunk & 15)    <<  2 // 15    = 2^4 - 1
      
          base64 += encodings[a] + encodings[b] + encodings[c] + '='
        }
        
        return base64
      },    
      
      getNotebookNames : function( notebook ) {
          if (notebook != null && notebook !== undefined && notebook.length == null) {
              return notebook.name ;
          } else if (notebook.length != null && notebook.length > 0) {
              var str = "";
              for (key in notebook) {
                  str += notebook[key].name + ", ";
              }
              str = str.substr(0, str.length-2);
              return str ;
          } else {
              return $L( "All My Stuff" );
          }
      },

      createUuid : function( strType ) {
         var chars = '0123456789abcdef'.split('');
      
         var uuid = [], rnd = Math.random, r;
         uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
         uuid[14] = '4'; // version 4
      
         var shard = Settings.getSettings().shard;
         if (this.isDebug()) {
             console.log("shard: " + shard);
         }
      
         uuid[0] = shard[0];
         uuid[1] = shard[1];
         
         // 1 is for Type, 3 for Block, and 4 for User
         var type = 3;
         if (strType !== undefined) {
             if (strType.toLowerCase() == "type") {
                 type = 1;
             } else if (strType.toLowerCase() == "user") {
                 type = 4;                           
             }
         }
         uuid[2] = type;
      
         for (var i = 3; i < 36; i++) {
            if (!uuid[i]) {
               r = 0 | rnd()*16;
      
               uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r & 0xf];
            }
         }
      
         return uuid.join('');
      },
      
      finagleMimeType : function(filepath, originalMimetype) {
          var extension, newType;
          var mimetype = originalMimetype;
          
          // octet-stream is mostly useless, treat it as undefined.
          if(mimetype === 'application/octet-stream') {
              mimetype = undefined;
          }
          
          // For text/plain types, we use the filename extension to try to find a more specific text type.
          // If mimetype is undefined, we'll use whatever we can find from the extension.
          if(mimetype === undefined || mimetype === "text/plain") {
              extension = Util.getExtension(filepath);
              if(extension) {
                  newType = Util.mimeTypeTable['.'+extension];
                  if(newType && (mimetype === undefined || newType.indexOf("text/") === 0)) {
                      mimetype = newType;
                  }
              }
          }
          
          return mimetype || originalMimetype;
      },
      
      getExtension : function (str) {
          if (!str) {
              return undefined;
          }
          var extIdx = str.lastIndexOf('.');
          if (extIdx < 0) {
              return undefined;
          }
          return str.substring(extIdx + 1).toLowerCase();
      },       
      
      utf8_to_b64 : function ( str ) {
          return window.btoa(unescape(encodeURIComponent( str )));
      },
      
      b64_to_utf8 : function ( str ) {
          return decodeURIComponent(escape(window.atob( str )));
      },
      
      base64Encode : function (str) {
          var CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
          var out = "", i = 0, len = str.length, c1, c2, c3;
          while (i < len) {
              c1 = String(str).charCodeAt(i++) & 0xff;
              if (i == len) {
                  out += CHARS.charAt(c1 >> 2);
                  out += CHARS.charAt((c1 & 0x3) << 4);
                  out += "==";
                  break;
              }
              c2 = String(str).charCodeAt(i++);
              if (i == len) {
                  out += CHARS.charAt(c1 >> 2);
                  out += CHARS.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
                  out += CHARS.charAt((c2 & 0xF) << 2);
                  out += "=";
                  break;
              }
              c3 = String(str).charCodeAt(i++);
              out += CHARS.charAt(c1 >> 2);
              out += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
              out += CHARS.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
              out += CHARS.charAt(c3 & 0x3F);
          }
          return out;
      },

      getPublicUrl : function( item, notebook ) {
      	var link = '';
      	
          if (Util.isDebug()) {
          	console.log("START");
          }
          var hasSource = (enyo.isArray(item.properties.sources) && item.properties.sources.length > 0 ? true : false);
          if (Util.isDebug()) {
          	console.log("hasSource: " + hasSource);
          }
          
          var tmp = false;
          // this.log("notebook: " + JSON.stringify(notebook) );
          if (Util.isDebug()) {
          	console.log("notebook.properties[/meta/url]: " + notebook.properties["/meta/url"] );
          }
          if (notebook.properties["/meta/published"] !== undefined) {
              tmp = notebook.properties["/meta/published"];
          }
          var hasPublicNotebook = tmp;
          if (Util.isDebug()) {
          	console.log("hasPublicNotebook: " + hasPublicNotebook);
          }
          
          if (hasSource) {
              link = item.properties.sources[ item.properties.sources.length -1 ].value;
          }
          if (hasPublicNotebook && notebook !== null) {
              if (Util.isDebug()) {
              	console.log("item: " + JSON.stringify(item) );
              }
              var nUrl = "notebooks" + String(notebook.properties["/meta/url"]).substring(8, notebook.properties["/meta/url"].length);
              link = "http://springpad.com/#!/" + Util.getSettings().username + "/" + nUrl + "/blocks/" + item.properties["/meta/url"];
          }
          if (Util.isDebug()) {
          	console.log("this.link: " + this.link);
          }
          
          return link;
      },

      getFileNameFromObject : function( obj ) {
          var fn = (obj.properties["/media/file_name"] !== undefined ? obj.properties["/media/file_name"] : obj.name);
          if (fn === undefined || fn == "undefined") {
              fn = StringUtils.getFilenameFromURL( obj.image );
          }
          return fn;
      },

      getPixel : function( px ) {
          return Number(Number(px) * Number(Platform.pixelRatio));
      },
      

    },
    
});

Util.mimeTypeTable = {
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
};

