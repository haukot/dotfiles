enyo.kind({
    name: "ArrayUtils",
    kind: "Component",
    statics: {
        
      getElementFromArrayById : function( myArray, uuid ) {
//          console.log("myArray.length: " + myArray.length);
//          console.log("uuid " + uuid);
          for (key in myArray) {
              var obj = myArray[key];
              if (obj.uuid == uuid) {
//                  console.log("found it: " + obj.name);
                  return obj;
              }
          }
//          console.log("did not found it");
          return null;
      },
      
      getElementPositionFromArrayById : function( myArray, uuid ) {
          // console.log("myArray.length: " + myArray.length);
          // console.log("id: " + id);
          for (key in myArray) {
              var obj = myArray[key];
              if (obj.uuid == uuid) {
                  return key;
              }
          }
          return null;
      },
      
      getImageFromArrayByFilename : function( myArray, fileName ) {
          // this.log("fileName: " + fileName);
          for (key in myArray) {
              var obj = myArray[key];
              if (obj.targetFilename == fileName) {
                  return obj;
              }
          }
          return null;
      },
      
      removeElement : function( myArray, item ) {
          var pos = -1;
          var i=0;
          // console.log("size: " + myArray.length);
          for (var key in myArray)
          {
              var obj = myArray[key];
              // console.log("obj.uuid: " + obj.uuid);
              if (obj == item) {
                  // this.log("found and removed item " + item.item_id + " from " + myArray);
                  pos = i;
                  break;
              }
              i++;
          }
          if (pos != -1) {
              myArray.splice( pos, 1); 
              return true; 
          } else {
              if (Util.isDebug()) {
                  console.log("not found item " + item + " in " + myArray);
              }
          } 
          return false;
      },
      
      removeByFilename : function( myArray, item ) {
          var pos = -1;
          var i=0;
          item = StringUtils.getFilenameFromURL( item );
          // console.log("size: " + myArray.length);
          for (var key in myArray)
          {
              var obj = myArray[key];
              obj = StringUtils.getFilenameFromURL( obj );
              // console.log("obj.uuid: " + obj.uuid);
              if (obj == item) {
                  // this.log("found and removed item " + item.item_id + " from " + myArray);
                  pos = i;
                  break;
              }
              i++;
          }
          if (pos != -1) {
              myArray.splice( pos, 1); 
              return true; 
          } else {
              if (Util.isDebug()) {
                  console.log("not found item " + item + " in " + myArray);
              }
          } 
          return false;
      },
      
      removeElementByUUID : function( myArray, uuid ) {
          var pos = -1;
          var i=0;
          if (Util.isDebug()) {
              console.log("size: " + myArray.length);
          }
          for (var key in myArray)
          {
              var obj = myArray[key];
              // console.log("obj.uuid: " + obj.uuid);
              if (obj.uuid == uuid) {
                  // this.log("found and removed item " + item.item_id + " from " + myArray);
                  pos = i;
                  break;
              }
              i++;
          }
          if (pos != -1) {
              myArray.splice( pos, 1);  
          } else {
              if (Util.isDebug()) {
                  console.log("not found item with uuid " + uuid + " in " + myArray);
              }
          } 
      },
      
      isElementInArray : function( myArray, url, prop ) {
          for (var key in myArray)
          {
              var obj = myArray[key];
              // this.log("obj.item_id: " + obj.item_id);
              if (prop !== undefined && prop != null) {
                  if (obj[prop] == url) {
                      // this.log("found and removed item " + item.item_id + " from " + myArray);
                      return true
                  }
                  
              } else {
                  if (obj == url) {
                      // this.log("found and removed item " + item.item_id + " from " + myArray);
                      return true
                  }
              }
          }
          return false;
      },
          
      
      sortSpringpadData : function( list, sortOrder ) {
          // console.log("list: " + list);
          // console.log("sortOrder: " + sortOrder);
          if (list == undefined || sortOrder == undefined) {
              return null;
          }
          
          if (list.length == 0) {
              return list;
          }
          
          // console.log("1");
          switch (Number(sortOrder)) {
              case 1: 
//                  if (this.isDebug()) {
//                      console.log("sortOrder: modified");
//                  }
                  // sort array of items depending on time_updated!
                  return list.sort(function(a,b) {  
                      var am = a.modified;
                      if (am === undefined) {
                          am = a.created;
                      }
                      am = StringUtils.getValueFromString(am);
                      
                      var bm = b.modified;
                      if (bm === undefined) {
                          bm = b.created;
                      }
                      bm = StringUtils.getValueFromString(bm);
                      
                      return Number(bm) - Number(am);
                  }); 
                  break;
              case 2:
//                  if (this.isDebug()) {
//                      console.log("sortOrder: added");
//                  }
                  // sort array of items depending on time_updated!
                  return list.sort(function(a,b) {  
                      var am = StringUtils.getValueFromString(a.created);
                      var bm = StringUtils.getValueFromString(b.created);
                      
                      return Number(bm) - Number(am);
                  }); 
                  break;
              case 3:
//                  if (this.isDebug()) {
//                      console.log("sortOrder: name");
//                  }
                  // sort array of items depending on time_updated!
                  return list.sort(function(a,b) {  
                      // this.log(" +----> b: " + b.time_updated + ", a: " + a.time_updated);
                      // return a.oldTitle > b.oldTitle;
                      var A = "";
                      if (a.name !== undefined) {
                          A = String(a.name).toLowerCase();
                      }
                      // console.log("a: " + JSON.stringify(a));
                      // console.log("A: " + A);
                      var B = "";
                      if (b.name !== undefined) { 
                          B = String(b.name).toLowerCase();
                      }
                      // console.log("b: " + JSON.stringify(b));
                      // console.log("B: " + B);
                      if (A < B){
                         return -1;
                      }else if (A > B){
                        return  1;
                      }else{
                        return 0;
                      }
                  }); 
                  break;
              case 4:
//                  if (this.isDebug()) {
//                      console.log("sortOrder: type");
//                  }
                  // sort array of items depending on time_updated!
                  return list.sort(function(a,b) {  
                      // this.log(" +----> b: " + b.time_updated + ", a: " + a.time_updated);
                      // return a.oldTitle > b.oldTitle;
                      var A = StringUtils.getValueFromString(a.type);
                      var B = StringUtils.getValueFromString(b.type);
                      if (A < B){
                         return -1;
                      }else if (A > B){
                        return  1;
                      }else{
                        return 0;
                      }
                  }); 
                  break;
                  
                  // var type = this.owner.$.dataManager.getValueFromString( inRecord.type );
              case 5:
//                  if (this.isDebug()) {
//                      console.log("sortOrder: rating");
//                  }
                  // sort array of items depending on rating!
                  return list.sort(function(a,b) {  
                      var am = (a.properties.personalRating !== undefined ? a.properties.personalRating : 0);
                      var bm = (b.properties.personalRating !== undefined ? b.properties.personalRating : 0);
                      
                      return Number(bm) - Number(am);
                  }); 
                  break;
              default: 
                  console.error("unknown sortOrder: " + sortOrder);
                  break;
          } 
          
          return list;
      },

      sortPocketData : function( list, sortOrder ) {
          // console.log("list: " + list);
          console.log("sortOrder: " + sortOrder);
          if (list == undefined || sortOrder == undefined) {
              return null;
          }
          
          if (list.length == 0) {
              return list;
          }
          
          // console.log("1");
          switch (Number(sortOrder)) {
              case 1: 
                  console.log("sortOrder: newest");
                  // sort array of items depending on time_updated!
                  return list.sort(function(a,b) {  
                      // this.log(" +----> b: " + b.time_updated + ", a: " + a.time_updated);
                      return b.time_added - a.time_added;
                  }); 
                  break;
              case 2:
                  console.log("sortOrder: oldest");
                  // sort array of items depending on time_updated!
                  return list.sort(function(a,b) {  
                      // this.log(" +----> b: " + b.time_updated + ", a: " + a.time_updated);
                      return a.time_added - b.time_added;
                  }); 
                  break;
              case 3:
                  console.log("sortOrder: title");
                  // sort array of items depending on time_updated!
                  return list.sort(function(a,b) {  
                      // this.log(" +----> b: " + b.time_updated + ", a: " + a.time_updated);
                      // return a.oldTitle > b.oldTitle;
                      var A = a.oldTitle.toLowerCase();
                      var B = b.oldTitle.toLowerCase();
                      if (A < B){
                         return -1;
                      }else if (A > B){
                        return  1;
                      }else{
                        return 0;
                      }
                  }); 
                  break;
              case 4:
                  console.log("sortOrder: url");
                  // sort array of items depending on time_updated!
                  return list.sort(function(a,b) {  
                      var A = a.url.toLowerCase();
                      var B = b.url.toLowerCase();
                      if (A < B){
                         return -1;
                      }else if (A > B){
                        return  1;
                      }else{
                        return 0;
                      }
                  }); 
                  break;
/*                default: 
                  console.error("unknown sortOrder: " + sortOrder);
                  break;*/
          } 
          
          return list;
      },

      getThemeByName : function( inArray, inName ) {
          // console.log("inArray: " + inArray);
          // console.log("inName: " + inName);

          if (inArray !== undefined && inName !== undefined && inArray !== null && inArray.length > 0 && inName != "") {
              for (key in inArray) {
                  // console.log("key: " + key);
                  var obj = inArray[key];
                  // console.log("obj: " + enyo.json.stringify(obj));
                  // console.log("obj.name: " + obj.name);
                  // console.log("obj.headerBackgroundColor: " + obj.headerBackgroundColor);
                  if (obj.key == inName) {
                      // console.log("found it: " + obj.key);
                      return obj;
                  }
              }
          }   
          // console.log("did not found it...");
          return { "headerBackgroundColor":"#6e88a4", "headerForegroundColor":"#FFFFFF", "hidden":true };
      },
      
      getAccentByName : function( inArray, inName ) {
          // console.log("inArray: " + inArray);
          // console.log("inName: " + inName);

          if (inArray !== undefined && inName !== undefined && inArray !== null && inArray.length > 0 && inName != "") {
              for (key in inArray) {
                  // console.log("key: " + key);
                  var obj = inArray[key];
                  // console.log("obj: " + enyo.json.stringify(obj));
                  // console.log("obj.name: " + obj.name);
                  // console.log("obj.headerBackgroundColor: " + obj.headerBackgroundColor);
                  if (obj.key == inName) {
                      // console.log("found it: " + obj.name);
                      return obj;
                  }
              }
          }   
          // console.log("did not found it...");
          return { "headerBackgroundColor":"#6e88a4", "headerForegroundColor":"#FFFFFF", "hidden":true };
      },
      
      
      /******************************************
       *  POCKET STUFF - START
       ******************************************/

      getElementFromArrayByItemId : function( myArray, id ) {
          // console.log("myArray.length: " + myArray.length);
          // console.log("id: " + id);
          for (key in myArray) {
              var obj = myArray[key];
              // console.log("obj.item_id: " + obj.item_id);
              if (obj.item_id == id) {
                  // console.log(" FOUND IT!!!");
                  return obj;
              }
          }
          return null;
      },
      
      isURLinArray : function( myArray, url ) {
          // console.log("myArray.length: " + myArray.length);
          // console.log("id: " + id);
          for (key in myArray) {
              var obj = myArray[key];
              // console.log("obj.item_id: " + obj.item_id);
              if (obj == url) {
                  // console.log(" FOUND IT!!!");
                  return true;
              }
          }
          return false;
      },
      
      getElementFromArrayByFilename : function( myArray, filename ) {
          // console.log("myArray.length: " + myArray.length);
          // console.log("id: " + id);
          for (key in myArray) {
              var obj = myArray[key];
              if (obj.targetFilename == filename) {
                  return obj;
              }
          }
          return null;
      },
            
      removeElementByItemId : function( myArray, item ) {
          // console.log("item: " + JSON.stringify(item));
          var pos = -1;
          var i=0;
          for (var key in myArray)
          {
              var obj = myArray[key];
              // this.log("obj.item_id: " + obj.item_id);
              if (obj.item_id == item.item_id) {
                  // console.log("found and removed item " + item.item_id);
                  pos = i;
                  break;
              }
              i++;
          }
          if (pos != -1) {
              myArray.splice( pos, 1);  
          } else {
              // console.log("not found item " + item.item_id + " in " + myArray);
          } 
      },
      
      /******************************************
       *  POCKET STUFF - END
       ******************************************/
    },
});

