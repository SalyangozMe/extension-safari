var delayedShare, animation;

function openURLInNewTab(url){
	var newTab = safari.application.activeBrowserWindow.openTab();
	newTab.url = url;
}

function performCommand(event) {
    // Make sure event comes from the button
    if (event.command == sharePageToSalyangozCommand) {
    	currentURL = safari.application.activeBrowserWindow.activeTab.url;
    	validationResult = validateURL(currentURL);
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
    			fetchTokenFromServiceWithCompletion(function(response){
                    if (response) {
                        if (response.status) {
                            if (response.token && response.id) {
                                var pageTitle = safari.application.activeBrowserWindow.activeTab.title;
                                createPostWithCompletion(pageTitle, currentURL, response.token, response.id, function(){
                                    if (response.success) {
                                        safari.application.activeBrowserWindow.activeTab.page.dispatchMessage(dataPassMessageName, "showSalyangoz");
                                    }
                                });
                            }
                        }else{
                            openURLInNewTab(salyangozLoginURL);
                        }
                    }
    			});
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