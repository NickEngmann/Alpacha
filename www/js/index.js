/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        // twitter.init({
        //     consumerKey: "mGeFCz7qIShzRPGdOQNyg2dqR",
        //     consumerSecret: "FuQjkhlmAcRTYn7YcfU1VQNkcXXqE3qR0K7yFEYjGzfPb0Ioir",
        //     callbackUrl: "http://192.168.1.172:3000/"
        // });
        // console.log("failed to log in");
        // twitter.login(function(token) {
        //     // login successful
        //         // twitter.postTweet({
        //         //     message: "My phone lasts longer at 1% than it does at 100%."
        //         // }, 
        //         // function() {
        //         //     alert("tweet successful");
        //         // ),
        //         // function(e) {
        //         //     alert("error occurred while tweeting");
        //         // });
        //         console.log("successful login");
        // }, function(e) {
        //     // error logging in
        //     console.log("failed to log in");
        // });
        // TwitterConnect.login(
        // function(result) {
        //     console.log('Successful login!');
        //     console.log(result);
        //   }, function(error) {
        //     console.log('Error logging in');
        //     console.log(error);
        //   }
        // );
        // navigator.share("I wonder if the Snooze button has a quantifiable effect on the economy","tweet","plain/text");
        // // console.log('Toomanyproblems');
        // var streamtweet = {
        //     consumerKey: 'mGeFCz7qIShzRPGdOQNyg2dqR',
        //     consumerSecret: 'FuQjkhlmAcRTYn7YcfU1VQNkcXXqE3qR0K7yFEYjGzfPb0Ioir',
        //     callbackUrl: 'http://192.168.1.172:3000',
        //     start: function() {
        //         console.log('streamtweet start! ');
        //         twitter.init(streamtweet.tweetreceived, streamtweet.tweetfailed, streamtweet.consumerKey,streamtweet.consumerSecret,streamtweet.callbackUrl, 'LisaSeacat');
        //     }, 
        //     tweetreceived: function(data){
        //         console.log('SUCCESSFULLY got some streaming tweets: ' + JSON.stringify(data)); 
        //     }, tweetfailed: function(data){
        //         console.log('FAILED to get the tweets: ' + JSON.stringify(data));  
        //     }, tweetStopWin: function(data){
        //         console.log('SUCCESSFULLY stopped getting tweets: ' + JSON.stringify(data));  
        //     }, tweetStopFail: function(data){
        //         console.log('FAILED to stop the tweet stream: ' + JSON.stringify(data));  
        //     }, stop: function(){
        //         twitter.stopTwitterStream(streamtweet.tweetStopWin, streamtweet.tweetStopFail);   
        //     }
        // };
        // this is the complete list of currently supported params you can pass to the plugin (all optional)
        // var options = {
        //   message: 'share this', // not supported on some apps (Facebook, Instagram)
        //   subject: 'the subject', // fi. for email
        //   files: ['', ''], // an array of filenames either locally or remotely
        //   url: 'https://www.website.com/foo/#bar?a=b',
        //   chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
        // }

        // var onSuccess = function(result) {
        //   console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
        //   console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
        // }

        // var onError = function(msg) {
        //   console.log("Sharing failed with message: " + msg);
        // }

        // window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};
