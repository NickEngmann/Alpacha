package com.lisaseacat.twitter;

import java.util.ArrayList;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import twitter4j.FilterQuery;
import twitter4j.StallWarning;
import twitter4j.Status;
import twitter4j.StatusDeletionNotice;
import twitter4j.StatusListener;
import twitter4j.TwitterStream;
import twitter4j.TwitterStreamFactory;
import twitter4j.conf.ConfigurationBuilder;
import android.util.Log;

public class TwitterPlugin extends CordovaPlugin {

    private static final String LOG_TAG = "TwitterPlugin";
    private ConfigurationBuilder cb = null;
    private TwitterStream twitterStream = null;
    private StatusListener listener = null;
    
    ArrayList<Long> follow = new ArrayList<Long>();
    ArrayList<String> track = new ArrayList<String>();
    
    private CallbackContext twitterCallbackContext = null;
    
    private String oauthconsumerkey = "";
    private String oauthconsumersecret = "";
    private String oauthaccesstoken = "";
    private String oauthaccesstokensecret = "";
    
    /**
     * Constructor.
     */
    public TwitterPlugin() {
    }


    /**
     * Executes the request.
     *
     * @param action          The action to execute.
     * @param args            JSONArry of arguments for the plugin.
     * @param callbackContext The callback context used when calling back into JavaScript.
     * @return True if the action was valid, false if not.
     * @throws JSONException
     */
    public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {
        Log.d(LOG_TAG, ">>> execute (" + action + "," + args + ")");
        if (action.equals("inittwitter")) {
            Log.d(LOG_TAG, "inittwitter called********************");
            //consumerKey, consumerSecret, token, secret
            this.oauthconsumerkey = args.getString(0);
            this.oauthconsumersecret = args.getString(1);
            this.oauthaccesstoken = args.getString(2);
            this.oauthaccesstokensecret = args.getString(3);
            try {
            	String keyword = args.getString(4);
            	if (keyword != null && !keyword.trim().equals("")){
            		this.track.add(keyword);
            	} else {
                    //no keyword so let's track TEDatIBM
                    this.track.add("TEDatIBM");
                }
            } catch (JSONException e){ this.track.add("TEDatIBM");}
           
            
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                	
                	cb = new ConfigurationBuilder();
                	cb.setDebugEnabled(true)
                	  .setOAuthConsumerKey(oauthconsumerkey)
                	  .setOAuthConsumerSecret(oauthconsumersecret)
                	  .setOAuthAccessToken(oauthaccesstoken)
                	  .setOAuthAccessTokenSecret(oauthaccesstokensecret);
                	
                	twitter4j();
                	
                    twitterCallbackContext = callbackContext;
                    PluginResult pluginResult = new PluginResult(PluginResult.Status.NO_RESULT);
                    pluginResult.setKeepCallback(true);
                    callbackContext.sendPluginResult(pluginResult);
                }
            });

            return true;
        } else if (action.equals("addHashtag")) {
            Log.d(LOG_TAG, "****************addHashtag called");

            final String searchTerm = args.getString(0);
            Boolean reset = false;
            	try {
            		reset = args.getBoolean(1);
            	} catch (JSONException e){
            		//do nothing
            	}
            
            if( searchTerm.length() > 0 ) {
            	if (twitterStream != null){
            		Log.d(LOG_TAG, "****************addHashtag called, change search term to be: " + searchTerm);
            		
            		if (reset == true){
            			track.clear();
            		}
                    track.add(searchTerm);
                    long[] followArray = new long[follow.size()];
                    for (int i = 0; i < follow.size(); i++) {
                        followArray[i] = follow.get(i);
                    }
                    String[] trackArray = track.toArray(new String[track.size()]);

                    // filter() method internally creates a thread which manipulates TwitterStream and calls these adequate listener methods continuously.
                    twitterStream.filter(new FilterQuery(0, followArray, trackArray));
            	}
            }
            
            callbackContext.success();
            return true;
        } else if (action.equals("stopListener")) {
            Log.d(LOG_TAG, "****************stopListener called");

            stopListener();
            callbackContext.success();
            return true;
        } 
        return false;
    }
    
    private void twitter4j(){
    	listener = new StatusListener() {
            @Override
            public void onStatus(Status status) {
                System.out.println("@" + status.getUser().getScreenName() + " - " + status.getText());
                JSONObject tweet = new JSONObject();
                try {
					tweet.put("createdAt", status.getCreatedAt());
					tweet.put("user", status.getUser().getScreenName());
					tweet.put("text", status.getText());
				} catch (JSONException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
                sendNotification(tweet);
            }

            @Override
            public void onDeletionNotice(StatusDeletionNotice statusDeletionNotice) {
                System.out.println("Got a status deletion notice id:" + statusDeletionNotice.getStatusId());
            }

            @Override
            public void onTrackLimitationNotice(int numberOfLimitedStatuses) {
                System.out.println("Got track limitation notice:" + numberOfLimitedStatuses);
            }

            @Override
            public void onScrubGeo(long userId, long upToStatusId) {
                System.out.println("Got scrub_geo event userId:" + userId + " upToStatusId:" + upToStatusId);
            }

            @Override
            public void onStallWarning(StallWarning warning) {
                System.out.println("Got stall warning:" + warning);
            }

            @Override
            public void onException(Exception ex) {
                ex.printStackTrace();
            }
        };

        

        twitterStream = new TwitterStreamFactory(cb.build()).getInstance();
        twitterStream.addListener(listener);
        long[] followArray = new long[follow.size()];
        for (int i = 0; i < follow.size(); i++) {
            followArray[i] = follow.get(i);
        }
        String[] trackArray = track.toArray(new String[track.size()]);

        // filter() method internally creates a thread which manipulates TwitterStream and calls these adequate listener methods continuously.
        twitterStream.filter(new FilterQuery(0, followArray, trackArray));
    	
    }
    
    private void stopListener() {
    	if (twitterStream != null){
    		twitterStream.shutdown();
    	}
    }

    public void onDestroy() {
        stopListener();
    }

    public void onReset() {
        stopListener();
    }

    private void sendNotification(JSONObject tweet) {
        
        if (this.twitterCallbackContext != null) {
            Log.d(LOG_TAG, "Sending notification to UI");
            PluginResult result = new PluginResult(PluginResult.Status.OK, tweet);
            result.setKeepCallback(true);
            this.twitterCallbackContext.sendPluginResult(result);
        } else {
            Log.d(LOG_TAG, "Unable to send notification to UI");
        }
    }


}