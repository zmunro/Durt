function statusChangeCallback(response) {
    console.log(response);
    if (response.status === 'connected') {
        // Logged into your app and Facebook.
        var userID = response.authResponse.userID;
        checkUser(userID);
    }
    else {
        window.location.href = "/login";
    }
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
                window.location.href = "/getStarted"
            }
            else {
                window.location.href = "/manageGarden"
                //TODO render garden
            }
        }
    }
    request.send(JSON.stringify({"_id":userID}));
}

function renderGarden(info) {
}









function checkLoginState() {
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
}

window.fbAsyncInit = function() {
    FB.init({
        appId      : '1521184151311475',
        cookie     : true,
        xfbml      : true,
        version    : 'v2.11'
    });

    // FB.getLoginStatus(function(response) {
    //     statusChangeCallback(response);
    // });
};

// Load the SDK asynchronously
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;

    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
