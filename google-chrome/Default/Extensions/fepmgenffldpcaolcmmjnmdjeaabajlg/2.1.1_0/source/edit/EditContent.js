enyo.kind({
    name: "EditContent",
    kind: "enyo.Control",
    /*style: "background-color: yellow;",*/
    width: "100%",
    events: {
        onCloseDialog: "",
        onSaveItem: "",
        onCreateItem: "",
    },
    components: [
        {name: "scroller", kind: enyo.Scroller, flex: 1, height: (Platform.isTablet() ? Util.getAbsolutPixel( "h", 0.94, 150) : (Platform.isTouchpadOrPre3() ? "360px" : "250px")), autoHorizontal: false, horizontal: false, components: [
            
        ]},
        {flex: 1},
        {layoutKind: "HFlexLayout", flex: 1, style: "margin-top: 10px", components: [
            {name: "discardButton", kind: "Button", caption: (Platform.isTablet() ? $L("Cancel ") : $L("Cancel")), flex: 1, className: "enyo-button-dark", onclick: "closeParentDialog"},
            {name: "saveButton", kind: "ActivityButton", caption: $L("Save"), flex: 1, className: "enyo-button", onclick: "save"},
        ]},
        {name: "notebookDialog", kind: "NotebookDialog", onCreateNotebook: "onCreateNotebook"},
        {name: "tagDialog", kind: "TagDialog"},
    ],
    
    published: {
        type: null,
        notebook: null,
        item: null,
        originalItem: null,
        isDirty: false,
        title: "",
        content: "",
        notebooks: "",
        tags: "",
        createString: '',
    },
    
    create : function() {
        this.inherited(arguments);
        
        
        // create properties
        // this.log("this.properties: " + JSON.stringify(this.properties));
        this.props = ObjectDescription.getProperties( this.type );
        // this.log("this.props: " + JSON.stringify(this.props));
        var sw = (Platform.isBlackBerry() ? "width: 93%;" : "");
        for (key in this.props) {
            var obj = this.props[key];
            // create rowgroup
            this.$["rowGroup" + obj.propertyLabel] = this.$.scroller.createComponent( {name: "rowGroup" + obj.propertyLabel, kind: "RowGroup", caption: $L(obj.propertyLabel), style: sw}, { owner: this } );
            
            switch (obj.propertyType) {
                case "RichText":
                    var px = (Platform.isPortraitMode() ? "500px;" : "290px;");
                    var minHeight = " min-height: " + px; 
                    var height = " height: 100%;"; 
                    var style = "background-color: white; " + minHeight + height; 
                    if (Util.isDebug()) {
                        this.log("style: " + style);
                    }
                    if (Platform.isWebOS()) {
                        this.$["input" + obj.propertyLabel] = this.$["rowGroup" + obj.propertyLabel].createComponent( {name: "input" + obj.propertyLabel, style: style, kind: "RichText", hint:"", placeholderClassName:"", flex: 1, styled: false, allowHtml: true, richContent: true, oninput: "setDirty" }, { owner: this } );
                    } else {
                        this.$["input" + obj.propertyLabel] = this.$["rowGroup" + obj.propertyLabel].createComponent( {name: "input" + obj.propertyLabel, style: style, kind: "Textarea", maxTextHeight: px, richContent: true, oninput: "setDirty"}, { owner: this } );
                    }
                    break;
                case "DatePicker":
                    this.$["input" + obj.propertyLabel] = this.$["rowGroup" + obj.propertyLabel].createComponent( {name: "datepicker" + obj.propertyLabel, style: "background-color: white;", kind: "DatePicker", caption: "", onChange: "setDirty"}, { owner: this } );
                    break;
                case "TimePicker":
                    this.$["input" + obj.propertyLabel] = this.$["rowGroup" + obj.propertyLabel].createComponent( {name: "timepicker" + obj.propertyLabel, style: "background-color: white;", kind: "TimePicker", caption: "", onChange: "setDirty"}, { owner: this } );
                    break;
                case "DateTime":
                    this.$["input1" + obj.propertyLabel] = this.$["rowGroup" + obj.propertyLabel].createComponent( {name: "datepicker" + obj.propertyLabel, style: "background-color: white;", kind: "DatePicker", caption: "", onChange: "setDirty"}, { owner: this } );
                    this.$["input2" + obj.propertyLabel] = this.$["rowGroup" + obj.propertyLabel].createComponent( {name: "timepicker" + obj.propertyLabel, style: "background-color: white;", kind: "TimePicker", caption: "", onChange: "setDirty"}, { owner: this } );
                    break;
                case "Boolean":
                    // TODO
                    this.$["input" + obj.propertyLabel] = this.$["rowGroup" + obj.propertyLabel].createComponent( {name: "checkbox" + obj.propertyLabel, style: "background-color: white;", kind: "CheckBox", caption: "", onChange: "setDirty"}, { owner: this } );
                    break;
                default:
                    var inputType = (obj.propertyStyle != "" ? " \"" + obj.propertyStyle + "\", autoCapitalize: \"lowercase\"" : "");
                    if (Util.isDebug()) {
                        this.log("inputType: " + inputType);
                    }
                    this.$["input" + obj.propertyLabel] = this.$["rowGroup" + obj.propertyLabel].createComponent( {name: "input" + obj.propertyLabel, kind: "Input", alwaysLooksFocused: true, oninput: "setDirty", inputType: inputType}, { owner: this } );
                    break;                
            }
            
        }
                    
        // create notebooks
        this.$.rowGroupNotebook = this.$.scroller.createComponent( {name: "rowGroupNotebook", kind: "RowGroup", caption: $L("Notebook"), style: sw}, { owner: this } );
        this.$.notebooks = this.$.rowGroupNotebook.createComponent( {name: "notebooks", kind: "LabeledContainer"}, { owner: this } ); 
        this.$.manageNotebooks = this.$.notebooks.createComponent( {kind: "Button", caption: $L("Edit"), name: "manageNotebooks", onclick: "openManageNotebooks"}, { owner: this } );
        
        // create tags
        this.$.rowGroupTags = this.$.scroller.createComponent( {name: "rowGroupTags", kind: "RowGroup", caption: $L("Tags"), style: sw}, { owner: this } );
        this.$.tags = this.$.rowGroupTags.createComponent( {name: "tags", kind: "LabeledContainer"}, { owner: this } ); 
        this.$.manageTags = this.$.tags.createComponent( {kind: "Button", caption: $L("Edit"), name: "manageTags", onclick: "openManageTags"}, { owner: this } );
    },
    
    rendered : function() {
        this.inherited(arguments);
        if (Util.isDebug()) {
            this.log(this.notebook);
        }
        if (Platform.isTablet() || Platform.isTouchpadOrPre3()) {
            this.$.saveButton.setDisabled( true );
        } else {
            this.$.saveButton.addClass("enyo-button-affirmative");        
        }
        if (this.item != null) {
            this.setItem( this.item );
        } else {
            if (this.notebook != null && this.notebook !== undefined && this.notebook != "All_My_Stuff") {
                this.setNewNotebooks( this.notebook ); 
            } else {
                this.setNewNotebooks(  ); 
            }
            this.setTags( );
            var tags = $L("no tags defined");
            this.$.tags.setLabel( tags );
        }
        this.resize();        
    },
    
    resize : function() {
        var scrollerH = (Platform.isTablet() ? Util.getAbsolutPixel( "h", 0.94, 130) : (Platform.isTouchpadOrPre3() ? "360px" : "250px"));
        // this.log("scrollerH: " + scrollerH);
        this.$.scroller.applyStyle("height", scrollerH);
    },
    
    setItem : function( item ) {
        
        this.item = item;
        this.originalItem = item;

        // this.log("this.props: " + JSON.stringify(this.props));
       if (Util.isDebug()) {
           this.log("metadata: " + JSON.stringify(item.metadata));
       }

        for (key in this.props) {
            var obj = this.props[key];
            if (Util.isDebug()) {
                this.log("obj.propertyName: " + obj.propertyName);
            }
            var value = null;
            try {
//                value = item[obj.propertyName];
                value = Property.getValue( item, obj.propertyName );
            } catch (e) {
                this.error("error: " + e);
                value = "";
            }
            if (Util.isDebug()) {
                this.log("value: " + value);
            }
            if (value !== undefined && value !== null) {
                if (obj.propertyLabel == "Source" && enyo.isArray( value) ) {
                    var index = value.length -1;
                    var link = value[index].value;
                    if (Util.isDebug()) {
                        this.log("dynamic object: " + "input" + obj.propertyLabel);
                    }
                    this.$["input" + obj.propertyLabel].setValue( StringUtils.stripHtmlCodes( link ) ); 
                } else if (obj.propertyLabel == "Address" && enyo.isArray( value) ) {
                    var index = value.length -1;
                    var text = value[index].properties.text;
                    if (Util.isDebug()) {
                        this.log("dynamic object: " + "input" + obj.propertyLabel);
                    }
                    if (text !== undefined && text != null) {
                        this.$["input" + obj.propertyLabel].setValue( text ); 
                    }
                } else if (obj.propertyType != "DatePicker" && obj.propertyType != "TimePicker" && obj.propertyType != "DateTime") {
                    if (Util.isDebug()) {
                        this.log("dynamic object: " + "input" + obj.propertyLabel);
                    }
                    if (obj.propertyType != "Boolean") {
                        // this.log("value1: " + value);
                        // value = String(value).replace(/\r\n/gi, "");
                        // value = String(value).replace(/\n/gi, "<br>");
                        // value = String(value).replace(/\r/gi, "");  
                        if (Util.isDebug()) {
                            this.log("value2: " + value);
                        }
                        if (Platform.isWebOS()) {
                            value = StringUtils.stripHtmlCodes( value );
                        } else {
                            value = String(value).replace(/(<iframe[^<]+<\/iframe>)/gi, "");
                            value = String(value).replace(/<br\s*[\/]?>/gi, "\n");
                            value = String(value).replace(/<li\s*[\/]?>/gi, "\n");
                            value = String(value).replace(/<(?:.|\n)*?>/gm, '');
                        }
                        if (Util.isDebug()) {
                            this.log("value3: " + value);
                        }
                        this.$["input" + obj.propertyLabel].setValue( value ); 
                    } else {
                        this.$["input" + obj.propertyLabel].setChecked( value ); 
                    }
                } else {
                    value = StringUtils.getValueFromString(value);
                    var d = new Date();
                    d.setTime( value );
                    if (obj.propertyType != "DateTime") {
                        this.$["input" + obj.propertyLabel].setValue( d ); 
                    } else {
                        this.$["input1" + obj.propertyLabel].setValue( d ); 
                        this.$["input2" + obj.propertyLabel].setValue( d ); 
                    }
                }
            } else {
                if (Util.isDebug()) {
                    this.log("could not get value!");
                }
            }
        }
        
        this.setNewNotebooks( item.properties.workbooks );
        var tags = $L("no tags defined");
        if (item.properties.tags !== undefined && item.properties.tags != null && item.properties.tags != "") {
            tags = item.properties.tags;
            this.setTags( item.properties.tags );
        } else {
            this.setTags(  );
        }
        this.$.tags.setLabel( tags );
    },
    
    setDirty : function() {
        // this.log();
        this.isDirty = true;
        this.$.saveButton.addClass("enyo-button-affirmative");
        this.$.saveButton.setDisabled( false );
    },
    
    setActive : function ( value ) {
        this.$.saveButton.setActive( value ); 
    },
    
    getObjectFromProperty : function( obj, name ) {
       if (Util.isDebug()) {
           this.log("name: " + name);
       }

       var pos = String(name).indexOf(".");
       if ( pos == -1) {
           if (Util.isDebug()) {
               this.log("obj: " + obj );
               this.log("name: " + name );
           }
           return obj[ name ];
       } else {
           var strObj = String(name).substring(0, pos);
           if (Util.isDebug()) {
               this.log("strObj: " + strObj);
           }

           var strNestedProperty = String(name).substring(pos+1, String(name).length);
           if (Util.isDebug()) {
               this.log("strNestedProperty: " + strNestedProperty);
           }

           this.getObjectFromProperty( obj[ strObj ], strNestedProperty ); 
       }
    },
    
    save : function() {
       // this.log();
       this.setActive( true );
       
       var isNew = false;
       var uuid = Util.createUuid();
       if (this.item != null && this.type != "Appointment") {
           uuid = StringUtils.getValueFromString( this.item.uuid );
       } else {
    	   isNew = true;

    	   var veryOldUuid = (this.item != null ? "/UUID(" + StringUtils.getValueFromString( this.item.uuid ) + ")/" : "");
    	   
    	   this.item = {
        		"type" : "/Type(" + this.type + ")/",
        		"uuid" : "/UUID(" + uuid + ")/",
        		"properties" : {}
       	   };
           currentTime = new Date().getTime();
           this.item.created = "/Date(" + currentTime + ")/";
           this.item.modified = "/Date(" + currentTime + ")/";
       }
       uuid = "/UUID(" + uuid + ")/";
       
       if (Util.isDebug()) {
           this.log("uuid: " + uuid);
       }
       var value;
       var command = "";

       var result = [];

       for (key in this.props) {
           var obj = this.props[key];
           // this.log("obj: " + JSON.stringify(obj));
           var name = obj.propertyName;
           if (Util.isDebug()) {
               this.log("name: " + name);
           }
           
           // update / create nested date time objects
           if (name.indexOf("properties.date") != -1 || name.indexOf("properties.toDate") != -1) {
               if (Util.isDebug()) {
                   this.log("this is a date or time object");
               }
               var pos1 = name.indexOf("properties.toDate");
               name = (pos1 != -1 ? "properties.toDate" : "properties.date");
//                this.log( "name: " + name );

               var isCreate = true;
               var subObject = null;
               if (!isNew) {
                   // this.log("object exists - 1");
                   subObject = this.item[name];
                   // this.log("subObject: " + subObject);
                   isCreate = false;
               }

               var newName = name.substring( 11, name.length );
               if (Util.isDebug()) {
                   this.log( "newName: " + newName );
               }
               
               var subUuid = Util.createUuid();
               /*if (subObject !== undefined && subObject != null) {
                   // this.log("object exists - 2");
               }*/
               var oldSubUuid = (subObject != null ? StringUtils.getValueFromString( subObject.uuid ) : "");
               var subUuidShort = subUuid;
               subUuid = "/UUID(" + subUuid + ")/";
               if (Util.isDebug()) {
                   this.log( "subUuid: " + subUuid );
               }
               
               // get values
               if (obj.propertyType == "DateTime"){
                   var valueDate = this.$["input1" + obj.propertyLabel].getValue();
                   var valueTime = this.$["input2" + obj.propertyLabel].getValue();
                   
                   if (Util.isDebug()) {
                       this.log("valueDate: " + valueDate);
                       this.log("valueTime: " + valueTime);
                       this.log("valueTime.getHours(): " + valueTime.getHours());
                       this.log("valueTime.getMinutes(): " + valueTime.getMinutes());
                   }
                   
                   if (valueDate !== undefined && valueDate != null && valueTime !== undefined && valueTime != null) {
                       valueDate.setHours( valueTime.getHours() );
                       valueDate.setMinutes( valueTime.getMinutes() );
                       if (Util.isDebug()) {
                           this.log("valueDate new: " + valueDate);
                       }
                       value = valueDate.getTime();
                       if (Util.isDebug()) {
                           this.log("value: " + value);
                       }
                   } else {
                       value = 0;
                   }
                   
               } else {
                   value = this.$["input" + obj.propertyLabel].getValue();
                   if (value !== undefined && value != null) {
                       value = value.getTime();
                   }
               }
               
               /*if (isCreate == true || 1==1) {
                   // command += "[\"create\", \"" + subType + "\", \"" + subUuid + "\"],";
               }*/


               // build command string
               value = "/Date(" + value + ")/";
               if (this.propertyValueHasChanged(obj, value)) {
                   // command += "[\"set\", \"" + subUuid  + "\", \"date\",\"" + value + "\"],";
                   // command += "[\"set\", \"" + uuid  + "\", \"" + newName + "\",\"" + subUuid + "\"],";
                   // this.log("command: " + command);
   
            	   if (oldSubUuid != "") {
	                   oldSubUuid = "/UUID(" + oldSubUuid + ")/";
                       step = [];
                       step.push("delete", oldSubUuid);
                       result.push( step );
            	   }
            	   
                   var subType = (obj.propertyType == "DateTime" ? "DateTimeObject" : "Date");
                   step = [];
                   step.push("create", subType, subUuid);
                   result.push( step );

                   step = [];
                   step.push("set", subUuid, "date", value);
                   result.push( step );

                   if (isCreate == true || 1==1) {
	                   step = [];
	                   step.push("set", uuid, newName, subUuid);
	                   result.push( step );
                   }

               }
               
           } else { // this is no date or time object
               var pos1 = String(name).indexOf(".");
               var pos2 = String(name).lastIndexOf("[");
               if (pos1 != -1 && pos2 != -1) {
                   name = String(name).substring(pos1+1, pos2);
               } else if (pos1 == -1 && pos2 != -1) {
                   name = String(name).substring(0, pos2);
               } else if (pos1 != -1 && pos2 == -1) {
                   name = String(name).substring(pos1+1, String(name).length);
               }
               
               // check object type
               if (obj.propertyType != "Boolean") {
                   value = String(this.$["input" + obj.propertyLabel].getValue()).replace(/"/gi, "&quot;");
               } else {
                   value = this.$["input" + obj.propertyLabel].getChecked();
               }

               // check if source element
               if (obj.propertyLabel == "Source" && String(value).trim().length > 0) {
                   if (Util.isDebug()) {
                       this.log("found source element...");
                   }
                   value = String(value).toLowerCase();
                   // var sourceString = "";
                   var found = false;
                   if (this.item != null) {
                       if (Util.isDebug()) {
                           this.log("oldValue: " + JSON.stringify( this.item.properties.url ));
                       }
                       if (this.item.properties === undefined || this.item.properties == null) {
                    	   this.item.properties = {};
                       }
                       this.item.properties.url = value;
                   } else {
                	   this.itemSource = value;
                   }
                   var sources = this.formatSources( "create", uuid, StringUtils.getHostname(value), value, this.type );
                   for (c in sources) {
                       result.push( sources[c] );
                   }
                   
                   // command += String(sourceString).substring(1, String(sourceString).length) + ",";
                   // command += sourceString;
                   // this.log("added souce: " + command);
               } else {
                   // if not source element
                   if (obj.propertyType != "DatePicker" && obj.propertyType != "TimePicker" && obj.propertyType != "DateTime" && obj.propertyType != "Boolean") {
                       if (this.propertyValueHasChanged(obj, value)) {
                           // command += "[\"set\", \"" + uuid  + "\", \"" + name + "\",\"" + value + "\"],";
                           step = [];
                           step.push("set", uuid, name, value);
                           result.push( step );
                       }
                   } else {
                       if (obj.propertyType != "DateTime" && obj.propertyType != "Boolean") {
                           var value = this.$["input" + obj.propertyLabel].getValue();
                           value = (value != null ? value.getTime() : 0);
                           if (Util.isDebug()) {
                               this.log("value: " + value);
                           }
                       }
                       if (this.propertyValueHasChanged(obj, value)) {
                           if (obj.propertyType == "Boolean") {
                               // command += "[\"set\", \"" + uuid  + "\", \"" + name + "\"," + value + "],";
                               step = [];
                               step.push("set", uuid, name, value);
                               result.push( step );
                           } else {
                               // command += "[\"set\", \"" + uuid  + "\", \"" + name + "\",\"" + value + "\"],";
                               step = [];
                               step.push("set", uuid, name, value);
                               result.push( step );
                           }
                       } 
                   }
               }
           }

           // update current item               
           if (this.item != null && String(value).trim().length > 0 && obj.propertyLabel != "Source" && this.propertyValueHasChanged(obj, value)) {
               // update item too
               if (Util.isDebug()) {
                   this.log("updating this.item." + obj.propertyName + " to value " +  value);
               }
               
               this.updateProperty(this.item, obj.propertyName, value);
           }
       }
       
       var data = [];

       // create notebook if needed
       if (this.createString !== undefined && this.createString != null) {
           for (c in this.createString) {
               data.push( this.createString[c] );
           }
       }

       this.log("this.item: " + this.item);

       // delete old appointment, if any
       if (this.type == "Appointment" && veryOldUuid != "") {
           step = [];
           step.push("delete", veryOldUuid);
           data.push( step );

           ArrayUtils.removeElementByUUID( this.getDataManager().getItemsAll(), veryOldUuid );
           ArrayUtils.removeElementByUUID( this.getDataManager().getFeedItems(), veryOldUuid );

       }
       
       // create item first if necessary 
       if (isNew) {
           // data += "[\"create\", \"" + this.type + "\", \"" + uuid + "\"],";
           step = [];
           step.push("create", this.type, uuid);
           data.push( step );
       }
       
       // append fields
       // data += command;
       
       for (c in result) {
           data.push( result[c] );
       }
       
       // data = String(data).substring(0, String(data).length - 1);
       
       // add new workbooks
       if (Util.isDebug()) {
           this.log("setting new notebooks: " + JSON.stringify(this.notebooks));
       }
       var wbs = this.formatElements( "set", uuid, "workbooks", this.notebooks, false);           
       for (c in wbs) {
           if (this.propertyArrayValueIsNew("properties.workbooks", wbs[c][3])) {
        	   data.push( wbs[c] );
           }
       }
       
       // add new created workbooks
       if (Util.isDebug()) {
           this.log("setting new created notebooks: " + JSON.stringify(this.newWorkbookUuid));
       }
       var wbsnew = this.formatElements( "set", uuid, "workbooks", this.newWorkbookUuid, false);           
       for (c in wbsnew) {
           data.push( wbsnew[c] );
       }
       
       // add new tags
       if (this.tags === undefined || this.tags == null) {
           this.tags = "";
       }
       if (Util.isDebug()) {
           this.log("setting new tags: " + JSON.stringify(this.tags));
       }
       var tgs = this.formatElements( "set", uuid, "tags", this.tags);           
       for (c in tgs) {
           if (this.propertyArrayValueIsNew("properties.tags", tgs[c][3])) {
        	   data.push( tgs[c] );
           }
       }

       // close command string
       // data += "]";

       if (Util.isDebug()) {
           this.log("data: " + JSON.stringify(data));
       }

       // this.log("this.item: " + JSON.stringify(this.item));
        if (!isNew) {
            // update item
            if (Util.isDebug()) {
                this.log("this.item.properties: " + JSON.stringify( this.item.properties ));
            }
            this.item.properties.tags = this.createArrayFromString( this.tags );
            this.item.properties.workbooks = this.createArrayFromString( this.notebooks );
            this.item.modified = "/Date(" + new Date().getTime() + ")/";

            enyo.asyncMethod( this, "doSaveItem", [ JSON.stringify(data), this.item ] );
        } else {
//        	newObjName = this.getObjectNameFromResultArray( result );

        	this.item.properties.tags = this.createArrayFromString( this.tags );
            this.item.properties.workbooks = this.createArrayFromString( this.notebooks );
//            this.item.properties["/meta/sourceUrl"] = this.itemSource;

//            try {
//            	for (key in result) {
//            		arrayRow = result[key];
////            		this.item[  ] = arrayRow[3];
//            		if (key > 0 && (this.props[key-1].propertyName == "properties.date.properties.date" /*|| this.props[key-1].propertyName == "properties.toDate.properties.date"*/)) {
//                		this.updateProperty(this.item, this.props[Number(key-1)].propertyName, arrayRow[3]);
//            		} else {
//                		this.updateProperty(this.item, this.props[key].propertyName, arrayRow[3]);
//            		}
//            	}
//            } catch(e) {
//            	this.error(e);
//            }
            
            
            if (Util.isDebug()) {
            	this.log("new item: " + JSON.stringify(this.item));
            }
            
            enyo.asyncMethod( this, "doCreateItem", [ JSON.stringify(data), this.item ] );
        }

    },
    
    getObjectNameFromResultArray : function( array ) {
    	if (array === undefined || array == null || array.length == 0) {
    		return "";
    	}
    	
    	for (key in array) {
    		arrayRow = array[key];
    		if (arrayRow[0] == "set" && arrayRow[2] == "name") {
    			return arrayRow[3];
    		}
    	}
    },
    
    updateProperty : function( item, name, value ) {
    	if (value == undefined || value === undefined) {
    		return;
    	}
        var pos = String(name).indexOf(".");
        if (Util.isDebug()) {
            this.log("START");
 	        this.log("item: " + JSON.stringify(item));
 	        this.log("name: " + name);
 	        this.log("value: " + value);
 	        this.log("pos: " + pos);
        }
       if (pos == -1) {
           // this.log("old value: " + item[name]);
           item[ name ] = value;
           if (Util.isDebug()) {
               this.log("new value: " + item[name]);
           }
       } else {
    	   
    	   if (name == "properties.date.properties.date" || name == "properties.toDate.properties.date") {
    		   
    		   var tmpObj = (name == "properties.date.properties.date" ? "date" : "toDate");
    		   
               var uuidSource = Util.createUuid();
               uuidSource = "/UUID(" + uuidSource + ")/";
               currentTime = new Date().getTime();

               var newKind = {
				   "uuid": uuidSource,
				   "type":"/Type(DateTime)/",
				   "created": "/Date(" + currentTime + ")/",
				   "modified": "/Date(" + currentTime + ")/",
				   "properties": {
					   "date": value
				   }
    		   };
               
               item.properties[ tmpObj ] = newKind;
               
               if (Util.isDebug()) {
                   this.log("new value: " + item[name]);
               }
               
    	   } else {
               var strObj = String(name).substring(0, pos);
               if (Util.isDebug()) {
    	            this.log("strObj: " + strObj);
               }

               var strNestedObj = String(name).substring(pos+1, String(name).length);
               if (Util.isDebug()) {
                   this.log("strNestedObj: " + strNestedObj);
               }

               var newObj = item[strObj];
               if (Util.isDebug()) {
                    this.log("newObj: " + newObj);
               }

               if (newObj !== undefined) {
                   this.updateProperty( newObj, strNestedObj, value);
               } else {
            	   this.error("could not send the property...");
               }
               // if (newObj != null) {
                   // this.log("newObj: " + JSON.stringify(newObj));
                   // if (newObj[ strNestedObj ] != null) {
                       // newObj[ strNestedObj ] = value;
                   // }
               // }
    	   }
       }
       if (Util.isDebug()) {
           this.log("END");
       }
    },
    
    propertyArrayValueIsNew : function(propertyName, value) {
        this.log("value: " + value);
        var valueold;
        try {
            valueold = this.item[propertyName];
            this.log("valueold: " + JSON.stringify(valueold));
        } catch (e) {
            this.error("error: " + e);
            valueold = null;
        }
        if (valueold != null && valueold !== undefined && value != valueold.toString()) {
            this.log("true");
            return true;
        } else if (valueold == null) {
        	// vorher gab es array nicht, zum beispiel bei einem neuen objekt
            this.log("true");
            return true;
        }
        this.log("false");
        return false;
     },
     
     propertyValueHasChanged : function(obj, value) {
         var valueold;
         try {
             valueold = this.item[obj.propertyName];
             // if (obj.propertyType.indexOf("Date") != -1) {
                 // valueold = StringUtils.getValueFromString(String(valueold));
             // }   
         } catch (e) {
             this.error("error: " + e);
             valueold = null;
         }
         // this.log("value old: " + valueold);
         // this.log("value new: " + value);
         if (value == "" && valueold == null) {
        	 return false;
         }
         if (value != valueold) {
             // this.log("true");
             return true;
         }
         // this.log("false");
         return false;
      },
      
    createArrayFromString : function ( values ) {
        var result = [];
        if (values === undefined || values == null || String(values).trim().length == 0) {
            return result;
        }  
        
        var valuesArray = String(values).split(",");
        for(key in valuesArray) {
            result.push( valuesArray[key] );
        }
        
        return result;
    },
    
    formatElements : function( command, uuid, type, values, formatAsUuid ) {
        var result = [];
        var step = [];
        var substep = [];
        
        if (values === undefined || values == null || String(values).trim().length == 0) {
            if (command == "remove") {
                // return ",[\"" + command + "\", \"" + uuid + "\", \"" + type + "\"]";
                step = [];
                step.push(command, uuid, type);
                result.push( step );
            }
            return result;
        }
        
        // this.log("command: " + command);
        // this.log("uuid: " + uuid);
        // this.log("type: " + type);
        // this.log("values: " + values);
        
        // var result = "[\"" + command + "\", \"" + uuid + "\", \"" + type + "\",[";
        step = [];
        
        var valuesArray = String(values).split( "," );
        for(key in valuesArray) {
            var obj = valuesArray[key];
            // this.log("obj: " + obj);
            if (formatAsUuid === undefined || formatAsUuid == false) {
                // result += "\"" + obj + "\",";
                substep.push( obj );
            } else {
                // result += "\"/UUID(" + obj + ")/\",";
                substep.push( "/UUID(" + obj + ")/" );
            }
        }
        // result = result.substr(0, result.length -1);
        // result += "]]";

        step.push(command, uuid, type, substep);
        result.push( step );
        
        if (Util.isDebug()) {
            this.log("result: " + JSON.stringify(result));
        }
        return result;
    },
    
    formatSources : function( command, uuid, name, value, type ) {
        var result = [];
        var step = [];

        if (Util.isDebug()) {
            this.log("type: " + type);
        }
        
        if (command == "create") {
            var uuidSource = Util.createUuid();
            var uuidSourceShort = uuidSource;
            uuidSource = "/UUID(" + uuidSource + ")/";
            uuidSourceShort = uuidSource;
            
            // result += "[\"create\", \"lifemanagr.Source\", \"" + uuidSource + "\"],";
            // result += "[\"set\", \"" + uuidSource + "\", \"value\", \"" + value + "\" ],";
            // result += "[\"add\", \"" + uuid + "\", \"metadata.sources\", \"" + uuidSourceShort + "\" ],";

//            step = [];
//            step.push("create", "lifemanagr.Source", uuidSource);
//            result.push( step );
//
//            step = [];
//            step.push("set", uuidSource, "value", value);
//            result.push( step );
//
//            step = [];
//            step.push("add", uuid, "metadata.sources", uuidSourceShort);
//            result.push( step );

            step = [];
            step.push("set", uuid, "url", value);
            result.push( step );

        } else {
            // result += "[\"remove\", \"" + uuid + "\", \"metadata.sources\", \"" + value + "\" ],";
//            step = [];
//            step.push("remove", uuid, "metadata.sources", value);
//            result.push( step );

            step = [];
            step.push("remove", uuid, "url", value);
            result.push( step );
        }
        
        if (Util.isDebug()) {
            this.log("result: " + JSON.stringify(result));
        }
        return result;
    },
    
    /*formatDate : function( command, uuid, name, value ) {
        var result = "";
        
        var uuidSource = Util.createUuid();
        uuidSource = "/UUID(" + uuidSource + ")/";
        
        result += "[\"create\", \"lifemanagr.Date\", \"" + uuidSource + "\"],";
        result += "[\"set\", \"" + uuidSource + "\", \"date\", \"" + value + "\" ],";
        result += "[\"add\", \"" + uuid + "\", \"Date\", \"" + uuidSource + "\" ],";
        
        this.log("result: " + result);
        return result;
    }, */
    
    closeParentDialog : function() {
        if (Util.isDebug()) {
            this.log();
        }
        this.isDirty = false;
        this.$.saveButton.removeClass("enyo-button-affirmative");
        this.$.saveButton.setDisabled( true );
        
        if (this.oldNotebooks) {
            localStorage.setItem("notebooks", JSON.stringify( this.oldNotebooks ));
        }
        // this.destroy();
        enyo.asyncMethod( this, "doCloseDialog" );
    },
    
    openManageNotebooks : function() {
        // this.log();
        this.$.notebookDialog.openAtCenter();  
        if (Util.isDebug()) {
            this.log("this.getDataManager().getNotebooks().length: " + this.getDataManager().getNotebooks().length);
        }
        this.$.notebookDialog.setValues( this.getDataManager().getNotebooks(), this.notebooks );
        this.$.notebookDialog.setScope(this);
        this.$.notebookDialog.setFuncName("setNewNotebooksFromDialog");
    },
    
    setNewNotebooks : function( notebooks ) {
        if (Util.isDebug()) {
            this.log("notebooks: " + notebooks);
        }
        this.notebooks = notebooks;
        if (this.$.notebookDialog) {
            this.$.notebookDialog.closeDialog();
        }
        var workbooks = this.getDataManager().getWorkbooks( notebooks );
        this.$.notebooks.setLabel ( Util.getNotebookNames( workbooks ) );
        this.$.notebooks.render();
    },
    
    setNewNotebooksFromDialog : function( notebooks ) {
        if (Util.isDebug()) {
            this.log("this.notebooks: " + this.notebooks);
            this.log("notebooks: " + notebooks);
            this.log("compare: " + String(this.notebooks).localeCompare( String(notebooks) ));
        }
        // if (String(this.notebooks).localeCompare( String(notebooks) ) != 0) {
            this.setNewNotebooks( notebooks );
            this.setDirty();
        // } else {
            // this.$.notebookDialog.closeDialog();
        // }
    },
    
    getDataManager : function() {
        return this.owner.getDataManager();
    },

    openManageTags : function() {
        if (Util.isDebug()) {
            this.log();
        }
        this.$.tagDialog.openAtCenter();  
        this.$.tagDialog.setValues( this.getDataManager().getAvailableTags(), this.tags, true );
        this.$.tagDialog.setScope(this);
        this.$.tagDialog.setFuncName("setNewTagsFromDialog");
    },
    
    setNewTags : function( tags ) {
        if (Util.isDebug()) {
            this.log("tags: " + tags);
        }
        this.tags = tags;
        if (this.$.tagDialog) {
            this.$.tagDialog.closeDialog();
        }
        this.$.tags.setLabel ( tags );
        this.$.tags.render();
    },
    
    setNewTagsFromDialog : function( tags ) {
        if (Util.isDebug()) {
            this.log("compare: " + String(this.tags).localeCompare( String(tags) ));
        }
        if (String(this.tags).localeCompare( String(tags) ) != 0) {
            this.setNewTags( tags );
            this.setDirty();
        } else {
            this.$.tagDialog.closeDialog();
        }
    },
    
    onCreateNotebook : function( inSender, inValue ) {
        if (Util.isDebug()) {
            this.log("inSender: " + inSender);
            this.log("inValue: " + inValue);
        }

        var uuid = inValue[0];
        var name = inValue[1];
        
        if (Util.isDebug()) {
            this.log("uuid: " + uuid);
            this.log("name: " + name);
        }
        
        var newUuid = "/UUID(" + uuid + ")/";
        // var result = "[\"create\", \"Workbook\", \"" + newUuid + "\"],";
        // result += "[\"set\", \"name\", \"" + name + "\" ],";

        var result = [];
        var step = [];
        step.push("create", "Workbook", newUuid);
        result.push( step );

        step = [];
        step.push("set", "name", name);
        result.push( step );
        
        // this.log("result: " + result);
        
        var newKind = {
            "uuid": newUuid,
            "name": name
        }
        
        // this.log("notebooks old: " + JSON.stringify( localStorage.getItem("notebooks")) );
        if (Util.isDebug()) {
            this.log("notebooks old: " + JSON.parse(localStorage.getItem("notebooks")).length );
        }
        
        // this.oldNotebooks = this.getDataManager().getNotebooks();
        
        var tmpnotebooks = JSON.parse(localStorage.getItem("notebooks"));
        if (Util.isDebug()) {
            this.log("tmpnotebooks.length: " + tmpnotebooks.length);
        }
        tmpnotebooks.push( newKind );
        if (Util.isDebug()) {
            this.log("tmpnotebooks.length: " + tmpnotebooks.length);
        }
        localStorage.removeItem("notebooks");
        localStorage.setItem("notebooks", JSON.stringify( tmpnotebooks ));
        this.getDataManager().setNotebooks( tmpnotebooks );
        
        this.createString = result;
        var newNotebooks = (this.notebooks !== undefined ? this.notebooks + "," : "");
        if (Util.isDebug()) {
            this.log("newNotebooks: " + newNotebooks);
        }
        // this.setNewNotebooks( newNotebooks + uuid );
        this.notebooks = newNotebooks + uuid;
        if (Util.isDebug()) {
            this.log("this.notebooks: " + this.notebooks);
        }
        this.setDirty();
    },
    
});