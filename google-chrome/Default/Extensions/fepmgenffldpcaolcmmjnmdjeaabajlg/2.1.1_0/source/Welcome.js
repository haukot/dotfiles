enyo.kind({
    name: "Welcome",
    kind: enyo.VFlexBox,
    className: "hg",
    components: [
        {name: "springpadApi", kind: "SpringpadApi"},
        {name: "launchAppCall", kind: "PalmService", service: "palm://com.palm.applicationManager/", method: "launch"},
        {name: "openEmailCall", kind: "PalmService", service: "palm://com.palm.applicationManager/", method: "open"},
        { kind: "Pane", name: "contentPane", flex: 1, transitionKind: enyo.transitions.Simple, components: [
            {name: "welcome", kind: "Scroller", autoHorizontal: false, horizontal: false, flex: 1, components: [
                {kind: "Control", className: "enyo-preferences-box", width: (Platform.isTablet() ? "580px" : "95%"), /*className: "zettel"*/ components: [
                    {kind: "VFlexBox", name: "flexBox", className: "zettel", components: [
                        {kind: "HFlexBox", className: Util.getClassName("header"), components: [
                            {kind: "enyo.Image", name: "image", className: Util.getClassName("image"), onclick: "onClick2", src: "images/64.png"},
                            {name: "headline", className: Util.getClassName("headline-zettel"), allowHtml: true, content: ""}
                        ]},    
                        {name: "content", kind: "HtmlContent", onLinkClick: "linkClicked", allowHtml: true, className: Util.getClassName("content"), components: [
                            {name: "text", allowHtml: true},
                            {kind: "RowGroup", components: [
                                {name: "username", hint: $L("Username")/*, value: "terje.tel", disabled: true*/, kind: "Input", alwaysLooksFocused: true, autoCapitalize: "lowercase", oninput: "checkLoginData", autoWordComplete: false, autocorrect: false, spellcheck: false, onkeypress: "keyPressedInUser", onkeyup: "keyUpInUser"},
                            ]},
                            {kind: "RowGroup", components: [
                                {name: "password", hint: $L("Password"), kind: "PasswordInput", alwaysLooksFocused: true, oninput: "checkLoginData", onkeypress: "keyPressedInPassword", onkeyup: "keyUpInPassword"},
                            ]},
                            {kind: "LabeledContainer", name: "verifyStatus"},
                            {kind: "HFlexBox", components: [
                                {name: "createButton", caption: $L("Create New Account"), kind: "ActivityButton", onclick: "createAccount", className: "enyo-button", flex: 1},
                                {name: "verifyButton", caption: $L("Login!"), kind: "ActivityButton", onclick: "verifyAccount", className: "enyo-button-affirmative", flex: 1},
                            ]},
                            {name: "nextSteps", allowHtml: true, className: "nextSteps"},
                            {kind: "HFlexBox", components: [
                                {name: "importButton", caption: $L("Import Data!"), kind: "Button", onclick: "importData", className: "enyo-button", flex: 1},
                                {name: "finishedButton", caption: $L("No, thanks!"), kind: "Button", onclick: "doneClick", className: "enyo-button-dark", flex: 1},
                            ]},
                        ]},
                    ]},
                  ]},
              ]},
            {name: "import", kind: "Import"}
        ]}, 
      {kind: "ModalDialog", name: "dialog", caption: $L("Attention"), components:[
          {content: $L("After creating your account you have to activate it before you can login. Check your mails!"), className: "enyo-paragraph"},
          {layoutKind: "HFlexLayout", components: [
              {kind: "Button", caption: $L("Ok"), flex: 1, className: "enyo-button", onclick: "closeDialog"},
          ]}
      ]},
      {kind: "ModalDialog", name: "needHelpDialog", caption: $L("Trouble with login?"), components:[
          {name: "scroller", kind: enyo.Scroller, flex: 1, height: (Platform.isWebOS() ?  
                (Platform.isTouchpad() ? "380px" : (Platform.isTouchpadOrPre3() ? "330px" : "220px"))
                : (Platform.isTablet() || Platform.isBrowser() ? "380px" : "330px")), autoHorizontal: false, horizontal: false, components: [
	          {content: $L("1. Did you type in the correct username and password?"), className: "enyo-paragraph"},
	          {content: $L("2. Did you verify your account? You should have recieved a mail from Springpad, containing a link to completely activate your account."), className: "enyo-paragraph"},
	          {content: $L("3. Some users reportedly had trouble using alternative logins (Facebook, Twitter, Google, ...). If that's the case try to create a Springpad account."), className: "enyo-paragraph"},
	          {content: $L("4. Did you forget your password? <a href='https://springpad.com/forgot.action'>Click here</a>"), onLinkClick: "openLink", className: "enyo-paragraph"},
	          {content: $L("5. Some special characters in your username or password could cause some troube, e.g. the $ sign. Change your username or password accordingly."), className: "enyo-paragraph"},
          ]},
          {layoutKind: "HFlexLayout", components: [
              {kind: "Button", caption: $L("I need help!"), flex: 1, className: "enyo-button-negative", onclick: "sendMail"},
              {kind: "Button", caption: $L("Ok"), flex: 1, className: "enyo-button-affirmative", onclick: "closeNeedHelpDialog"},
          ]}
      ]},

    ],

    published: {
        accountVerified: false,
    },
    
    rendered : function( ) {
        this.inherited(arguments);
        if (Util.isDebug()) {
            this.log("START");
        }
        var appinfo = enyo.fetchAppInfo();
        this.$.headline.setContent( $L("Welcome to") + " " + appinfo.title );
        // this.$.saveButton.setDisabled( true );
        var content = $L("To use this application you need a <b>free</b> <a href=\"http://springpad.com//\">Springpad.com</a> - account. ") 
        content += $L("If you already have an account please enter your username and password below. ");
        content += $L("If you don't have an account then you can signup now to get one.");
        content += "<br><br>";
        this.$.verifyButton.setDisabled( true );

        this.$.text.setContent(content);
        this.$.verifyStatus.hide();
        
        // hide next steps
        var nextSteps = $L("If you are already registered by one of the following services, you can now import your data:");
        nextSteps += "<br><ul><li>Evernote</li><li>Google Note</li></ul>";
        this.$.nextSteps.setContent( nextSteps );
        this.$.nextSteps.hide();
        this.$.importButton.hide();
        this.$.finishedButton.hide();
        if (Util.isDebug()) {
            this.log("top: " + this.$.welcome.getScrollTop());
            this.log("END");
        }
    },
    
    doneClick : function( ) {
        if (Util.isDebug()) {
            this.log("START");
        }
        this.owner.$.pane.selectViewByName("feedSlidingPane");
        this.owner.normalStart();
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    createAccount: function() {
        this.linkClicked( "Test", "http://springpad.com/register");  
        this.$.dialog.openAtCenter();
    },
    
    linkClicked: function (inSender, inEvent) {
        if (Util.isDebug()) {
            this.log("inEvent: " + inEvent);
        }
        Platform.browser( inEvent, this )();
        // this.$.myservices.callAppManService(inEvent);   
    },
    
    checkLoginData: function() {
        if (this.$.username.getValue().trim() != "" && this.$.password.getValue().trim() != "") {
            this.$.verifyButton.setDisabled( false );
        } else {
            this.$.verifyButton.setDisabled( true );
        }
    },
    
    markAccountVerified : function( ) {
        if (Util.isDebug()) {
            this.log("START");
        }
        // this.log("markAccountVerified()");
        this.$.verifyButton.setCaption($L("Connected!"));
        // this.$.verifyButton.setStyle("background-color: green; color: #FFFFFF; font-weight:bold;");
        // this.$.verifyButton.setDisabled( true ); 
        this.setAccountVerified( true );
        
        // activate next steps
        this.$.nextSteps.show();
        this.$.importButton.show();
        this.$.finishedButton.show();
        this.$.welcome.scrollToBottom();
        // this.error("top: " + this.$.welcome.getScrollTop());

        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    resetVerified : function( ) {
        if (Util.isDebug()) {
            this.log("START");
        }
        this.$.verifyButton.setCaption($L("Verify!"));
        // this.$.verifyButton.setStyle("");
        // this.$.verifyButton.setDisabled(false); 
        this.setAccountVerified( false );
        // this.discardChanges();
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    verifyAccount : function( ) {
        if (Util.isDebug()) {
            this.log("START");
        }
        this.$.verifyButton.setActive(true);
        this.$.springpadApi.onFetchSuccess = "verifyAccountSecondStep";
        this.$.springpadApi.onFetchFailure = "grabVerifyAccountFailed";
        this.$.springpadApi.fetchData("users/" + this.$.username.getValue(), "GET", "", this.$.password.getValue() );
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    verifyAccountSecondStep : function( ) {
        if (Util.isDebug()) {
            this.log("START");
        }
        localStorage.removeItem("username");
        localStorage.setItem("username", this.$.username.getValue() );
        Settings.getSettings( true );
        this.$.springpadApi.onFetchSuccess = "grabVerifyAccountSuccess";
        this.$.springpadApi.onFetchFailure = "grabVerifyAccountFailed";
        this.$.springpadApi.fetchData("users/me" , "GET", "", this.$.password.getValue() );
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    grabVerifyAccountSuccess : function( inSender, responseText ) {
        if (Util.isDebug()) {
            this.log("START");
            this.log(responseText);
        }
        this.$.verifyButton.setActive(false);
        if (responseText.active == true && responseText.confirmed == true) {
            this.$.verifyStatus.setLabel(""); 
            this.$.verifyStatus.hide();

            // delete existing items from storage (maybe from previously installations)
            localStorage.clear();
            
            // put success into local storage
            if (Util.isDebug()) {
                this.log("username: " + this.$.username.getValue());
            }
            localStorage.removeItem("username");
            localStorage.setItem("username", this.$.username.getValue() );
            localStorage.removeItem("password");
            localStorage.setItem("password", this.$.password.getValue() );
            localStorage.removeItem("accountVerified");
            localStorage.setItem("accountVerified", true);
            // var appinfo = enyo.fetchAppInfo();
            // localStorage.removeItem("lastVersion");
            // localStorage.setItem("lastVersion", appinfo.version);

            // get email
            if (Util.isDebug()) {
                this.log("email: " + responseText.email);
            }
            localStorage.removeItem("email");
            localStorage.setItem("email", responseText.email );

            // get twitter
            if (Util.isDebug()) {
                this.log("twitter: " + responseText.twitterId);
            }
            localStorage.removeItem("twitter");
            localStorage.setItem("twitter", responseText.twitterId );

            // get firstName
            if (Util.isDebug()) {
                this.log("firstname: " + responseText.firstName);
            }
            localStorage.removeItem("firstname");
            localStorage.setItem("firstname", responseText.firstName );

            // get lastName
            if (Util.isDebug()) {
                this.log("lastname: " + responseText.lastName);
            }
            localStorage.removeItem("lastname");
            localStorage.setItem("lastname", responseText.lastName );

            // get website
            if (Util.isDebug()) {
                this.log("website: " + responseText.website);
            }
            localStorage.removeItem("website");
            localStorage.setItem("website", responseText.website );

            // get profilePicture
            if (Util.isDebug()) {
                this.log("profilepic: " + responseText.profilePicture);
            }
            localStorage.removeItem("profilepic");
            localStorage.setItem("profilepic", responseText.profilePicture );

            // get shard
            if (Util.isDebug()) {
                this.log("shard: " + responseText.shard);
            }
            localStorage.removeItem("shard");
            localStorage.setItem("shard", responseText.shard );

            Settings.getSettings( true );

            this.markAccountVerified();
        } else if (responseText.active == true && responseText.confirmed == true) {
            this.$.verifyStatus.show();
            this.$.verifyStatus.setStyle("color: red;");
            this.$.verifyStatus.setLabel($L("Validation failed! Account is not active!")); 
            this.setAccountVerified( false );
            this.clearLocalData();
        } else if (responseText.active == false && responseText.confirmed == false) {
            this.$.verifyStatus.show();
            this.$.verifyStatus.setStyle("color: red;");
            this.$.verifyStatus.setLabel($L("Validation failed! Account is not confirmed!")); 
            this.setAccountVerified( false );
            this.clearLocalData();
        }
        if (Util.isDebug()) {
            this.log("END");
        }
    },

    grabVerifyAccountFailed : function( inSender, responseText, inRequest ) {
        if (Util.isDebug()) {
            this.log("START");
        }
        
        var status = "";
        if (inRequest && inRequest.xhr) {
            status = inRequest.xhr.status;
            this.log("inRequest.xhr.status: " + inRequest.xhr.status);
            this.log("inRequest.xhr.getResponseHeader(\"Content-Type\"): " + inRequest.xhr.getResponseHeader("Content-Type"));
            this.log("inRequest.xhr: " + enyo.json.stringify(inRequest.xhr));
        }
        
        this.error(responseText);
        // this.log("this.$.verifyStatus: " + this.$.verifyStatus.getShowing());
        this.$.verifyButton.setActive(false);
        this.$.verifyStatus.show();
        this.$.verifyStatus.setStyle("color: red;");
        this.$.verifyStatus.setLabel(responseText.message); 
        // this.log("this.$.verifyStatus: " + this.$.verifyStatus.getShowing());
        this.setAccountVerified( false );

        // remove everything from local storage
        localStorage.removeItem("username");
        localStorage.removeItem("password");
        localStorage.removeItem("accountVerified");
        Settings.getSettings( true );

        // show help dialog!
        this.$.needHelpDialog.openAtCenter();
        
        if (Util.isDebug()) {
            this.log("END");
        }
    },
  
    resetDialog : function( ) {
        // this.$.verityButton.setClassName("enyo-button-affirmative");
        this.$.verifyButton.setCaption($L("Verify!"));
        // this.$.verifyButton.setStyle("");
        this.$.verifyButton.setActive( false );
        this.$.saveButton.setDisabled( true );
        this.$.username.setValue("");
        this.$.password.setValue("");
    },
    
    importData : function() {
        if (Util.isDebug()) {
            this.log();
        }
        this.$.contentPane.selectViewByName( "import", true );         
    },

    closeDialog : function() {
        this.$.dialog.close();  
    },
   
    keyPressedInUser : function( inSender, inEvent ) {
        this.log( "keyCode: " + inEvent.keyCode );
        if (inEvent.keyCode == 13) {
            this.$.password.forceFocusEnableKeyboard();  
        }
    },
    
    keyUpInUser : function( inSender, inEvent ) {
        this.log( "keyCode: " + inEvent.keyCode );
        if (!Platform.isTablet() && inEvent.keyCode == 13) {
            this.$.password.forceFocusEnableKeyboard();  
        }
    },
    
    keyPressedInPassword : function( inSender, inEvent ) {
        this.log( "keyCode: " + inEvent.keyCode );
        if (inEvent.keyCode == 13) {
            this.verifyAccount();  
        }
    },
    
    keyUpInPassword : function( inSender, inEvent ) {
        this.log( "keyCode: " + inEvent.keyCode );
        if (!Platform.isTablet() && inEvent.keyCode == 13) {
            this.verifyAccount();  
        }
    },

    closeNeedHelpDialog : function() {
        this.$.needHelpDialog.close();  
    },
   
    sendMail : function() {
        if (Util.isDebug()) {
            this.log("START");
        }
        var appinfo = enyo.fetchAppInfo();
        var title = appinfo.title + ", Version: " + appinfo.version + " (" + Platform.deviceName + ")"; 
        var mail = appinfo.vendormail;
        if (Platform.isWebOS()) {
            var params =  {
                "summary": title,
                "recipients": [{"value" : mail}],
                "text": "" 
            };
            this.$.openEmailCall.call({"id": "com.palm.app.email", "params" : params});    
        } else if (Platform.isBlackBerry()) {
            var remote = new blackberry.transport.RemoteFunctionCall("blackberry/invoke/invoke");
            remote.addParam("appType", "mailto:" + mail + "?Subject=" + encodeURIComponent( title ) );
            remote.makeAsyncCall();
        }
        if (Util.isDebug()) {
            this.log("END");
        }
    },

    openLink : function( ) {        
        if (Util.isDebug()) {
            this.log("START");
        }
        var url = "https://springpad.com/forgot.action";
        Platform.browser( url, this )();
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
});