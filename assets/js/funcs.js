var delayedShare, animation;

function openURLInNewTab(url){
	var newTab = safari.application.activeBrowserWindow.openTab();
	newTab.url = url;
}

function respondToMessage(messageEvent) {
    if(messageEvent.name === "foundToken") {
        var response = messageEvent.message;
        if (response.status) {
            createPostWithTokenResponse(response);
        }else{
            openURLInNewTab(salyangozLoginURL);
        }
    }
}

function createPostWithTokenResponse(response){
    if (response) {
        var currentURL = safari.application.activeBrowserWindow.activeTab.url;
        var pageTitle = safari.application.activeBrowserWindow.activeTab.title;
        var postData = {"id":response.id, "token":response.token, "title":pageTitle, "url":currentURL};
        safari.application.activeBrowserWindow.activeTab.page.dispatchMessage("createPost", postData);
    }
}

function performCommand(event) {
    // Make sure event comes from the button
    if (event.command == sharePageToSalyangozCommand) {
        var currentURL = safari.application.activeBrowserWindow.activeTab.url;
    	var validationResult = validateURL(currentURL);
        var pageTitle = safari.application.activeBrowserWindow.activeTab.title;
    	switch(validationResult){
    		case -1:
    			alert(urlValidationErrorMessageBlankPage);
    			break;
    		case -2:
    			alert(urlValidationErrorMessageSuspiciousFile);
    			break;
    		case -3:
    			alert(urlValidationErrorMessageSalyangozception);
    			break;
    		case -4:
    			alert(urlValidationErrorMessageLocalhost);
    			break;	
    		case 1:
                safari.application.activeBrowserWindow.activeTab.page.dispatchMessage("fetchToken", null);
    			break;
    		default:
    			break;
    	}
    }
}

function validateURL(url){
	if(!url){
		return -1;
	}else if (url.match(/^ftp\:|^javascript\:|^data\:/)) {
  		return -2;
  	}else if (url.match(/^http\:\/\/([a-z]+\.)?salyangoz\.me(\/.*)?/)) {
  		return -3;
  	}else if (url.match(/^https?\:\/\/localhost[/:]?/)) {
    	return -4;
  	}else{
  		return 1;
  	}
}

function showMessage(message){
	alert(message);
}