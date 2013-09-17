enyo.kind({
    name: "ReadOnTouch.FontDialog",
    kind: enyo.ModalDialog,
    /*height: "330px",*/
    width: (Platform.isTablet() ? "380px" : "320px"),
    caption: $L("View Settings"),
    components: [
        {kind: "ApplicationEvents", onWindowHidden: "close"},
        {kind: enyo.Scroller, flex: 1, height: "250px", autoVertical: false, horizontal: false, components: [
            {kind: "RowGroup", components: [
                {kind: "LabeledContainer", label: $L("Font size:"), components: [
                    {name: "fontSizeSelector", kind: "CustomListSelector", value: 1, onChange: "changedSomething", style: "width: 120px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; font-size: 16px; margin-left: 10px; ", items: [
                        {caption: $L("Very Small"), value: "13px"},
                        {caption: $L("Small"), value: "16px"},
                        {caption: $L("Medium"), value: "19px"},
                        {caption: $L("Large"), value: "22px"},
                        {caption: $L("Very Large"), value: "25px"},
                    ]},
                ]},           
             ]},
            {kind: "RowGroup", components: [
                {kind: "LabeledContainer", label: $L("Line spacing:"), components: [
                    {name: "lineSpacingSelector", kind: "CustomListSelector", value: 1, onChange: "changedSomething", style: "width: 120px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; font-size: 16px; margin-left: 10px; ", items: [
                        {caption: $L("Normal"), value: "1.25"},
                        {caption: $L("Medium"), value: "1.5"},
                        {caption: $L("Large"), value: "1.75"},
                    ]},
                ]},           
             ]},
             {kind: "RowGroup", components: [
                {kind: "LabeledContainer", label: $L("Font family:"), components: [
                    {name: "fontFamilySelector", kind: "CustomListSelector", value: 1, onChange: "changedSomething", style: "width: 120px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; font-size: 16px; margin-left: 10px; ", items: [
                        (Platform.isWebOS() ? {caption: "Prelude", value: "Prelude"} : {caption: "DejaVu Serif", value: "DejaVu Serif"}),
                        {caption: "Arial", value: "Arial"},
                        {caption: "Verdana", value: "Verdana"},
                        {caption: "Times", value: "Times"},
                    ]},
                ]},           
             ]},
            {layoutKind: "HFlexLayout", components: [
                {name: "addButton", kind: "ActivityButton", caption: $L("Done"), flex: 1, className: "enyo-button-affirmative", onclick: "onDone"},
            ]}
        ]},
    ],
    
    rendered : function() {
        this.inherited(arguments);
        
        // put values from storage in ui
        this.$.fontSizeSelector.setValue( Settings.getSettings().fontsize );
        this.$.lineSpacingSelector.setValue( Settings.getSettings().lineSpacing );
        this.$.fontFamilySelector.setValue( Settings.getSettings().fontfamily );
    },
    
    changedSomething : function( ) {
        // get values from ui
        var fontsize = this.$.fontSizeSelector.getValue( );
        var lineSpacing = this.$.lineSpacingSelector.getValue( );
        var fontfamily = this.$.fontFamilySelector.getValue( );
 
        // store values to storage
        localStorage.setItem( "fontsize", fontsize );
        localStorage.setItem( "lineSpacing", lineSpacing );
        localStorage.setItem( "fontfamily", fontfamily );
        Settings.getSettings( true );

        this.owner.formatArticle();        
            
        // this.owner.$.articleContainer.$.contentArea.update();    
    },
    
    onDone : function() {

        // get values from ui
        var fontsize = this.$.fontSizeSelector.getValue( );
        var lineSpacing = this.$.lineSpacingSelector.getValue( );
        var fontfamily = this.$.fontFamilySelector.getValue( );
 
        // store values to storage
        localStorage.setItem( "fontsize", fontsize );
        localStorage.setItem( "lineSpacing", lineSpacing );
        localStorage.setItem( "fontfamily", fontfamily );
        Settings.getSettings( true );
 
        this.close();
    },
    
});