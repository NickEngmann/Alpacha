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

var iFrequency = 30000; // expressed in miliseconds
var myInterval = 0;

// STARTS and Resets the loop if any

//the text inside the subreddit post is embed
var embed = [];
//the urls embeded within the subreddit post is contentUrls
var contentUrls = [];
//the Subreddit titles is titles
var titles = [];
//urls of sources from Reddit
var redditUrls = [
    ["https://www.reddit.com/r/ShowerThoughts/new/.json?limit=5"],
    ["https://www.reddit.com/r/CongratsLikeImFive/new/.json?limit=1"],
    ["https://www.reddit.com/r/Lightbulb/new/.json?limit=5"],
    ["https://www.reddit.com/r/CrazyIdeas/new/.json?limit=5"],
    ["https://www.reddit.com/r/nottheonion/new/.json?limit=3"],
    ["https://www.reddit.com/r/technology/new/.json?limit=4"],
    ["https://www.reddit.com/r/worldnews/new/.json?limit=3"],
    ["https://www.reddit.com/r/ShittyLifeProTips/new/.json?limit=4"]
];

//this function is called when the application finishes scraping the content. It creates three buttons 
//displayed on the page under the refresh button with the URL links to share via twitter.
function createButtons(){
    var min = Math.ceil(0);
    var max = Math.floor(embed.length-1);
    for (i = 0; i < 3; i++) {
        var random = Math.floor(Math.random() * (max - min + 1)) + min;
        //inserting titles as a temporary reminder of which subreddits I am using for actual content
        if(i == 0){
            if(titles[random] == "nottheonion" || titles[random] == "technology" || titles[random] =="worldnews"){
                var data = "<p>"+titles[random]+"</p>"
                data += "<button onclick=\"window.plugins.socialsharing.shareViaTwitter('" + contentUrls[random] + "')\">"+embed[random]+"</button>";            
            }
            else{
                var data = "<p>"+titles[random]+"</p>"
                data += "<button onclick=\"window.plugins.socialsharing.shareViaTwitter('" +embed[random]+ "')\">"+embed[random]+"</button>";
            }
        }
        else{
            if(titles[random] == "nottheonion" || titles[random] == "technology" || titles[random] =="worldnews"){
                data += "<p>"+titles[random]+"</p>"
                data += "<button onclick=\"window.plugins.socialsharing.shareViaTwitter('" + contentUrls[random] + "')\">"+embed[random]+"</button>";            
            }
            else{
                data += "<p>"+titles[random]+"</p>"
                data += "<button onclick=\"window.plugins.socialsharing.shareViaTwitter('" +embed[random]+ "')\">"+embed[random]+"</button>";
            }
        }
    }
    //console.log(data);
    var reddit = document.getElementById("latestReddit");
    reddit.innerHTML = data;
}

//this function initalizes the Reddit scraping
function doSomething()
{
    embed = [];
    for(i = 0; i < redditUrls.length; i++){
        loadReddit(redditUrls[i]);
    }
}
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
        document.getElementById("deviceready").addEventListener("click", createButtons, false);
        function loadReddit(url) {
            var request = new XMLHttpRequest();
            request.open("GET", url, true);
            request.onreadystatechange = function() {//Call a function when the state changes.
                if (request.readyState == 4) {
                    if (request.status == 200 || request.status == 0) {
                        var content = JSON.parse(request.responseText);
                        for (i = 0; i < content.data.children.length; i++) {
                            //if /' or " in the sentence I need to delete it
                            var titleString = content.data.children[i].data.title
                            //if I am also grabbing the url to add to the title string
                            if(content.data.children[i].data.subreddit == "nottheonion" || content.data.children[i].data.subreddit == "technology" || content.data.children[i].data.subreddit == "worldnews"){
                                var urlString = content.data.children[i].data.url;
                                contentUrls.push(urlString);
                                // console.log(contentUrls);
                            }
                            else{
                                contentUrls.push("null");
                            }
                            titleString = titleString.replace(/(['"])/g, "");
                            embed.push(titleString);
                            titles.push(content.data.children[i].data.subreddit);

                        }
                        if(embed.length == 30){
                            createButtons();
                        }
                    }
                }
            }
            request.send();

        }
        function startLoop() {
            if(myInterval > 0) clearInterval(myInterval);  // stop
            myInterval = setInterval( "doSomething()", iFrequency );  // run
        }
        for(i = 0; i < redditUrls.length; i++){
            loadReddit(redditUrls[i]);
        }
        cordova.plugins.notification.local.hasPermission(function (granted) {
            console.log('Permission has been granted: ' + granted);
        });
        cordova.plugins.notification.local.registerPermission(function (granted) {
            console.log('Permission has been granted: ' + granted);
        });
        //sets up notifications to appear every hour
        cordova.plugins.notification.local.schedule({
            id: 1,
            text: "Make a new post using Alpacha!",
            every: "hour"  // "minute", "hour", "week", "month", "year"
        });
        app.receivedEvent('deviceready');
    },

    // // Schedule notification for tomorrow to remember about the meeting
    // cordova.plugins.notification.local.schedule({
    //     id: 10,
    //     title: "Meeting in 15 minutes!",
    //     text: "Jour fixe Produktionsbesprechung",
    //     at: tomorrow_at_8_45_am,
    //     data: { meetingId:"#123FG8" }
    // });

    // // Join BBM Meeting when user has clicked on the notification 
    // cordova.plugins.notification.local.on("click", function (notification) {
    //     if (notification.id == 10) {
    //         joinMeeting(notification.data.meetingId);
    //     }
    // });

    // // Notification has reached its trigger time (Tomorrow at 8:45 AM)
    // cordova.plugins.notification.local.on("trigger", function (notification) {
    //     if (notification.id != 10)
    //         return;

    //     // After 10 minutes update notification's title 
    //     setTimeout(function () {
    //         cordova.plugins.notification.local.update({
    //             id: 10,
    //             title: "Meeting in 5 minutes!"
    //         });
    //     }, 600000);
    // });
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
