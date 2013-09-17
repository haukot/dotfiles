

var Property = (function() {
    
    return {
        
        getValue : function( item, name ) {
            var pos = String(name).indexOf(".");
            if (Util.isDebug()) {
            	console.log("START");
            	console.log("item: " + JSON.stringify(item));
            	console.log("name: " + name);
            	console.log("pos: " + pos);
            }
           if (pos == -1) {
               // this.log("old value: " + item[name]);
        	   newValue = item[ name ];
               if (Util.isDebug()) {
            	   console.log("value: " + newValue);
               }
           } else {
               var strObj = String(name).substring(0, pos);
               if (Util.isDebug()) {
            	   console.log("strObj: " + strObj);
               }

               var strNestedObj = String(name).substring(pos+1, String(name).length);
               if (Util.isDebug()) {
            	   console.log("strNestedObj: " + strNestedObj);
               }

               var newObj = item[strObj];
               if (Util.isDebug()) {
            	   console.log("newObj: " + newObj);
               }

               if (newObj !== undefined) {
                   this.getValue( newObj, strNestedObj );
               } else {
            	   console.error("could not get the property...");
               }
           }
           if (Util.isDebug()) {
        	   console.log("END");
           }
           return newValue;
        },
    
    };

})();

