enyo.kind({
  name: "Preferences",
  kind: enyo.VFlexBox,
  style: "background-color: white;",
  contentHeight:"100%",
  events: {
      onReceive: "",
      onSave: "",
      onCancel: ""
  },
  components: [
        {name: "setAlarm", kind: "PalmService", service: "palm://com.palm.power/timeout/", method: "set", onResponse: "alarmServiceResponseHandler"},
        {name: "clearAlarm", kind: "PalmService", service: "palm://com.palm.power/timeout/", method: "clear", onResponse: "alarmServiceResponseHandler"},
        {name: "springpadApi", kind: "SpringpadApi"},
        {kind: "Toolbar", pack: "center", components: [
            {name: "saveButton", kind: "Button",  content: $L("Done"), onclick: "doneClick", className: "enyo-button-dark"},
            {kind: enyo.HFlexBox, flex: 1, components: [
                {kind: enyo.HtmlContent, content: $L("Preferences & Accounts"), style: " text-align: center; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; color: white; margin-left: 8px; ", flex: 1},
            ]}
        ]},
        {name: "scroller", kind: enyo.Scroller, flex: 1, height: (Platform.isTablet() ? (Platform.isPortraitMode() ? "850px" : Util.getAbsolutPixel( "h", 0.81)) : "360px"), autoHorizontal: false, horizontal: false, components: [
          {kind: "Control", className: "enyo-preferences-box", width: (Platform.isTablet() ? "100%" : "92%"), style: (Platform.isTablet() ? "max-width: 635px;" : "margin: 5px;"), components: [

              {name: "generalSettingsRG", kind: "RowGroup", width: "94%", caption: $L("General Settings"), components: [
                  {name: "shoppingListContainer", kind: "LabeledContainer", label: $L("Prefered shopping list"), components: [
                    {name: "shoppingList", kind: "CustomListSelector", style: "text-overflow: ellipsis; overflow: hidden; white-space: nowrap; margin-left: 10px;", onChange: "saveData" }
                  ]},
                  {kind: "LabeledContainer", label: $L("EXPERIMENTAL: Show scrollbar in item list (may reduce scrolling performance!)"), allowHtml: true, components: [
                      {kind: "CheckBox", name: "showListScrollbar", onChange: "showScrollbarClicked"}
                  ]},
                  {kind: "LabeledContainer", label: $L("Hide delete button"), components: [
                      {kind: "CheckBox", name: "hideDelete", onChange: "checkboxClicked"}
                  ]},
                  
              ]},
              {name: "syncSettingsRG", kind: "RowGroup", width: "94%", caption: $L("Synchronisation Settings"), components: [
                  {kind: "LabeledContainer", label: $L("Sync on startup"), components: [
                      {kind: "CheckBox", name: "autoSyncEnabled", onChange: "checkboxClicked"}
                  ]},
                  {kind: "LabeledContainer", label: $L("Download thumbnails"), components: [
                      {kind: "CheckBox", name: "downloadImages", onChange: "downloadImagesClicked"}
                  ]}
              ]},
              {name: "rowGroupAccount", kind: "RowGroup", width: "94%", caption: "SpringPad.com - " + $L("Account"), components: [
                  {kind: "RowGroup", components: [
                      {name: "username", hint: $L("Username")/*, value: "orlando9579",*/, disabled: true, kind: "Input", alwaysLooksFocused: true, oninput: "resetVerified", autoCapitalize: "lowercase", autoWordComplete: false, autocorrect: false, spellcheck: false},
                  ]},
                  {kind: "RowGroup", components: [
                      {name: "password", hint: $L("Password"), disabled: true, kind: "PasswordInput", alwaysLooksFocused: true, oninput: "resetVerified"},
                  ]},
                  {kind: "HFlexBox", width: "100%", components: [
                      {name: "logoutButton", flex:1, caption: $L("Logout"), className: "enyo-button", kind: "Button", onclick: "showConfirmLogoutDialog"},
                  ]},
              ]},
          ]},
      ]},
      {kind: "ModalDialog", name: "activeDownloadImagesDialog", caption: $L("Image Download"), components:[
          {content: $L("You have to synchronize, before you can see any images."), className: "enyo-paragraph"},
          {layoutKind: "HFlexLayout", components: [
              {kind: "Button", caption: $L("Ok"), flex: 1, onclick: "closeImageDialog"/*, className: "enyo-button-negative"*/},
              /*{kind: "Button", caption: "Delete", flex: 1, className: "enyo-button-negative", onclick: "confirmDownloadImages"},*/
          ]}
      ]},
      {kind: "ModalDialog", name: "clearDataDialog", caption: $L("Clear local data!"), components:[
          {content: $L("Are you sure that you want to delete your local data?"), className: "enyo-paragraph"},
          {layoutKind: "HFlexLayout", components: [
              {kind: "Button", caption: $L("Hell, no!"), flex: 1, onclick: "closeClearDataDialog", className: "enyo-button-dark"},
              {kind: "Button", caption: $L("Yes, sure!"), flex: 1, className: "enyo-button-negative", onclick: "confirmClearData"},
          ]}
      ]},
      {kind: "ModalDialog", name: "logoutDialog", caption: $L("Logout"), components:[
          {content: $L("Are you sure that you want to logout of Springpad and delete all your local data?"), className: "enyo-paragraph"},
          {layoutKind: "HFlexLayout", components: [
              {kind: "Button", caption: $L("Hell, no!"), flex: 1, onclick: "closeLogoutDialog", className: "enyo-button-dark"},
              {kind: "Button", caption: $L("Yes, sure!"), flex: 1, className: "enyo-button-negative", onclick: "logoutAccount"},
          ]}
      ]},
      {kind: "ModalDialog", name: "clearOfflineDataDialog", caption: $L("Clear offline local data!"), components:[
          {content: $L("Are you really sure that you want to delete your local data, including your local changes that are not synced with Springpad?"), className: "enyo-paragraph"},
          {layoutKind: "HFlexLayout", components: [
              {kind: "Button", caption: $L("Hell, no!"), flex: 1, onclick: "closeClearOfflineDataDialog", className: "enyo-button-dark"},
              {kind: "Button", caption: $L("Yes, sure!"), flex: 1, className: "enyo-button-negative", onclick: "confirmClearData"},
          ]}
      ]},
      {kind: "ModalDialog", name: "needsRestartDialog", caption: $L("Restart needed"), components:[
          {content: $L("You have to restart the app to see the changes."), className: "enyo-paragraph"},
          {layoutKind: "HFlexLayout", components: [
              {kind: "Button", caption: $L("Ok"), flex: 1, onclick: "closeNeedsRestartDialog"/*, className: "enyo-button-negative"*/},
              /*{kind: "Button", caption: "Delete", flex: 1, className: "enyo-button-negative", onclick: "confirmDownloadImages"},*/
          ]}
      ]},
  ],
  
    create : function( ) {
        if (Util.isDebug()) {
            this.log();
        }
        this.inherited(arguments);
        // this.log("2");
        
        var kind;
        if (Platform.isTouchpad()) {
            kind = {kind: "LabeledContainer", label: $L("Use Advanced Browser to view full Article"), components: [
                      {kind: "CheckBox", name: "useAdvancedBrowser", onChange: "checkboxClicked"}
                  ]}; 
            this.$.generalSettingsRG.createComponent( kind, {owner: this} );
        } else if (Platform.isWebOS() && Platform.isTouchpad() == false) {
            kind = {kind: "LabeledContainer", label: $L("Rotation lock (always portrait)"), components: [
                      {kind: "CheckBox", name: "useRotationLock", onChange: "changedRotationLock"}
                  ]};
            this.$.generalSettingsRG.createComponent( kind, {owner: this} );
            this.$.generalSettingsRG.createComponent( {kind: "LabeledContainer", name: "changedRotationLock"}, {owner: this} );
        }
        // this.log("test");
        if (Platform.isWebOS() || Platform.isBrowser()) {
            // this.log("JAU!");
            kind = {kind: "LabeledContainer", label: $L("Enable debug logging"), components: [
                      {kind: "CheckBox", name: "debugOutput", onChange: "checkboxClicked"}
                  ]};
            this.$.generalSettingsRG.createComponent( kind, {owner: this} );
        } else {
            // this.log("ehm...");
        }
        
        if (Platform.isWebOS()) {
            kind = {kind: "LabeledContainer", label: $L("Background synchronization"), components: [
              {name: "bgSyncIntervalSelector", kind: "CustomListSelector", onChange: "bgSyncIntervalChanged", style: "text-overflow: ellipsis; overflow: hidden; white-space: nowrap; margin-left: 10px; ", items: [
                  {caption: $L("30M"), value: "30M"},
                  {caption: $L("1H"), value: "1H"},
                  {caption: $L("2H"), value: "2H"},
                  {caption: $L("4H"), value: "4H"},
                  {caption: $L("8H"), value: "8H"},
                  {caption: $L("24H"), value: "24H"},
                  {caption: $L("never"), value: "never"},
              ]}]};
            this.$.syncSettingsRG.createComponent( kind, {owner: this} );
        }
        this.$.syncSettingsRG.createComponent( {name: "clearLocalDataButton", caption: $L("Clear local data!"), kind: "ActivityButton", onclick: "showConfirmClearDataDialog"}, {owner: this} );
  
        this.$.username.setDisabled( true );
        this.$.password.setDisabled( true );
        this.$.logoutButton.setDisabled( true );
    }, 
    
    resetClearLocalDataButton : function( ) {
        if (this.$.clearLocalDataButton) {
            this.$.clearLocalDataButton.setCaption($L("Clear local data!"));
            this.$.clearLocalDataButton.setStyle("");
            this.$.clearLocalDataButton.setActive(false);
        }
    },

    disableControls : function ( disabled ) {
//        this.$.username.setDisabled( disabled );
//        this.$.password.setDisabled( disabled );
        this.$.logoutButton.setDisabled( true );
        if (Platform.isWebOS() && Platform.isTouchpad() && this.$.useAdvancedBrowser) {
            this.$.useAdvancedBrowser.setDisabled( disabled );
            // this.$.maximizeView.setDisabled( disabled );
        } else if (Platform.isWebOS() && !Platform.isTouchpad() && this.$.useRotationLock) {
            this.$.useRotationLock.setDisabled( disabled );
        }
        if (Platform.isWebOS() && this.$.bgSyncIntervalSelector) {
            this.$.bgSyncIntervalSelector.setDisabled( disabled );
        }
        this.$.autoSyncEnabled.setDisabled( disabled );
        this.$.downloadImages.setDisabled( disabled );
        this.$.hideDelete.setDisabled( disabled );
        if (this.$.debugOutput && (Platform.isWebOS() || Platform.isBrowser())) {
            this.$.debugOutput.setDisabled( disabled );
        }
        this.$.shoppingList.setDisabled( disabled );
        this.$.showListScrollbar.setDisabled( disabled );
        
        // this.$.autoDownloadArticlesEnabled.setDisabled( disabled );
        // this.$.articleLimitSelector.setDisabled( disabled );
        if (this.$.clearLocalDataButton) {
            this.$.clearLocalDataButton.setDisabled( disabled );
        }
    },
    
    showingChanged : function( ) {
        if (Util.isDebug()) {
            this.log();
        }
        this.resetClearLocalDataButton();
        
        if (Settings.getSettings().syncInProgress == true) {
            this.owner.showFailurePopup($L("There is currently a sync in progress. Data can not be cleared now!"), $L("Failure!"));
            return;
        }

        
        if (Settings.getSettings().online == false) {
            if (Util.isDebug()) {
                this.log("client is offline");
            }
            this.disableControls( true );
            if (this.owner.$.pane !== undefined && this.owner.$.pane.getViewName() == "preferences") {
                this.owner.showFailurePopup($L("In offline mode all preferences are read-only!"), $L("Warning!"));
            }
        }
        else if (Settings.getSettings().syncInProgress == true){
            if (Util.isDebug()) {
                this.log("sync in progress");
            }
            this.disableControls( true );
            if (this.owner.$.pane !== undefined && this.owner.$.pane.getViewName() == "preferences") {
                this.owner.showFailurePopup($L("Synchronization is ongoing: Preferences are read-only during that process!"), $L("Warning!"));
            }
        }
        else {
            this.disableControls( false );
        }
        
        var orientation = enyo.getWindowOrientation();
        if (orientation == "left" || orientation == "right") {
            // portrait
            this.$.scroller.height = 700;  
        } else {
            // landscape
            this.$.scroller.height = 900;  
        }
        
        this.readFromLocalStorage();

        if (this.owner.$.dataManager !== undefined) {

            var lists = this.owner.$.dataManager.getAvailableShoppingLists();
            
            var items = [];  
            var selectedIndex = 0;      
            for (key in lists) {
                var obj = lists[key];
                // this.log("obj: " + JSON.stringify(obj) );
                // this.$.listSelector.createComponent( {caption: obj.name}, {owner: this} );
                // items.push( $L(obj.name) );
                items.push( { caption: obj.name, value: obj.uuid } );
                if (Settings.getSettings().shoppingList == obj.uuid) {
                    selectedIndex = obj.uuid;
                    if (Util.isDebug()) {
                        this.log("found currently prefered shopping list: " + obj.name);
                    }
                }   
            }
            
            // this.log("items: " + items.length);
            this.$.shoppingList.setItems( items );
            this.$.shoppingList.setValue( selectedIndex );
            this.$.shoppingList.render( );
        }


    },
    
    saveData : function( ) {
        if (Util.isDebug()) {
            this.log("username: " + this.$.username.getValue());
        }
        // this.log("password: " + this.$.password.getValue());
        var newUsernameValue = this.$.username.getValue();
        var newPasswordValue = this.$.password.getValue();
        // if (username !== undefined && password !== undefined) {
            // newUsernameValue = username;
            // newPasswordValue = password;
            // this.$.username.setValue( newUsernameValue );
            // this.$.password.setValue( newPasswordValue );
        // } else {
            // newUsernameValue = ;
            // newPasswordValue = ;
        // }
        // this.log("newUsernameValue: " + newUsernameValue);
        // this.log("newPasswordValue: " + newPasswordValue);
        
        if (Platform.isWebOS() && Platform.isTouchpad() == true) {
            var newUseAdvancedBrowser = this.$.useAdvancedBrowser.getChecked();
            if (Util.isDebug()) {
                this.log("newUseAdvancedBrowser: " + newUseAdvancedBrowser);
            }
            
            // var newMaximizeView = this.$.maximizeView.getChecked();
            // this.log("newMaximizeView: " + newMaximizeView);
        } else if (Platform.isWebOS() && !Platform.isTouchpad()) {
            var newUseRotationLock = this.$.useRotationLock.getChecked();
            if (Util.isDebug()) {
                this.log("newUseRotationLock: " + newUseRotationLock);
            }
        }
        
        if (Platform.isWebOS()) {
            var newBgSyncIntervalSelector = this.$.bgSyncIntervalSelector.getValue();
            if (Util.isDebug()) {
                this.log("newBgSyncIntervalSelector: " + newBgSyncIntervalSelector);
            }
        }
        
        var newHideDelete = this.$.hideDelete.getChecked();
        if (Util.isDebug()) {
            this.log("newHideDelete: " + newHideDelete);
        }

        var showListScrollbar = this.$.showListScrollbar.getChecked();
        if (Util.isDebug()) {
            this.log("showListScrollbar: " + showListScrollbar);
        }
        
        if (Platform.isWebOS() || Platform.isBrowser()) {
            var newDebugOutput = this.$.debugOutput.getChecked();
            if (Util.isDebug()) {
                this.log("newDebugOutput: " + newDebugOutput);
            }
        }
        
        var newAutoSync = this.$.autoSyncEnabled.getChecked();
        if (Util.isDebug()) {
            this.log("newAutoSync: " + newAutoSync);
        }
      	var newDownloadImages = this.$.downloadImages.getChecked();
        /*var newAutoDownloadArticles = this.$.autoDownloadArticlesEnabled.getChecked();
        this.log("newAutoDownloadArticles: " + newAutoDownloadArticles);
        var newArticleLimit = this.$.articleLimitSelector.getValue();
        this.log("newArticleLimit: " + newArticleLimit);*/
        
        var newShoppingList = this.$.shoppingList.getValue();
        if (Util.isDebug()) {
            this.log("newShoppingList: " + newShoppingList);
        }
        
        this.writeToLocalStorage( newUsernameValue, newPasswordValue, newUseAdvancedBrowser, newUseRotationLock, newBgSyncIntervalSelector, newAutoSync, newDownloadImages, newHideDelete, newShoppingList, newDebugOutput, showListScrollbar);
    },

    setAccountVerified : function ( value ) {
        if (Util.isDebug()) {
            this.log("value: " + value);
        }
        localStorage.removeItem("accountVerified");     
        localStorage.setItem("accountVerified", value);
    },
         
    getAccountVerified : function ( ) {
        var accountVerified = localStorage.getItem("accountVerified");
        return accountVerified == "true" ? true : false;
    },
         
   discardChanges : function( ) {
        localStorage.removeItem("username");     
        localStorage.removeItem("password");     
        this.$.username.setValue("");
        this.$.password.setValue("");
        this.setAccountVerified( false );
    }, 
    
    writeToLocalStorage : function ( username, password, useAdvancedBrowser, useRotationLock, bgSyncInterval, autoSync, downloadImages, hideDelete, shoppingList, debugOutput, showListScrollbar ) {
        if (Util.isDebug()) {
            this.log("START");

            this.log("username: '" + username + "'");
            // this.log("password: '" + password + "'");
            this.log("useAdvancedBrowser: '" + useAdvancedBrowser + "'");
            // this.log("maximizeView: '" + maximizeView + "'");
            this.log("useRotationLock: '" + useRotationLock + "'");
            this.log("bgSyncInterval: '" + bgSyncInterval + "'");
            this.log("autoSync: '" + autoSync + "'");
            // this.log("autoDownloadArticles: '" + autoDownloadArticles + "'");
            this.log("downloadImages: '" + downloadImages + "'");
            // this.log("articleLimit: '" + articleLimit + "'");
            this.log("hideDelete: '" + hideDelete + "'");
            this.log("debugOutput: '" + debugOutput + "'");
            this.log("shoppingList: '" + shoppingList + "'");
            this.log("showListScrollbar: '" + showListScrollbar + "'");            
        }

        if (Util.isDebug()) {
            this.log("write to localstorage");
        }
        // write to localstorage
        if (username !== undefined && username != null && password !== undefined && password != null) {
            localStorage.removeItem("username");     
            localStorage.setItem("username", username);
            localStorage.removeItem("password");     
            localStorage.setItem("password", password);
            localStorage.removeItem("accountVerified");     
            localStorage.setItem("accountVerified", true);
        }

        localStorage.removeItem("useAdvancedBrowser");     
        localStorage.setItem("useAdvancedBrowser", useAdvancedBrowser);
             
        /*localStorage.removeItem("maximizeView");     
        localStorage.setItem("maximizeView", maximizeView);*/
        localStorage.removeItem("useRotationLock");     
        localStorage.setItem("useRotationLock", useRotationLock);
        
        localStorage.removeItem("bgSyncInterval");     
        localStorage.setItem("bgSyncInterval", bgSyncInterval);
        localStorage.removeItem("autoSync");     
        localStorage.setItem("autoSync", autoSync);
        localStorage.removeItem("downloadImages");     
        localStorage.setItem("downloadImages", downloadImages);

        localStorage.removeItem("hideDelete");     
        localStorage.setItem("hideDelete", hideDelete);
        
        localStorage.removeItem("debugOutput");     
        localStorage.setItem("debugOutput", debugOutput);
        
        localStorage.removeItem("shoppingList");     
        localStorage.setItem("shoppingList", shoppingList);
        
        localStorage.removeItem("showListScrollbar");     
        localStorage.setItem("showListScrollbar", showListScrollbar);
        
        var appinfo = enyo.fetchAppInfo();
        localStorage.setItem("lastVersion", appinfo.version);
        
        // force reloading the settings
        if (Util.isDebug()) {
            this.log("force reloading the settings");
        }
        var tmp = Settings.getSettings( true );

        if (Util.isDebug()) {
            this.log("END");
        }
    },    
    
    readFromLocalStorage : function( ) {
        if (Util.isDebug()) {
            this.log("START");
        }

        // grab items from storage         
        var accountVerified = Settings.getSettings().accountVerified;
        var username = Settings.getSettings().username;
        var password = Settings.getSettings().password;
        
        var useAdvancedBrowser = Settings.getSettings().useAdvancedBrowser;
        // var maximizeView = Settings.getSettings().maximizeView;
        var useRotationLock = Settings.getSettings().useRotationLock;

        var bgSyncInterval = Settings.getSettings().bgSyncInterval;
        var autoSync = Settings.getSettings().autoSync;
        // var autoDownloadArticles = Settings.getSettings().autoDownloadArticles;
        var downloadImages = Settings.getSettings().downloadImages;
        var hideDelete = Settings.getSettings().hideDelete;
        var debugOutput = Settings.getSettings().debugOutput;
        var shoppingList = Settings.getSettings().shoppingList;
        var showListScrollbar = Settings.getSettings().showListScrollbar;
        
        if (Util.isDebug()) {
            this.log("username: '" + username + "'");
            // this.log("password: '" + password + "'");
            this.log("accountVerified: '" + accountVerified + "'");
            this.log("useAdvancedBrowser: '" + useAdvancedBrowser + "'");
            // this.log("maximizeView: '" + maximizeView + "'");
            this.log("useRotationLock: '" + useRotationLock + "'");
            this.log("bgSyncInterval: '" + bgSyncInterval + "'");
            this.log("autoSync: '" + autoSync + "'");
            this.log("downloadImages: '" + downloadImages + "'");
            this.log("hideDelete: '" + hideDelete + "'");
            this.log("debugOutput: '" + debugOutput + "'");
            this.log("shoppingList: '" + shoppingList + "'");
            this.log("showListScrollbar: '" + showListScrollbar + "'");            
        }
        
        // write to ui        
        this.$.username.setValue( username );
        this.$.password.setValue( password );
        this.$.autoSyncEnabled.setChecked( autoSync );
       	this.$.downloadImages.setChecked( downloadImages );
        this.$.hideDelete.setChecked( hideDelete );
        this.$.showListScrollbar.setChecked( showListScrollbar );
        if (this.$.debugOutput && (Platform.isWebOS() || Platform.isBrowser())) {
            this.$.debugOutput.setChecked( debugOutput );
        }
        this.$.shoppingList.setValue( shoppingList );
        if (Platform.isWebOS() && this.$.bgSyncIntervalSelector) {
            this.$.bgSyncIntervalSelector.setValue( bgSyncInterval );
        }
        // this.$.articleLimitSelector.setValue( articleLimit );
        
        if (Platform.isWebOS() && Platform.isTouchpad() == true && this.$.useAdvancedBrowser) {
            this.$.useAdvancedBrowser.setChecked( useAdvancedBrowser );
            // this.$.maximizeView.setChecked( maximizeView );
        } else if (Platform.isWebOS() && !Platform.isTouchpad() && this.$.useRotationLock) {
            this.$.useRotationLock.setChecked( useRotationLock );
        }
        
        if (accountVerified == true) {
            this.markAccountVerified();
        }
        
        if (Util.isDebug()) {
            this.log("END");
        }
    },

    getValueFromUiAndStoreIt : function( ) {
        if (Util.isDebug()) {
            this.log("START");
        }
        // get value from ui 
        var username = "";
        var password = "";
        if (Settings.getSettings().accountVerified == true || Settings.getSettings().accountVerified == "true") {
            username = this.$.username.getValue( );
            password = this.$.password.getValue( );
        }

        if (Platform.isWebOS() && Platform.isTouchpad() == true) {
            var useAdvancedBrowser = this.$.useAdvancedBrowser.getChecked( );
            // var maximizeView = this.$.maximizeView.getChecked( );
        } else if (Platform.isWebOS() && !Platform.isTouchpad()) {
            var useRotationLock = this.$.useRotationLock.getChecked( );
        }

        if (Platform.isWebOS()) {
            var bgSyncInterval = this.$.bgSyncIntervalSelector.getValue( );
        }
        var autoSync = this.$.autoSyncEnabled.getChecked( );
        // var autoDownloadArticles = this.$.autoDownloadArticlesEnabled.getChecked( );
       	var downloadImages = this.$.downloadImages.getChecked( );
        var hideDelete = this.$.hideDelete.getChecked( );
        var showListScrollbar = this.$.showListScrollbar.getChecked( );
        
        if (Platform.isWebOS() || Platform.isBrowser()) {
            var debugOutput = this.$.debugOutput.getChecked( );
        }
        var shoppingList = this.$.shoppingList.getValue( );
        // var articleLimit = this.$.articleLimitSelector.getValue( );

        this.writeToLocalStorage( username, password, useAdvancedBrowser, /*maximizeView,*/ useRotationLock, bgSyncInterval, autoSync, downloadImages, hideDelete, shoppingList, debugOutput, showListScrollbar );
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    clearLocalData : function( logout ) {
        
        if (Settings.getSettings().syncInProgress == true) {
            this.owner.showFailurePopup($L("There is currently a sync in progress. Data can not be cleared now!"), $L("Failure!"));
            return;
        }
        
        if (this.owner.$.dataManager.getStoredOffline().length > 0) {
            this.owner.showFailurePopup($L("There is currently a sync in progress. Data can not be cleared now!"), $L("Failure!"));
            return;
        }

        if (Util.isDebug()) {
            this.log("START");
        }
        this.$.clearLocalDataButton.setActive(true);
        
        // load settings from storage
        var fontsize = localStorage.getItem("fontsize");
        var fontfamily = localStorage.getItem("fontfamily");
        var online = localStorage.getItem("online");
        var shard = localStorage.getItem("shard");
        var email = localStorage.getItem("email");
        var profilepic = localStorage.getItem("profilepic");
        var firstname = localStorage.getItem("firstname");
        var lastname = localStorage.getItem("lastname");
        var twitter = localStorage.getItem("twitter");
        var website = localStorage.getItem("website");

        // this.owner.$.dataManager.clearDbData();

        // delete items from storage
        localStorage.clear();

        // show empty page and clear selection
        this.owner.$.feedWebViewPane.showEmptyPage();
        this.owner.$.itemListPane.clearSelection();

        this.owner.$.dataManager.setItemsAll([]);
        this.owner.$.dataManager.setFeedItems([]);
        this.owner.$.dataManager.setNotebooks([]);
        this.owner.$.dataManager.setDownloadedArticles([]);
        this.owner.$.dataManager.setCurrentlyWaiting([]);
        this.owner.$.dataManager.setCurrentlyLoading([]);
        this.owner.$.dataManager.setCancelImageDownload([]);
        this.owner.$.dataManager.setTotalItemsToDownload([]);
        this.owner.$.dataManager.setAvailableTags([]);
        this.owner.$.dataManager.setAvailableTypes([]);
        this.owner.$.dataManager.setStoredOffline([]);
        this.owner.$.itemListPane.filterActive( false );
        localStorage.removeItem( "notebook" );
        localStorage.removeItem( "filterTags" );
        localStorage.removeItem( "filterType" );

        
        if (Platform.isPlaybook()) {
            var dirs = blackberry.io.dir.appDirs.app.storage.path;
            var filePath = String(dirs) + "/items.data";
            try {
                if (blackberry.io.file.exists(filePath)) {
                    blackberry.io.file.deleteFile(filePath);
                }
            }
            catch (e) {
                alert("error in delete file: " + e);
            }     
        } else if (Platform.isBB10()) {
            var filePath = filePath = blackberry.io.home + "/items.data";
            
            function gotFs(fs) {
                fs.root.getFile(filePath, {create: false}, gotFile, enyo.bind( this, this.errorHandler));
            }

            function gotFile(fileEntry) {
                fileEntry.createWriter(gotWriter, enyo.bind( this, this.errorHandler));
            }

            function gotWriter(fileWriter) {
                fileWriter.onerror = function (e) {
                    alert("Failed to write file: " + e.toString());
                }
                fileWriter.write(null);
            }
            
            window.requestFileSystem(window.PERSISTENT, 1024 * 1024 * 5, gotFs, enyo.bind( this, this.errorHandler));
        }

        this.owner.$.notebookListPane.$.feedList.punt();
        this.owner.$.notebookListPane.$.countLabel.setContent("0 " + $L("Notebooks"));
        this.owner.$.notebookListPane.selectView("emptyList");

        this.owner.$.itemListPane.$.feedList.punt();
        this.owner.$.itemListPane.$.countLabel.setContent("0 " + $L("items"));
        this.owner.$.itemListPane.selectView("emptyList");

        
        this.$.clearLocalDataButton.setCaption($L("Cleared local data!"));
        this.$.clearLocalDataButton.setStyle("background-color: green; color: #FFFFFF; font-weight:bold;");
        if (Platform.isWebOS() && Platform.isTouchpad() == false) {
            if (this.$.changedRotationLock) {
                this.$.changedRotationLock.destroy();
                this.$.generalSettingsRG.render();
            }
        }
        
        // store values to storage
        localStorage.setItem( "fontsize", fontsize );
        localStorage.setItem( "fontfamily", fontfamily );
        localStorage.setItem( "notebook", "All_My_Stuff" );
        localStorage.setItem( "filterTags", "" );
        localStorage.setItem( "filterType", "" );
        localStorage.setItem( "lastVersion", enyo.fetchAppInfo().version)
        localStorage.setItem( "online", online );
        localStorage.setItem( "shard", shard );
        localStorage.setItem( "email", email );
        localStorage.setItem( "profilepic", profilepic );
        localStorage.setItem( "firstname", firstname );
        localStorage.setItem( "lastname", lastname );
        localStorage.setItem( "twitter", twitter );
        localStorage.setItem( "website", website );
        
        
        this.owner.$.dataManager.deleteDownloadedImages();
        
        this.getValueFromUiAndStoreIt( ); 
        
        if (logout == true) {
            localStorage.setItem( "username", "" );
            localStorage.setItem( "password", "" );
            localStorage.setItem( "accountVerified", false );
        }
        
        Settings.getSettings( true );
        
        this.$.clearLocalDataButton.setActive(false);
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    markAccountVerified : function( ) {
        if (Util.isDebug()) {
            this.log("START");
        }
        // this.log("markAccountVerified()");
        
        if (Settings.getSettings().online == true) {
            this.$.logoutButton.setDisabled( false );
        }
        this.$.logoutButton.addClass("enyo-button-negative");
        
        this.setAccountVerified( true );
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    resetVerified : function( ) {
        if (Util.isDebug()) {
            this.log("START");
        }
        this.$.logoutButton.removeClass("enyo-button-negative");
        this.setAccountVerified( false );
        // this.discardChanges();
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    downloadImagesClicked : function( inSender, inValue, inOldValue ) {
        if (Util.isDebug()) {
            this.log("START");
        }

        var newDownloadImages = this.$.downloadImages.getChecked();
        if (Util.isDebug()) {
            this.log("newDownloadImages: " + newDownloadImages );
        }
        var oldDownloadImages = Settings.getSettings().downloadImages;
        if (Util.isDebug()) {
            this.log("oldDownloadImages: " + oldDownloadImages );
        }
        
        this.saveData();

        if ( newDownloadImages != oldDownloadImages ) {
            if (Util.isDebug()) {
                this.log("downloadImages has changed to " + newDownloadImages);
            }
        }
        
        if (newDownloadImages == true) {
            // clear local data should be called
            this.$.activeDownloadImagesDialog.openAtCenter();            
        }
        
        if (Util.isDebug()) {
            this.log("END");
        }
    },

    showConfirmClearDataDialog : function() {
        if (this.owner.$.dataManager.getStoredOffline().length > 0) {
        	this.$.clearOfflineDataDialog.openAtCenter();
        } else {
            this.$.clearDataDialog.openAtCenter();            
        }
    },
  
    confirmClearData : function( inSender, inValue, inOldValue ) {
        if (Util.isDebug()) {
            this.log("START");
        }
        this.clearLocalData();
        this.closeClearDataDialog();
        this.closeClearOfflineDataDialog();
        if (Util.isDebug()) {
            this.log("END");
        }
    },
  
    checkboxClicked : function( inSender, inValue, inOldValue ) {
        if (Util.isDebug()) {
            this.log("START");
        }
        this.saveData();
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    /*articleLimitChanged: function( inSender, inValue, inOldValue ) {
        this.log("START");
        // this.log("inSender: " + inSender + ", Value: " + inValue + ", inOldValue: " + inOldValue);
        
        // this.setArticleLimit( inValue );
        if (inValue !== undefined) {
            this.saveData();

            this.resetClearLocalDataButton();
            // this.$.changedArticleLimit.show();
            // this.$.changedArticleLimit.setStyle("color: red;");
            // this.$.changedArticleLimit.setLabel("After changing the article download limit your should clear all local data to keep data consistent!"); 
        }
        this.log("END");
    },*/

    changedRotationLock: function( inSender, inValue, inOldValue ) {
        if (Util.isDebug()) {
            this.log("START");
        }

        // if (inValue !== undefined) {
            this.saveData();
            if (Util.isDebug()) {
                this.log("show label...");
            }
            // this.resetClearLocalDataButton();
            this.$.changedRotationLock.show();
            this.$.generalSettingsRG.createComponent( {kind: "LabeledContainer", name: "changedRotationLock"}, {owner: this} );
            this.$.generalSettingsRG.render();
            this.$.changedRotationLock.setStyle("color: red;");
            this.$.changedRotationLock.setLabel("App must be restarted for this change to become effective!"); 
        // }
        if (Util.isDebug()) {
            this.log("END");
        }
    },

    bgSyncIntervalChanged: function( inSender, inValue, inOldValue ) {
        if (Util.isDebug()) {
            this.log("START");
        }
        // this.log("inSender: " + inSender + ", Value: " + inValue + ", inOldValue: " + inOldValue);
        
        // this.setArticleLimit( inValue );
        if (inValue !== undefined && inValue != Settings.getSettings().bgSyncInterval) {
            this.saveData();
            var appId = enyo.fetchAppInfo().id;
            var time = Settings.getAlarmTimeFromSettings();
            if (Util.isDebug()) {
                this.log("time: " + time);
            }
            if (time == null) {
                this.clearAlarm();
            } else {
                if (Util.isDebug()) {
                    this.log("set next bgsync in: " + time);
                }
                this.$.setAlarm.call({
                    "wakeup" : true, 
                    "key" : appId + ".sync", 
                    "uri":"palm://com.palm.applicationManager/launch",
                    "params" : {"id" : appId, "params": {"action" : "doSync"}},
                    "in": time
                });
            }

        }
        if (Util.isDebug()) {
            this.log("END");
        }
    },
    
    clearAlarm : function( ) {
        if (Platform.isWebOS()) {
            var appId = enyo.fetchAppInfo().id;
            if (Util.isDebug()) {
                this.log("clearing alarm! ");
            }
            this.$.clearAlarm.call({
                "key" : appId + ".sync" 
            });
        }
    },

    doneClick : function() {
        if (this.getAccountVerified() == true) {
            this.owner.$.pane.selectViewByName("feedSlidingPane");
            
            if (Platform.isWebOS()) {
                var appId = enyo.fetchAppInfo().id;
                var time = Settings.getAlarmTimeFromSettings();
                if (Util.isDebug()) {
                    this.log("time: " + time);
                }
                if (time == null) {
                    this.clearAlarm();
                } else {
                    if (Util.isDebug()) {
                        this.log("set next bgsync in: " + time);
                    }
                    this.$.setAlarm.call({
                        "wakeup" : true, 
                        "key" : appId + ".sync", 
                        "uri":"palm://com.palm.applicationManager/launch",
                        "params" : {"id" : appId, "params": {"action" : "doSync"}},
                        "in": time
                    });
                }
            }

        } else {
            this.clearAlarm();
            this.discardChanges();
            this.clearLocalData();
            if (Util.isDebug()) {
                this.log("no valid userdata entered. directing user to welcome page...");
            }
            this.owner.$.pane.selectViewByName("welcomePane");
        }
        Settings.getSettings( true );
    },

    closeImageDialog : function() {
        this.$.activeDownloadImagesDialog.close();  
    },
    
   closeClearDataDialog : function() {
       this.$.clearDataDialog.close();  
   },
   
   showConfirmLogoutDialog : function() {
       this.$.logoutDialog.openAtCenter();            
   },
  
   closeLogoutDialog : function() {
       this.$.logoutDialog.close();  
   },
   
   logoutAccount : function() {
       if (Util.isDebug()) {
           this.log();
       }
       this.$.username.setValue( "" );
       this.$.password.setValue( "" );
       this.resetVerified();
       this.clearLocalData( true );
       Settings.getSettings( true );
       this.$.logoutDialog.close();  
   },

   closeClearOfflineDataDialog : function() {
       this.$.clearOfflineDataDialog.close();  
   },
   
   closeNeedsRestartDialog : function() {
       this.$.needsRestartDialog.close();  
   },
   
   showScrollbarClicked : function( inSender, inValue, inOldValue ) {
       if (Util.isDebug()) {
           this.log("START");
       }

       var newShowListScrollbar = this.$.showListScrollbar.getChecked();
       if (Util.isDebug()) {
           this.log("newShowListScrollbar: " + newShowListScrollbar );
       }
       var oldShowListScrollbar = Settings.getSettings().showListScrollbar;
       if (Util.isDebug()) {
           this.log("oldShowListScrollbar: " + oldShowListScrollbar );
       }
       
       this.saveData();

       if ( newShowListScrollbar != oldShowListScrollbar ) {
           if (Util.isDebug()) {
               this.log("showListScrollbar has changed to " + newShowListScrollbar);
           }
           this.$.needsRestartDialog.openAtCenter();            
       }
       
       if (Util.isDebug()) {
           this.log("END");
       }
   },
   
   errorHandler : function (fileError) {
       var msg = '';

       switch (fileError.code) {
           case FileError.QUOTA_EXCEEDED_ERR:
               msg = 'QUOTA_EXCEEDED_ERR';
               break;
           case FileError.NOT_FOUND_ERR:
               msg = 'NOT_FOUND_ERR';
               break;
           case FileError.SECURITY_ERR:
               msg = 'SECURITY_ERR';
               break;
           case FileError.INVALID_MODIFICATION_ERR:
               msg = 'INVALID_MODIFICATION_ERR';
               break;
           case FileError.INVALID_STATE_ERR:
               msg = 'INVALID_STATE_ERR';
               break;
           case FileError.NO_MODIFICATION_ALLOWED_ERR:
               msg = 'NO_MODIFICATION_ALLOWED_ERR';
               break;
           default:
               msg = 'File Error';
               break;
       };

       alert('Error: ' + msg);
   }

});