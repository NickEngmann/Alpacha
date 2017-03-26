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
var embed = [];
function createButtons(){
    console.log
    var min = Math.ceil(0);
    var max = Math.floor(embed.length-1);
    for (i = 0; i < 5; i++) {
        var random = Math.floor(Math.random() * (max - min + 1)) + min;
        console.log(random);
        if(i == 0){
            var data = "<button onclick=\"window.plugins.socialsharing.shareViaTwitter('" +embed[random]+ "')\">"+embed[random]+"</button>";
        }
        else{
            data += "<button onclick=\"window.plugins.socialsharing.shareViaTwitter('" +embed[random]+ "')\">"+embed[random]+"</button>";
        }
    }
    var reddit = document.getElementById("latestReddit");
    reddit.innerHTML = data;
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

                        for (i = 0; i < 3; i++) {
                            if (i == 0){
                                var data = "<button onclick=\"window.plugins.socialsharing.shareViaTwitter('" +content.data.children[i].data.title+ "')\">"+content.data.children[i].data.title+"</button>";
                            }
                            else{
                                data += "<button onclick=\"window.plugins.socialsharing.shareViaTwitter('" +content.data.children[i].data.title+ "')\">"+content.data.children[i].data.title+"</button>";
                            }
                            embed.push(content.data.children[i].data.title);

                        }
                        if(embed.length == 15){
                            createButtons();
                        }
                    }
                }
            }
            request.send();
        }
        var redditUrls = [
          ["https://www.reddit.com/r/ShowerThoughts/new/.json?limit=3"],
          ["https://www.reddit.com/r/CongratsLikeImFive/new/.json?limit=3"],
          ["https://www.reddit.com/r/Lightbulb/new/.json?limit=3"],
          ["https://www.reddit.com/r/CrazyIdeas/new/.json?limit=3"],
          ["https://www.reddit.com/r/ShittyLifeProTips/new/.json?limit=3"]
        ];

        for(i = 0; i < redditUrls.length; i++){
            loadReddit(redditUrls[i]);
        }
        cordova.plugins.notification.local.hasPermission(function (granted) {
            console.log('Permission has been granted: ' + granted);
        });
        cordova.plugins.notification.local.registerPermission(function (granted) {
            console.log('Permission has been granted: ' + granted);
        });
        cordova.plugins.notification.local.schedule({
            id: 1,
            text: "Good morning!",
            //firstAt: tomorrow_at_8_am,
            every: 2  // "minute", "hour", "week", "month", "year"
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
