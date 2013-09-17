enyo.kind({
    name: "ArticleContainer",
    kind: "VFlexBox",
    className: "article_container",    
    events: {
      onFilterByTag: "",
      onToggleCheckboxState: "",
      onImageClicked: "",
      onStarsClicked: "",
      onContentClicked: ""
    },
    components: [
        {kind: "Pane", name: "accentPane", transitionKind: enyo.transitions.Simple, style: "height: 7px;", components: [
            {name: "accent", className: "accent"}
        ]},
        {name: "accent2", className: "accent2"},
        {kind: "Pane", name: "contentPane", flex: 1, transitionKind: enyo.transitions.Simple/*, style: "background-color: white; "*/, components: [
            {name: "scrollerArticle", autoHorizontal: false, horizontal: false, kind: (Platform.isTablet() || Platform.isBrowser() ? enyoextras.ScrollBarsScroller : enyo.Scroller), flex: 1, onScrollStart: "onScrollStart", onScrollStop: "onScrollStop", ondragstart: "dragstartHandler", ondragfinish: "dragfinishHandler", ongesturestart: "gesturestartHandler", ongestureend: "gestureendHandler", className: "hg", style: "margin: 0px; padding: 0px; ", components: [
                {name: "contentArea", kind: "ContentArea", 
                    onFilterAction: "onFilterAction", 
                    onCbClickedAction: "doCheckboxClickedAction", 
                    onImageClick: "imageClicked", 
                    onContentClick: "contentClicked",
                    onLinkClick: "linkClicked",
                    onStarsClick: "starsClicked",
                },
            ]},
            {name: "emptyPage"/*, className: Util.getClassName("hg")*/, kind: "VFlexBox", align: "center", pack: "top", components: [
                { content: "<br/><br/><br/><br/><br/><br/><br/><center><img src=\"images/256bg.png\" border=0></center>",
                    style: "text-align: center; margin: 10px;",
                    className: "enyo-text-body"}
            ]},
        ]},
        {name: "printsource", className: "printsource"},
    ],

    published: {
        activeView: "emptyPage",
        scrolling: false
    },
    
    
    rendered : function() {
        // this.log("START");
        this.inherited(arguments);
        if (this.activeView == "scrollerArticle") {
            this.$.contentPane.selectViewByName( "scrollerArticle", true ); 
            // this.$.accentPane.selectViewByName( "accent", true );  
        } else {
            this.$.contentPane.selectViewByName( "emptyPage", true ); 
        }
        this.$.printsource.setContent("Printed with " + enyo.fetchAppInfo().title + " - http://sven-ziegler.com");
        // this.log("END");
    },
    
    switchView : function() {
        this.$.contentPane.selectViewByName( this.getActiveView(), true );
    },
    
    onClick : function( inSender, inEvent ) {
        if (Util.isDebug()) {
            this.log("inSender: " + inSender.ishold );
        }
        this.owner.onClickCalled();
    },
    
    onFilterAction : function( inSender, inValue ) {
        if (Util.isDebug()) {
            this.log("inSender: " + inSender);
            this.log("inValue: " + inValue);
        }
        this.doFilterByTag( inValue );
    }, 
    
    doCheckboxClickedAction : function( inSender, inValue ) {
        if (Util.isDebug()) {
            this.log("inSender: " + inSender);
            this.log("inValue: " + inValue);
        }
        this.doToggleCheckboxState( inValue );
    }, 
    
    imageClicked : function( inSender, inValue ) {
        if (Util.isDebug()) {
            this.log("inSender: " + inSender);
            this.log("inValue: " + inValue);
        }
        this.doImageClicked( inValue );
    }, 
    
    starsClicked : function( inSender, inValue ) {
        if (Util.isDebug()) {
            this.log("inSender: " + inSender);
            this.log("inValue: " + inValue);
        }
        this.doStarsClicked( inValue );
    }, 
    
    contentClicked : function( inSender, inValue ) {
        if (Util.isDebug()) {
            this.log("inSender: " + inSender);
            this.log("inValue: " + inValue);
        }
        if (this.scrolling == true) {
            if (Util.isDebug()) {
                this.log("no contentClicked event because of active scrolling!")
            }
            return;
        }
        this.doContentClicked( inValue );
    }, 
   
    linkClicked : function( inSender, inValue ) {
        if (Util.isDebug()) {
            this.log("inSender: " + inSender);
            this.log("inValue: " + inValue);
        }
        // this.doContentClicked( inValue );
    }, 
      
    getDataManager : function() {
        if (Util.isDebug()) {
            this.log();
        }
        return this.owner.getDataManager();
    },
    
    onScrollStart : function() {
//        if (Util.isDebug()) {
//            this.log();
//        }
        this.scrolling = true;    
    },
    
    onScrollStop : function() {
//        if (Util.isDebug()) {
//            this.log();
//        }
        this.scrolling = false;
    },
    
});