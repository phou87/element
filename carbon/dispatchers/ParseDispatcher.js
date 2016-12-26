import Parse from 'parse/react-native';

import Asset from '../models/Asset'
import Friendship from '../models/Friendship'

const ParseDispatcher = {
	loginWithFacebook(credentials, callback) {
    let authData = {
      id: credentials.userId,
      access_token: credentials.token,
      expiration_date: credentials.tokenExpirationDate
    };
    
    Parse.FacebookUtils.logIn(authData, {
      success: user => {
        console.log('success!', user);
        callback(user);
      },
      error: (user, error) => {
        console.debug('shit', error, Parse.Error.INVALID_SESSION_TOKEN);
        switch (error.code) {
          case Parse.Error.INVALID_SESSION_TOKEN:
            Parse.User.logOut().then(() => {
              console.log('we out');
            });
            break;
          default:
            console.log(error.code);
        }
      }
    });
  },
  
  addFriend(user, friend_id, callback) {
    console.debug('add', friend_id, user);
  	let friendship = new Friendship(friend_id, user.id);
    friendship.save(null, {
      success: friendship => {
        let relation = user.relation("friendships");
        relation.add(friendship);
        user.save();
        callback(friend_id);
      },
    });
  },
  
  removeFriend(user, friend_id, callback) {
    let relation = user.relation("friendships");
    let query = relation.query();
    query.equalTo("friend_id", friend_id);
    query.find({
      success: list => {
        let friendship = list[0];
        relation.remove(friendship);
        user.save();
        friendship.destroy();
        callback(friend_id);
      },
    });
  },
  
  getFriendships(user, callback) {
    let relation = user.relation("friendships");
    relation.query().find({
      success: list => {
        callback(list);
      },
    });
  },
  
  getAsset(user, cusip, isShort, callback) {
    let query = new Parse.Query(Asset);
    query.equalTo("cusip", cusip);
    query.equalTo("owner", user);
    query.equalTo("isShort", isShort);
    query.find({
      success: results => {
        if (!results.length) {
          callback(null);
        } else {
      	  callback(results[0]);
        }
      },
      error: error => {
        callback(null);
      },
    });
  },
  
  buyAsset(user, cusip, quantity, comment, isShort, callback) {
  	ParseDispatcher.getAsset(user, cusip, isShort, asset => {
      if (!asset) {
        asset = new Asset(cusip, quantity, user, comment, isShort);
      } else {
        asset.set("quantity", asset.get("quantity") + quantity);
      }
      asset.save(null, {
        success: asset => callback(asset),
        error: (asset, error) => callback(asset, error),
      });
    });
  },

  sellAsset(user, cusip, quantity, comment, isShort, callback) {
  	ParseDispatcher.getAsset(user, cusip, isShort, asset => {
      if (!asset) {
        asset = new Asset(cusip, quantity, user, comment, isShort);
      } else {
        asset.set("quantity", asset.get("quantity") - quantity);
      }
      asset.save(null, {
        success: asset => callback(asset),
        error: (asset, error) => callback(asset, error),
      });
    });
  },
  
  getAllAssets(user, callback) {
    console.debug('getting assets', user);
    let query = new Parse.Query(Asset);
    query.equalTo("owner", user);
    query.find({
      success: results => {
        console.debug('assets got', results);
        callback(results);
      },
      error: error => console.debug(error) && callback([]),
    });
  },
  
  removeAsset(user, cusip, isShort, callback) {
    ParseDispatcher.getAsset(user, cusip, isShort, asset => {
      if (!asset) {
        return;
      }
      
      let id = asset.id;
      asset.destroy();
      callback(id);
    });
  },
  
  getUserForFriend(friend_id, callback) {
    let query = new Parse.Query(Parse.User);
    query.equalTo("facebookID", friend_id);
    query.find({
      success: results => callback(results),
      error: error => console.debug(error) && callback([]),
    });
  },
  
  attachDeviceTokenToUser(user, deviceToken) {
    user.set("deviceToken", deviceToken);
    user.save();
  },
  
  saveUserMetadata(user, name, facebookID) {
    user.set("name", name);
    user.set("facebookID", facebookID);
    user.save();
  },
  
  sendPushToFollowers(asset, activityType) {
    Parse.Cloud.run('sendPushToFollowers', {asset, activityType}, {
      success: res => {
        console.debug('Successfully sent push notification.', res);
      },
      error: error => {
        console.debug('Error sending push notification.', error);
      },
    });
  },
}

module.exports = ParseDispatcher;
