var accessToken;
sfFacebookConnect = function(api_key, signin_url)
{
  this.xd_receiver_path = "/sfFacebookConnectPlugin/xd_receiver.htm";
  this.api_key = api_key;
  this.signin_url = signin_url;
  this.callback = '';
  this.forward = '';
  
  this.init();
};
sfFacebookConnect.prototype.init = function()
{
  FB.init({appId: this.api_key, status: false, cookie: true, xfbml: true, oauth: true});
  
  $(document).ready( function () { 
  if($.browser.opera || $.browser.mozilla) // it uses jQuery library here!
  {
	if('undefined' != typeof FB.XD) {
		FB.XD._transport="postmessage";
		if (typeof FB.XD.PostMessage != 'undefined') {
		 FB.XD.PostMessage.init();
		}
	}
  }});
}
sfFacebookConnect.prototype.getSigninUrl = function()
{
  t_signin_url = this.signin_url;
  if(this.forward != undefined && this.forward != '')
  {
    t_signin_url += '?forward=' + this.forward; 
  }
  
  return t_signin_url + '?access_token=' + accessToken;
}
sfFacebookConnect.prototype.gotoLoginPage = function()
{
  //console.log(this.getSigninUrl());
  //document.location.href= this.getSigninUrl();
  this.requireSession('','');
};
sfFacebookConnect.prototype.requireSession = function(forward, callback)
{
  this.forward = forward;
  if (callback==undefined)
  {
	var current_obj = this;
	callback = function(){current_obj.gotoLoginPage()};
  }
  FB.login(function(response) {
    if (response.authResponse) {
	  accessToken = response.authResponse.accessToken;
      callback();
    } else {
      // user cancelled login
    }
  },{scope:'offline_access,user_birthday,read_stream,publish_stream,email,user_about_me,user_website,user_location,publish_actions'});
};

/*
 * Show the feed form. This would be typically called in response to the
 * onclick handler of a "Publish" button, or in the onload event after
 * the user submits a form with info that should be published.
 *
 */
sfFacebookConnect.prototype.publishFeedStory = function(form_bundle_id, template_data)
{
  // Load the feed form
  FB.ensureInit(
    function()
    {
      FB.Connect.showFeedDialog(form_bundle_id, template_data);
      //FB.Connect.showFeedDialog(form_bundle_id, template_data, null, null, FB.FeedStorySize.shortStory, FB.RequireConnect.promptConnect);
      
      // hide the "Loading feed story ..." div
      //ge('feed_loading').style.visibility = "hidden";
    }
  );
};

sfFacebookConnect.prototype.showPermissionsDialog = function (permissions, callback)
{
  FB.ensureInit(
    function()
    {
      FB.Connect.showPermissionDialog(permissions, callback);
    }
  );
}

sfFacebookConnect.prototype.streamPublish = function (message, attachment, action_links)
{
  FB.ensureInit(
    function()
    {
      FB.Connect.streamPublish(message, attachment, action_links);
    }
  );
}
