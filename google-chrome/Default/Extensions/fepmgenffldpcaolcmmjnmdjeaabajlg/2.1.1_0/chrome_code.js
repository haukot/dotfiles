console.log("adding event listener...");

document.addEventListener( "DOMContentLoaded", function(){
    document.removeEventListener( "DOMContentLoaded", arguments.callee, false );
    if (Util.isDebug()) {
        console.log("starting the app");
    }

    // localStorage.clear();
            
    var startNormal = false;
    if (Settings.getSettings().accountVerified == true && Settings.getSettings().username != "" && Settings.getSettings().password != "") {
        startNormal = true;
    }

    var theApp = new MeOrg().renderInto(document.body);

    if (Util.isDebug()) {
        console.log("everything should be rendered right now?!");
    }
    if (startNormal == true) {
        theApp.normalStart();
    } else {
        theApp.showWelcomePage();
    }
}, false );

                    
