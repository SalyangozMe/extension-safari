var delayedShare, animation, salyangozContainer;

function appendSalyangoz(){
	salyangozContainer = document.createElement('div');
	salyangozContainer.id = "SalyangozExtension";
	salyangozContainer.className = "Salyangoz";
	salyangozContainer.innerHTML = `
	    <div class="SalyangozContent">
	      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="48" height="48" viewBox="0 0 48 48">
	        <path d="M4.031 31.969v-3.938h15.938v3.938h-15.938zM36 28.031h7.969v3.938h-7.969v8.063h-4.031v-8.063h-7.969v-3.938h7.969v-8.063h4.031v8.063zM28.031 12v4.031h-24v-4.031h24zM28.031 19.969v4.031h-24v-4.031h24z"></path>
	      </svg> Added
	    </div>
	  `;
	document.body.appendChild(salyangozContainer);
	salyangozContainer.classList.add("hidden");
}

function hookMessages(){
	if (window.top === window){
		safari.self.addEventListener("message", handleMessage, false);
	}
}

function handleMessage(msgEvent){
	var messageName = msgEvent.name;
	var messageData = msgEvent.message;

	if (messageName === "toggleContainer") {
        if (messageData === "showContainer") {
            showContainer();
        }else if (messageData === "hideContainer") {
            hideContainer();
        }
    }
    if(messageName == "createPost"){
    	createPost(messageData.id, messageData.token, messageData.title, messageData.url, function(response){
    		if (response.success) {
    			showContainer();
    			hideContainer();
    		}
    	});
    }
    if(messageName == "fetchToken"){
    	fetchTokenFromServiceWithCompletion(function(response){
    		safari.self.tab.dispatchMessage("foundToken", response);
    	});
    }
}

function showContainer(){
	document.getElementById("SalyangozExtension").classList.remove("hidden");
}

function hideContainer() {
    setTimeout(function () {
    	document.getElementById("SalyangozExtension").classList.add("hidden");
    }, 2000)
}

function fetchTokenFromServiceWithCompletion(callback){
    fetch(salyangozServiceTokenFetchURL, {
        credentials: 'include'
    }).then(function (response) {
        return response.json();
    }).then(function (response) {
        callback(response);
    });
}

function createPost(id, token, title, url, callback){
	if (id && token && title && url) {
		var formData = new FormData();
		formData.append('id', id);
		formData.append('token', token);
		formData.append('title', title);
		formData.append('url', url);

		fetch(salyangozServiceAddPostURL, {
	    	method: "POST",
	    	body: formData,
	    	credentials: 'include'
	  	}).then(function (response) {
	    	return response.json()
	    }).then(function (response) {
	    	console.log(response);
	    	if (callback) {
	    		callback(response);
	    	}
	    });
	}
}

(function () {

	if (document.getElementById("SalyangozExtension")) {
	    return;
	}
	
	appendSalyangoz();
	hookMessages();
})();