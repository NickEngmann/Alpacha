# Twitter Streaming Cordova Plugin

This is a quick Apache Cordova plugin to use the Twitter Streaming APIs within a hybrid mobile application.  It uses the twitter4J Java code 

## Dependencies

- org.apache.cordova.inappbrowser http://plugins.cordova.io/#/package/org.apache.cordova.inappbrowser
- jsOAuth
- Twitter4J

Dependencies are installed automatically.  There are no configuration steps that are required by the user.

#Supported Platforms

* Android

This Cordova plugin only works for Android at this time

#Installing
Install with Cordova CLI

$ cd /path/to/your/project
$ cordova plugin add com.lisaseacat.twitter

# API


## Methods

- [twitter.init](#init)
- [twitter.stopTwitterStream](#stopTwitterStream)
- [twitter.addHashtag](#addHashtag)

- [twitter.getHashtag_NoStream](#getHashtag_NoStream)
- [twitter.getHomeTimeline_NoStream](#getHomeTimeline_NoStream)
- [twitter.getMentions_NoStream](#getMentions_NoStream)


# init

Intialize the metawear device.  

    twitter.init(successCallback, failureCallback, oauthconsumerkey, oauthconsumersecret, callbackURL);
    
### Description

Function 'init' initializes the twitter streaming service.  This method attempts to connect to twitter.  It uses the inappbrowser plugin to ask the user to authorize the app to use Twitter.  On successful authorization it will automatically start listening for tweets with a specific hashtag.  The success callback is called when a new tweet is found matching the keyword.  To set the keyword use the sethashtag method. You will need to setup a Twitter app at https://apps.twitter.com/. 

### Parameters

- __successCallback__: Success callback function that is invoked when twitter is authorized by the user through oAuth and a message is received.
- __failureCallback__: Error callback function, invoked when error occurs. 
- __oauthconsumerkey__: The oauth consumer key that was setup in the Twitter API developer console. 
- __oauthconsumersecret__: The oauth consumer secret that was setup in the Twitter API developer console. 
- __callbackURL__: The oauth callback URL that was setup in the Twitter API developer console. It doesn't matter what this value is. It's not used in Cordova, but necessary for OAuth to work.
- __keyword__: The keyword to listen for.  You can change the keyword at any time by calling addHashtag.  [optional]
 
# stopTwitterStream

    twitter.stopTwitterStream(successCallback, failureCallback) 
    
### Description

Function 'stopTwitterStream' tells the twitter stream to stop listening.  To start it back up after it has been stopped you'll have to call init again.

### Parameters

- __successCallback__: Success callback function that is invoked when the twitter stream was successfully stopped.
- __failureCallback__: Error callback function, invoked when error occurs. 

# addHashtag

    twitter.addHashtag(successCallback, failureCallback, keyword, reset) 
    
### Description

Function 'setHashTag' tells the twitter stream which keyword to listen for.  

### Parameters

- __successCallback__: Success callback function that is invoked when the twitter stream was successfully stopped.
- __failureCallback__: Error callback function, invoked when error occurs. 
- __keyword__: The keyword to listen for.  You can change the keyword at any time by calling this method again.
- __reset__: boolean.  By setting to true, the old hashtag value will be cleared out.  If set to false, the streaming search will look for ALL of the previous keywords as well as the new keyword. Default value is false. [optional]
    
# getHashtag_NoStream

    twitter.getHashtag_NoStream(successCallback, failureCallback) 
    
### Description

Function 'getHashtag_NoStream' lets you retrieve hashtags from Twitter without using the streaming service.  There is a rate limit set by Twitter to use this method..  

### Parameters

- __successCallback__: Success callback function that is invoked when the response is received.  Unlike the streaming service you will have to call this method multiple times each time you wish to receive the information.
- __failureCallback__: Error callback function, invoked when error occurs. 

# getHomeTimeline_NoStream

    twitter.getHomeTimeline_NoStream(successCallback, failureCallback) 
    
### Description

Function 'getHomeTimeline_NoStream' lets you retrieve the home timeline from Twitter without using the streaming service.  There is a rate limit set by Twitter to use this method..  

### Parameters

- __successCallback__: Success callback function that is invoked when the response is received.  Unlike the streaming service you will have to call this method multiple times each time you wish to receive the information.
- __failureCallback__: Error callback function, invoked when error occurs. 

# getMentions_NoStream

    twitter.getMentions_NoStream(successCallback, failureCallback) 
    
### Description

Function 'getMentions_NoStream' lets you retrieve hashtags from Twitter without using the streaming service.  There is a rate limit set by Twitter to use this method..  

### Parameters

- __successCallback__: Success callback function that is invoked when the response is received.  Unlike the streaming service you will have to call this method multiple times each time you wish to receive the information.
- __failureCallback__: Error callback function, invoked when error occurs. 




# Quick Example

    var streamtweet = {
        consumerKey: '__replaceMe__',
        consumerSecret: '__replaceMe__',
        callbackUrl: '__replaceMe__',
        start: function() {
            console.log('streamtweet start! ');
            twitter.init(streamtweet.tweetreceived, streamtweet.tweetfailed, streamtweet.consumerKey,streamtweet.consumerSecret,streamtweet.callbackUrl, 'LisaSeacat');
        }, 
        tweetreceived: function(data){
            console.log('SUCCESSFULLY got some streaming tweets: ' + JSON.stringify(data)); 
        }, tweetfailed: function(data){
            console.log('FAILED to get the tweets: ' + JSON.stringify(data));  
        }, tweetStopWin: function(data){
            console.log('SUCCESSFULLY stopped getting tweets: ' + JSON.stringify(data));  
        }, tweetStopFail: function(data){
            console.log('FAILED to stop the tweet stream: ' + JSON.stringify(data));  
        }, stop: function(){
            twitter.stopTwitterStream(streamtweet.tweetStopWin, streamtweet.tweetStopFail);   
        }
    };