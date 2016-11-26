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
        switch (error.code) {
          case Parse.Error.INVALID_SESSION_TOKEN:
            Parse.User.logOut().then(() => {
              console.log('we out');
            });
            break;
          case Parse.Error.
          default:
            console.log(error.code);
        }
      }
    });
  },
  
  addFriend(user, friend_id, callback) {
    console.debug('add', friend_id, user);
  	let friendship = new Friendship(friend_id);
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
  
  getAsset(user, cusip, callback) {
    let query = new Parse.Query(Asset);
    query.equalTo("cusip", cusip);
    query.equalTo("owner", user);
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
  
  buyAsset(user, cusip, quantity, callback) {
  	ParseDispatcher.getAsset(user, cusip, asset => {
      if (!asset) {
        asset = new Asset(cusip, quantity, user);
      } else {
        asset.set("quantity", asset.get("quantity") + quantity);
      }
      asset.save(null, {
        success: asset => callback(asset),
        error: (asset, error) => callback(asset, error),
      });
    });
  },

  sellAsset(user, cusip, quantity, callback) {
  	ParseDispatcher.getAsset(user, cusip, asset => {
      if (!asset) {
        asset = new Asset(cusip, quantity, user);
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
    let query = new Parse.Query(Asset);
    query.equalTo("owner", user);
    query.find({
      success: results => {
        console.debug(results);
        callback(results);
      },
      error: error => callback([]),
    });
  },
}

module.exports = ParseDispatcher;
