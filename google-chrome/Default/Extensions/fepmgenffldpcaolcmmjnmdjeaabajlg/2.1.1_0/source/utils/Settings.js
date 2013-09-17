enyo.kind({
	name: "Settings",
	kind: "GeneralSettings",
	statics: {

		// collect data from storage   
		getSettings: function(forceReload) {
			if (null == this.settings || true == forceReload) {
				this.settings = {
                	apiKey : "08abfc557f854d60aecbb550b83a1ec6", 
					accountVerified : Settings.getBooleanItem("accountVerified", false),
					username : Settings.getItem("username", ""),
					// username : Settings.getItem("username", "orlando9579"),
					password : Settings.getItem("password", ""),
					useAdvancedBrowser : Settings.getBooleanItem("useAdvancedBrowser", false),
					maximizeView : Settings.getBooleanItem("maximizeView", false),
					bgSyncInterval : Settings.getItem("bgSyncInterval", "never"),
					autoSync : Settings.getBooleanItem("autoSync", (Platform.isWebOS() ? false : true)),
					downloadImages : Settings.getBooleanItem("downloadImages", false),
					lastVersion : Settings.getItem("lastVersion", enyo.fetchAppInfo().version),
					online : Settings.getBooleanItem("online", false),
					notebook : Settings.getItem("notebook", "All_My_Stuff"),
					filterTags : Settings.getItem("filterTags", ""),
					filterType : Settings.getItem("filterType", ""),
					fontsize : Settings.getItem("fontsize", "19px"),
					lineSpacing : Settings.getItem("lineSpacing", "1.25"),
					fontfamily : Settings.getItem("fontfamily", (Platform.isWebOS() ? "Prelude" : "DejaVu Serif")),
					syncInProgress : Settings.getBooleanItem("syncInProgress", false),
					lastActivity : Settings.getItem("lastActivity", ""),
					sortOrder : Settings.getItem("sortOrder", 1),
					lastRead : Settings.getItem("lastRead", ""),
					lastRow : Settings.getItem("lastRow", -1),
					scrollerArticle : Settings.getItem("scrollerArticle", 0),
					useRotationLock : Settings.getBooleanItem("useRotationLock", true),
					shard : Settings.getItem("shard", ""),
					hideDelete : Settings.getBooleanItem("hideDelete", (Platform.isWebOS() ? true : false)),
					lastSync : Settings.getItem("lastSync", 0),
					email : Settings.getItem("email", ""),
					profilepic : Settings.getItem("profilepic", ""),
					firstname : Settings.getItem("firstname", ""),
					lastname : Settings.getItem("lastname", ""),
					twitter : Settings.getItem("twitter", ""),
					website : Settings.getItem("website", ""),
					shoppingList : Settings.getItem("shoppingList", ""),
					debugOutput : Settings.getBooleanItem("debugOutput", true),
					showListScrollbar : Settings.getBooleanItem("showListScrollbar", (Platform.isTouchpad() || Platform.isBrowser() ? true : false)),
				};
			}
			return this.settings;
		},

		setItem: function(name, value) {
			localStorage.setItem(name, value);
		},

		getItem: function(name, defValue) {
			// this.log("name: " + name + ", defValue: " + defValue);
			var result = localStorage.getItem(name);
			if (result == undefined || result == null || result.trim().length == 0) {
				// this.log("property was not stored");
				localStorage.setItem(name, defValue);
				return defValue;
			}
			// this.log("read property value: " + result );
			return result;
		},

		getBooleanItem: function(name, defValue) {
			// this.log("name: " + name + ", defValue: " + defValue);
			var result = localStorage.getItem(name);
			if (result == undefined || result == null || result.trim().length == 0) {
				// this.log("property was not stored");
				localStorage.setItem(name, defValue);
				return defValue;
			}
			// this.log("read property value: " + result );
			return result == "true" ? true : false
		},

		getAlarmTimeFromSettings: function() {
			if (this.getSettings().bgSyncInterval == "never") {
				return null;
			}
			var pos = this.getSettings().bgSyncInterval.indexOf("S");
			if (pos != -1) {
				return "00:00:" + this.getSettings().bgSyncInterval.substr(0, pos);
			}
			pos = this.getSettings().bgSyncInterval.indexOf("M");
			if (pos != -1) {
				return "00:" + this.getSettings().bgSyncInterval.substr(0, pos) + ":00";
			}
			pos = this.getSettings().bgSyncInterval.indexOf("H");
			if (pos != -1) {
				var str = this.getSettings().bgSyncInterval.substr(0, pos);
				if (str.length < 2) {
					str = "0" + str;
				}
				return str + ":00:00";
			}
			return null;
		},
	},
});
