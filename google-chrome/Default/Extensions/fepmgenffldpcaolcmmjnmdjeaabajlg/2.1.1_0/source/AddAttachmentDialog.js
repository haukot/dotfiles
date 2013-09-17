enyo.kind({
    name: "AddAttachmentDialog",
    kind: enyo.ModalDialog,
/*    height: "460px",*/
    width: "380px",
    caption: $L("Add Attachment"),
    events: {
        onFileSelected: "",
        onFileSelectedChrome: "",
    },
    components: [
        {kind: "ApplicationEvents", onWindowHidden: "close"},
        {name: "springpadApi", kind: "SpringpadApi"},
        {name: "rowGroupFile", kind: "RowGroup", caption: $L("File"), components: [
            {name: "fileContainer", kind: "LabeledContainer", style: "height: 50px;"},
            {kind: "Button", caption: $L("Choose"), name: "chooseFile", onclick: "chooseFile"} 
        ]},
        {kind: "RowGroup", caption: $L("Description"), components: [
            (Platform.isWebOS() ? 
            	{name: "description", style: "background-color: white; min-height: 150px;", kind: "RichText", richContent: true, oninput: "setDirty"} 
              : {name: "description", style: "background-color: white; min-height: 150px;", kind: "Textarea", richContent: true, oninput: "setDirty"} )                                                                    
            
        ]},
        {layoutKind: "HFlexLayout", components: [
            {name: "cancelButton", kind: "Button", caption: $L("Cancel "), flex: 1, onclick: "closeDialog"},
            {name: "addButton", kind: "ActivityButton", caption: $L("Save"), flex: 1, className: "enyo-button-affirmative", onclick: "onSubmit"},
        ]},
        {kind: "FilePicker", allowMultiSelect: false, onPickFile: "attachFiles"},
        {kind: "ImagePicker", onchange: "fileSelected"},
        {kind: "ModalDialog", name: "popupDialog", caption: $L("Error"), components:[
             {name: "inhalt", content: "", className: "enyo-paragraph"},
             {layoutKind: "HFlexLayout", components: [
                 {kind: "Button", caption: $L("Ok"), flex: 1, onclick: "closeDialog"},
             ]}
         ]},
    ],
    published: {
        uuid: null,
        item: null,
    },
    
    rendered : function() {
        this.inherited(arguments);
        if (Util.isDebug()) {
            this.log("setting focus...");
        }
        if (Platform.isTouchpadOrPre3()) {
            this.$.addButton.setDisabled( true );
            // this.$.description.forceFocusEnableKeyboard();  
        } else {
            this.$.addButton.addClass("enyo-button-affirmative");        
        }
    },

    clearDialog : function( ) {
        this.$.addButton.setActive( false ); 
        this.$.cancelButton.setDisabled( false ); 
        this.$.description.setDisabled( false ); 
        this.$.description.setValue("");
        this.$.fileContainer.setLabel("");
        if (!Platform.isVeer()) {
            this.$.addButton.setDisabled( true );
        }
    },
    
    setActive : function ( value ) {
        this.$.addButton.setActive( value ); 
        this.$.cancelButton.setDisabled( !value ); 
        this.$.description.setDisabled( !value ); 
    },
    
    onSubmit : function( ) {
        this.setActive( true );
        var description = this.$.description.getValue().trim(); 
        if (Platform.isWebOS()) {
            enyo.asyncMethod( this, "doFileSelected", [ this.file.fullPath, description ] );
        } else {
            enyo.asyncMethod( this, "doFileSelectedChrome", [ this.file, description, this.form ] );
        }
    },

    chooseFile: function() {
        if (Util.isDebug()) {
            this.log();
        }
        if (Platform.isWebOS()) {
        	this.$.filePicker.pickFile();    
        } else if (Platform.isBrowser() || Platform.isBlackBerry()) {
        	this.$.imagePicker.pickFile();
        }
    },
    
    attachFiles: function(inSender, files) {
        // this.log("1");
        if (Platform.isWebOS()) {
            this.$.filePicker.close();
        } else {
            this.$.imagePicker.close();    
        }
        
        if(!files || !files.length || files.length != 1) {
            return;
        }
        if (Util.isDebug()) {
            this.log("files: " + JSON.stringify(files[0]));
        }

        this.file = files[0];
        var name = files[0].fullPath.split('/').pop();
        if (Util.isDebug()) {
            this.log("name: " + name);
        }
        this.$.fileContainer.setLabel( name );
        this.setDirty();
    }, 
    
    setDirty : function() {
        // this.log();
        this.isDirty = true;
        this.$.addButton.addClass("enyo-button-affirmative");
        this.$.addButton.setDisabled( false );
    },
    
    closeDialog : function( ) {
        this.close();
    },
    
    setError : function( message ) {
        this.$.popupDialog.openAtCenter();  
        if (message !== undefined) {
            this.$.inhalt.setContent( message );
        }
    }, 
       
    fileSelected : function( inSender, inValue ) {
        if (inValue === undefined || inValue.eventNode === undefined) {
        	return;
        }   
        this.$.imagePicker.close();    
        this.file = inValue.eventNode.files[0];
        this.form = inSender.$.form;
        this.name = this.file.name;
        
        if (Util.isDebug()) {
            this.log("this.name: " + this.name);
        }
        this.$.fileContainer.setLabel( this.name );
        this.setDirty();
    },

});