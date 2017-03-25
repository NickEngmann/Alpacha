/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var cordova = require('cordova'),
    exec = require('cordova/exec');

var twitter = {
    _options : {
        consumerKey: '___TO_BE_REPLACED______',
        consumerSecret: '___TO_BE_REPLACED______',
        callbackUrl: '___TO_BE_REPLACED______',
        requestTokenUrl: "https://api.twitter.com/oauth/request_token",
        authURL: "https://api.twitter.com/oauth/authorize",
        accessTokenUrl: "https://api.twitter.com/oauth/access_token"
    },
    _oauth : null,
    _requestParams : null,
    _accessParams : {},
    init: function (successCallback, failureCallback, oauthconsumerkey, oauthconsumersecret, callbackURL, keyword) {
    	twitter._options.consumerKey = oauthconsumerkey;
        twitter._options.consumerSecret = oauthconsumersecret;
        twitter._options.callbackUrl = callbackURL;
        
        twitter._oauth = jsOAuth.OAuth(twitter._options);
        if (arguments.length == 6) {
            twitter._startTwitter(successCallback, failureCallback, keyword);
        } else {   
            twitter._startTwitter(successCallback, failureCallback, '');
        }
    },
    _startTwitter: function(successfun, failfun, keyword){
        var savedaccess = localStorage.getItem("accessToken");
        if (savedaccess != 'null' && savedaccess != '' && savedaccess !== null){
            var savedaccesssecret = localStorage.getItem("accessTokenSecret");
            twitter._accessParams.oauth_token =savedaccess;
            twitter._accessParams.oauth_token_secret = savedaccesssecret;
            twitter._oauth.setAccessToken([savedaccess, savedaccesssecret]);   
            
            twitter._init(streamtweet.tweetreceived, streamtweet.tweetfailed, twitter._options.consumerKey, twitter._options.consumerSecret, twitter._accessParams.oauth_token, twitter._accessParams.oauth_token_secret, keyword);
        }
        if (twitter._oauth.getAccessToken()[0] !== ''){
            console.log("we have an access token so skipping the flow");
            //getMentions();
        } else {   
            twitter._oauth.get(twitter._options.requestTokenUrl,
                    function(data) {
                        var oauthtoken = data.text;
                        twitter._requestParams = data.text;
                        twitter._oauth.setCallbackUrl(twitter._options.callbackUrl);
                        
              twitter._showAuthWindow(twitter._options.authURL +'?'+oauthtoken, keyword);
            }, function (data) {
              console.log(JSON.stringify(data));
            });  
        }
    },
    _showAuthWindow: function(url, keyword) {
          var browser = window.open(url, '_blank', 'location=yes');
          browser.addEventListener('loadstart', function(event) {
            if (event.url.indexOf(twitter._options.callbackUrl) >= 0) {
              event.url.match(/oauth_verifier=([a-zA-Z0-9]+)/);
              twitter._oauth.setVerifier(RegExp.$1);        
                twitter._oauth.get(twitter._options.accessTokenUrl + '?oauth_verifier=' + RegExp.$1 +'&'+twitter._requestParams, 
          function(data) {
                browser.close();
              // split the query string as needed		
                var qvars_tmp = data.text.split('&');
                for (var i = 0; i < qvars_tmp.length; i++) {
                    var y = qvars_tmp[i].split('=');
                    twitter._accessParams[y[0]] = decodeURIComponent(y[1]);
                }
            
                twitter._oauth.setAccessToken([twitter._accessParams.oauth_token, twitter._accessParams.oauth_token_secret]);
                //also save to local storage
                localStorage.setItem("accessTokenSecret", twitter._accessParams.oauth_token_secret);
                localStorage.setItem("accessToken", twitter._accessParams.oauth_token); 
              
                //setup twitter plugin
                twitter._init(streamtweet.tweetreceived, streamtweet.tweetfailed, twitter._options.consumerKey, twitter._options.consumerSecret, twitter._accessParams.oauth_token, twitter._accessParams.oauth_token_secret, keyword);
          }, function(data){
              console.log('failed to get the access token');
            console.log(JSON.stringify(data));
          });
            }
          });
    },
    _init: function (successCallback, failureCallback, oauthconsumerkey, oauthconsumersecret, oauthaccesstoken, oauthaccesstokensecret, keyword) {
        exec(successCallback, failureCallback, "Twitter", "inittwitter", [oauthconsumerkey, oauthconsumersecret, oauthaccesstoken, oauthaccesstokensecret, keyword]);
    },
    stopTwitterStream: function (successCallback, failureCallback) {
        exec(successCallback, failureCallback, "Twitter", "stopListener", []);
    },
    addHashtag: function(successCallback, failureCallback, newhash, reset){
        console.log('setting the hastag to be: ' + newhash + ' will we reset? ' + reset);
        
        //change on the Java end
        exec(successCallback, failureCallback, "Twitter", "addHashtag", [newhash, reset]);
    }, 
    getHashtag_NoStream: function(successCallback, failureCallback, hashtag) {
        var hashtagsearch = 'https://api.twitter.com/1.1/search/tweets.json?result_type=recent&count=1&q=%23' + hashtag;
        twitter._oauth.get(hashtagsearch, successCallback, failureCallback);		
    }, getHomeTimeline_NoStream: function(successCallback, failureCallback) {
			twitter._oauth.get('https://api.twitter.com/1.1/statuses/home_timeline.json', successCallback, failureCallback);	
    }, getMentions_NoStream: function(successCallback, failureCallback) {
			twitter._oauth.get('https://api.twitter.com/1.1/statuses/mentions_timeline.json?count=3', successCallback, failureCallback);			
		}

};
module.exports = twitter;