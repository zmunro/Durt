function statusChangeCallback(response) {
	if (response.status === 'connected') {
		checkUser(response.authResponse.userID);
  }
	if (response.status != 'connected') {
		document.getElementById("login").innerHTML = "";
    document.getElementById("gardenNav").href = "/login";
	}
}

function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
}

function checkUser(userID) {
    var request = new XMLHttpRequest();
    var url = "https://durt2.herokuapp.com/getUser";
    request.open("POST", url, true);
    request.setRequestHeader("Content-type", "application/json");
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            rawData = request.responseText;
            info = JSON.parse(rawData);
            if (info.name == "newUser") {
                document.getElementById("gardenNav").href = "/getStarted";
            }
            else {
              document.getElementById("gardenNav").href= "/manageGarden";
            }
        }
    }
    request.send(JSON.stringify({"_id":userID}));
}

function gardenRedirect(response) {
    if (response.status === 'connected') {
      // do nothing
    }
    else {
      document.getElementById("gardenNav").href= "/login";
    }
}

function getUserInfo(profile) {
  FB.api('/me', {fields: 'name, email'}, function(response) {
    var name = response.name.split(" ");
    profile.first = name[0];
    profile.last = name[1];
    profile._id = response.id;
    profile.email = response.email;
    postUser(profile);
  });
}

function fbLogout() {
    FB.logout(function (response) {
        //Do what ever you want here when logged out like reloading the page
        window.location.reload();
    });
}

window.fbAsyncInit = function() {
  FB.init({
    appId      : '1521184151311475',
    cookie     : true,  // enable cookies to allow the server to access 
                        // the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.8' // use graph api version 2.8
  });

  FB.getLoginStatus(function(response) {
    gardenRedirect(response);
  });
};

(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));