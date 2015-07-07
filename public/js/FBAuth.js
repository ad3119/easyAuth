var FBAuth = function() {
    var statusChangeCallback = function(response) {
        console.log('statusChangeCallback');
        if (response.status === 'connected') {
            // Logged into your app and Facebook.
            console.log("Access token: " + response.authResponse.accessToken);
            fetchUserProfile(response.authResponse.accessToken);
            
        } else if (response.status === 'not_authorized') {
            // The person is logged into Facebook, but not your app.
            
        } else {
            // The person is not logged into Facebook, so we're not sure if
            // they are logged into this app or not.
            console.log('Initiating login..');
            FB.login(function(response) {
                if (response.status === 'unknown') {
                	console.log('Login failed');
                    return; // return, user not logged in
                }
                console.log("After FB login..."); // here user has logged in
                console.log("Access token: " + response.authResponse.accessToken); // response with status & access_token
                fetchUserProfile(response.authResponse.accessToken);
            }, {
                scope: 'email,user_friends,public_profile'
            });
        }
    };

    var checkLoginState = function() {
        FB.getLoginStatus(function(response) {
            statusChangeCallback(response);
        });
    };

    window.fbAsyncInit = function() {
        FB.init({
            appId: '455415931304718',
            cookie: true, // enable cookies to allow the server to access the session
            xfbml: true, // parse social plugins on this page
            version: 'v2.3' // use version 2.3
        });
    };

    // Load the SDK asynchronously
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));


    var fetchUserProfile = function(accessToken) {
        console.log('Fetching your information..');
        var profile = $.get('https://graph.facebook.com/me?access_token='+accessToken);
        var friends = $.get('https://graph.facebook.com/me/friends?access_token='+accessToken);
        $.when(profile, friends).then(function(profile, friends) {
            // Construct user profile
            var user = {};
            user.id = profile[0].id;
            user.email = profile[0].email;
            user.name = profile[0].name;
            user.gender = profile[0].gender;
            user.link = profile[0].link;
            user.friends = friends[0].data;
            user.picture = "https://graph.facebook.com/" + user.id + "/picture?return_ssl_resources=1";
            // Done
            console.log("Complete user information: ");
            console.log(user);

        },
        function(xhr, status, error) {
            console.log('Ajax error: ' + status);
        });
    };

    var logout = function() {
        FB.logout(function(response) {
            console.log('Logging out..');
            console.log(response);
            console.log('User is now logged out.');
        });
    };
    
    return {
        login: checkLoginState,
        logout: logout
    };
}();