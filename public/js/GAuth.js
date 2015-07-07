var GAuth = function() {
	// Load the SDK asynchronously
    (function() {
        var po = document.createElement('script');
        po.type = 'text/javascript';
        po.async = true;
        po.src = 'https://apis.google.com/js/client:plusone.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(po, s);
    })();

    var login = function() {
        var config = {
            'client_id': '264266712427-r7ju25u9tisdf1ond6r4n8nk7vc9oo20.apps.googleusercontent.com',
            'scope': 'email https://www.googleapis.com/auth/plus.login',
            'cookie_policy': 'single_host_origin'
        };
        gapi.auth.authorize(config, function() {
            console.log('Login complete');
            console.log(config);
            var accessToken = gapi.auth.getToken().access_token;
            console.log(accessToken); // Access_token
            gapi.auth.checkSessionState(config, function(stateMatched) {
                // Check session state before proceeding
            	if (stateMatched === false) {
                    console.log('G+ profile'); /*Personal profile information*/
                    fetchUserProfile();
                } else {
                    console.log("G+ user not logged in");
                }
            });
        });
    };

    var logout = function() {
        console.log('Destroying access_token..');
        gapi.auth.signOut();
        console.log('User is now logged out');
    };

    var fetchUserProfile = function() {
        gapi.client.load('plus', 'v1', function() {
            // Gets and renders the currently signed in user's profile data. 
            gapi.client.plus.people.get({
                'userId': 'me'
            }).then(function(res) {
                var profile = res.result;
                // Construct user profile
                var user = {};
                user.id = profile.id;
                user.name = profile.displayName;
                user.email = profile.emails[0].value;
                user.link = profile.url;
                user.picture = profile.image.url;
                user.gender = profile.gender;

                // Gets and renders the list of people visible to this app. 
                gapi.client.plus.people.list({
                    'userId': 'me',
                    'collection': 'visible'
                }).then(function(res) {
                    var people = res.result;
                    // Add friends
                    user.friends = people.items;
                    console.log('Complete user info:');
                    console.log(user);
                });
            });
        });
    };

    return {
        login: login,
        logout: logout
    };
}();