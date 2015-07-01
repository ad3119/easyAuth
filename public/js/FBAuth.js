var FBAuth = function() {
    function statusChangeCallback(response) {
        console.log('statusChangeCallback');
        if (response.status === 'connected') {
            // Logged into your app and Facebook.
            fetchUserProfile();
            
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
                console.log(response); // response with status & access_token
                fetchUserProfile();
            }, {
                scope: 'email,user_friends,public_profile'
            });
        }
    }

    function checkLoginState() {
        FB.getLoginStatus(function(response) {
            statusChangeCallback(response);
        });
    }

    window.fbAsyncInit = function() {
        FB.init({
            appId: '455415931304718',
            cookie: true, // enable cookies to allow the server to access the session
            xfbml: true, // parse social plugins on this page
            version: 'v2.3' // use version 2.2
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


    function fetchUserProfile() {
        console.log('Welcome!  Fetching your information.... ');
        FB.api('/me', function(response) {
            var user = {};
            console.log('User API: ');
            console.log(response);

            // Construct user profile
            user.id = response.id;
            user.email = response.email;
            user.name = response.name;
            user.gender = response.gender;
            user.link = response.link;

            // Nesting callback to get friends
            FB.api('/me/friends', function(response) {
                console.log('Friends API: ');
                console.log(response);

                // Add user friends
                user.friends = response.data;

                // Nesting callback to get profile pic
                FB.api('/' + user.id + '/picture', function(response) {
                    console.log('Picture API: ');
                    console.log(response);

                    // Add user profile pic
                    user.picture = response.data.url;

                    console.log('Complete user info:');
                    console.log(user);
                });
            });
        });
    }

    function logout() {
        FB.logout(function(response) {
            console.log('Logging out..');
            console.log(response);
            console.log('User is now logged out.');
        });
    }

    return {
        login: checkLoginState,
        logout: logout
    };
}();