var passport = require('passport');
var Auth0Strategy = require('passport-auth0');

var strategy = new Auth0Strategy({
    domain:       'tysonbulmer.auth0.com',
    clientID:     'YD5Iawk9EdB1VzZKYSSzNdkzxnzWLRe1',
    clientSecret: '8wC3MtL1UWmRzJKpqsrY5zAz2E8H5v-fAfmdyhcr_V2Ju6jna7SjMfpTa6Ptl6vi',
    callbackURL:  '/callback'
  }, function(accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  });


module.exports = strategy;