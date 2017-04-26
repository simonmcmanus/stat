
var clientId = '305636814214-roejgeq4lg8fdblghdrsr36bj1qc5skc.apps.googleusercontent.com';
var apiKey = 'AIzaSyCuaNsyCZnFsIyKHcy4KIoEKCaROyDAuS8';
var scopes = 'https://www.googleapis.com/auth/analytics.readonly';


function analyticsAuth(callback) {
  gapi.auth.authorize({
    client_id: clientId, scope: scopes, immediate: false}, function(authResult) {
        if (authResult) {
            gapi.client.load('analytics', 'v3', callback);
        } else {
           callback(new Error('unauthorised'))
        }
    });
  return false;
}
