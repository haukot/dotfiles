enyo.kind({
    name: "CreateNotebookDialog",
    kind: enyo.ModalDialog,
    /*height: "400px",*/
    width: (Platform.isTablet() ? "380px" : "320px"),
    /*caption: $L("Create New Notebook"),*/
    events: {
        onAccept: ""
    },
    components: [
        {kind: "ApplicationEvents", onWindowHidden: "close"},
        {name: "scroller", kind: enyo.Scroller, flex: 1, height: (Platform.isWebOS() ?  
                (Platform.isTouchpad() ? "400px" : (Platform.isTouchpadOrPre3() ? "330px" : "220px"))
                : (Platform.isTablet() || Platform.isBrowser() ? "400px" : "330px")), autoHorizontal: false, horizontal: false, components: [
 	        {kind: "RowGroup", caption: $L("Name"), components: [
	            {name: "name", hint: $L("Name"), kind: "Input", alwaysLooksFocused: true, oninput: "setDirty"},
	        ]},
	        {kind: "RowGroup", caption: $L("Public"), components: [
	            {kind: "VFlexBox", components: [
	                {kind: "LabeledContainer", label: $L("Make notebook public"), components: [
	                    {kind: "CheckBox", name: "makePublic", onChange: "setDirty"},
	                ]}, 
	                {name: "shareButton", kind: "Button", caption: $L("Share Link"), flex: 1, onclick: "shareLink"},
	            ]} 
	        ]},
	        {kind: "RowGroup", caption: $L("Color"), name: "accentListRowGroup", components: [
	        ]},
	        {kind: "RowGroup", name: "memberRG", caption: $L("Member (read-only)"), components: [
	            {name: "member", kind: "Input", disabled: true, hint: ""}
	        ]},
        ]},
        {layoutKind: "HFlexLayout", components: [
	      	{name: "cancelButton", kind: "Button", caption: $L("Cancel "), flex: 1, onclick: "closeDialog"},
	        {name: "addButton", kind: "ActivityButton", caption: $L("Create"), flex: 1, className: "enyo-button-affirmative", onclick: "onSubmit"},
	    ]},
        {name: "share", kind: "Share"},
    ],
    
    published: {
        funcName: "",
        scope: "",
        accents: [],
        accent: null,
        item: null
    },
    
    rendered : function() {
        this.inherited(arguments);
        if (Platform.isTablet() || Platform.isTouchpadOrPre3()) {
            this.$.addButton.setDisabled( true );
            // this.$.name.forceFocusEnableKeyboard();  
        } else {
            this.$.addButton.addClass("enyo-button-affirmative");        
        }
    },
    
    setData : function( data, item ) {
        if (Util.isDebug()) {
            this.log("data: " + (data !== undefined && data != null ? data.length : 0));
            this.log("item: " + (item !== undefined && item != null ? JSON.stringify(item) : ""));
        }
        this.accents = data;
        this.item = item;
        
        if (item == null) {
            this.setCaption( $L("Create New Notebook") );
            if (Platform.isTablet() || Platform.isTouchpadOrPre3()) {
                if (Util.isDebug()) {
                    this.log("setting focus...");
                }
                this.$.name.forceFocusEnableKeyboard();  
            }
//            this.$.scroller.applyStyle("height", "360px");
        } else {
            this.setCaption( $L("Edit New Notebook") );
//            this.$.scroller.applyStyle("height", "450px");
        }

        
        var current = (item !== undefined && item.properties !== undefined && item.properties.accent !== undefined ? item.properties.accent : "standard");
        if (Util.isDebug()) {
            this.log("current: " + current);
        }
        
        var currentIndex = -1;
        
        var items = [];        
        for (key in this.accents) {
            var obj = this.accents[key];
            // this.log("obj: " + JSON.stringify(obj) );
            // this.$.listSelector.createComponent( {caption: obj.name}, {owner: this} );
            if (current == obj.key) {
                currentIndex = key;
            }
            items.push( { caption: $L(obj.key), value: key, style: "border-left: 15px solid " + obj.backgroundColor } );
        }
        // this.log("items: " + JSON.stringify(items) );

        if (Util.isDebug()) {
            this.log("currentIndex: " + currentIndex);
        }

        if (this.$.accent) {
        	this.$.accent.destroyControls();
            this.$.accent.destroy();
        }

        var kind = {name: "accent", kind: "CustomListSelector", style: "text-overflow: ellipsis; overflow: hidden; white-space: nowrap; margin-left: 10px;", onChange: "listChanged" };
        this.$.accent = this.$.accentListRowGroup.createComponent( kind, {owner: this} );
        if (items.length > 0) {
            this.$.accent.setItems( items );
        } else {
            this.$.accent.setDisabled( true );
        }
        if (items.length > 0 && currentIndex != -1) {
            // this.log("setting: " + items[currentIndex]);
            this.$.accent.setValue(currentIndex);
        }
        this.$.accentListRowGroup.render();
        
        if (item !== undefined) {
            this.$.name.setValue( item.name );
            this.$.addButton.setCaption($L("Edit"));
        }
        
        // set public
        var pub = (item !== undefined && item != null ? item.properties["/meta/published"] : undefined);
//        var pub = (item !== undefined && item != null ? item.isPublic : undefined);
        if (Util.isDebug()) {
            this.log("pub: " + pub);
        }
        if (pub !== undefined) {
            if (pub == true) {
                this.$.makePublic.setChecked(true);
                this.$.shareButton.setDisabled( false );
            } else {
                this.$.makePublic.setChecked(false);
                this.$.shareButton.setDisabled( true );
            }
        }
        
        // set collab members
        var tmp = (item !== undefined && item != null ? item.properties["/collab/members"] : undefined);
        if (tmp !== undefined) {
            if (Util.isDebug()) {
                this.log("tmp: " + JSON.stringify(tmp));
            }
            var members = "";
            for (key in tmp) {
                var c1 = tmp[key];
                // this.log("c1: " + JSON.stringify(c1));
                var name = c1.properties["/member/username"];
                members += (members.length > 0 ? ", " : "") + name;
            }
            if (Util.isDebug()) {
                this.log("members: " + members);
            }
            this.$.member.setValue(members);
        } else {
            this.$.member.setValue( Settings.getSettings().username );
//            this.$.memberRG.hide();
//            this.render();
        }
        
        if (Util.isDebug()) {
            this.log("item: " + JSON.stringify(item));
        }
    },
    
    clearDialog : function( ) {
        if (Util.isDebug()) {
            this.log();
        }
        this.$.addButton.setCaption($L("Create"));
        this.$.addButton.setActive( false ); 
        this.$.name.setValue("");
        this.$.name.setDisabled(false);
        this.$.member.setValue("");
        this.$.makePublic.setChecked(false);
        this.$.shareButton.setDisabled( true );
        if (Platform.isTablet() || Platform.isTouchpadOrPre3()) {
            this.$.addButton.removeClass("enyo-button-affirmative");
            this.$.addButton.setDisabled( true );
            // this.$.name.forceFocusEnableKeyboard();  
        }
    },
    
    closeDialog : function( ) {
        this.item = null;
        this.$.name.setValue( "" );
        this.close();
    },
    
    setActive : function ( value ) {
        this.$.addButton.setActive( value ); 
        this.$.name.setDisabled( !value ); 
    },
    
    onSubmit : function( ) {
        if (Util.isDebug()) {
            this.log("this.getFuncName(): " + this.getFuncName());
        }
        var name = this.$.name.getValue().trim();
        var pub = this.$.makePublic.getChecked();
        if (this.getFuncName().length > 0 && name.length > 0) {
            // this.setActive( false ); 
            // a function that binds this to this.foo
            var fn = enyo.bind(this.getScope(), this.getFuncName());
            // the value of this.foo(3)
            var accent = (this.accent !== undefined && this.accent != null ? this.accent.key : null);
            var value = fn( name, accent, (this.item != null ? this.item.uuid : null), pub );
            this.closeDialog();
        }
    },
    
    setDirty : function() {
        // this.log();
        if (this.$.name.getValue() != "") {
            this.isDirty = true;
            this.$.addButton.addClass("enyo-button-affirmative");
            this.$.addButton.setDisabled( false );
        }
    },
    
    listChanged: function( inSender, inValue, inOldValue ) {
        if (Util.isDebug()) {
            this.log(inSender + ", Value: " + inValue + ", inOldValue: " + inOldValue);
        }
        if (inValue != inOldValue) {
            this.setDirty();
        }
        
        // find corresponding listitem
        this.accent = this.accents[ inValue ]; 
    },
    
    shareLink : function( source, inEvent ) {
        if (Util.isDebug()) {
            this.log("START");
        }
        this.$.share.setItem( this.item );
        this.$.share.setIsNotebook( true );
        this.$.share.shareItem();
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    getDataManager : function() {
        if (Util.isDebug()) {
            this.log();
        }
        return this.owner.getDataManager();
    },
    
});