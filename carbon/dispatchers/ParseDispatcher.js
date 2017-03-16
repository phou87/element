import Parse from 'parse/react-native';

import Asset from '../models/Asset'
import {AssetOpinion} from '../models/AssetOpinion';
import {LikedAsset} from '../models/LikedAsset';
import Friendship from '../models/Friendship'

import {OPINIONS} from '../common/constants';

const ParseDispatcher = {
	loginWithFacebook(credentials, callback) {
    let authData = {
      id: credentials.userId,
      access_token: credentials.token,
      expiration_date: credentials.tokenExpirationDate
    };
    
    Parse.FacebookUtils.logIn(authData, {
      success: user => {
        callback(user);
      },
      error: (user, error) => {
        switch (error.code) {
          case Parse.Error.INVALID_SESSION_TOKEN:
            Parse.User.logOut().then(
              callback,
              callback,
            );
            break;
          default:
            callback();
            break;
        }
      }
    });
  },
  
  addFriend(user, friend_id, callback) {
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
        callback(null, error);
      },
    });
  },
  
  buyAsset(user, cusip, quantity, comment, isShort, callback) {
  	ParseDispatcher.getAsset(user, cusip, isShort, asset => {
      if (!asset) {
        asset = new Asset(cusip, quantity, user, comment, isShort);
      } else {
        asset.set("comment", comment);
        // asset.set("quantity", asset.get("quantity") + quantity);
      }
      asset.save(null, {
        success: callback,
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
        success: callback,
        error: (asset, error) => callback(asset, error),
      });
    });
  },

  likeAsset(user, cusip, comment, likedFrom) {
    let asset = new LikedAsset(cusip, user, likedFrom, comment);
    asset.save({
      success: result => console.log('yay', result),
      error: (result, error) => console.debug(error),
    });
  },

  unlikeAsset(user, cusip) {
    let query = new Parse.Query(LikedAsset);
    query.equalTo("owner", user);
    query.equalTo("cusip", cusip);
    query.find({
      success: results => {
        results.map(result => result.destroy());
      },
      error: error => console.debug(error),
    });
  },
  
  async getAllAssets(user, superUser, callback) {
    try {
      let query = new Parse.Query(Asset);
      query.equalTo("owner", user);

      let results = await query.find();

      let likedQuery = new Parse.Query(LikedAsset);
      likedQuery.equalTo("owner", superUser);

      let likedResults = await likedQuery.find();

			let relevantAssets = results.map(asset => asset.get("cusip"));
			for (let likedAsset of likedResults) {
				if (relevantAssets.indexOf(likedAsset.get("cusip")) === -1) {
					relevantAssets.push(likedAsset.get('cusip'));
        }
      }

			let likedCounts = await ParseDispatcher.getLikeCountForAssets(user, relevantAssets, likedResults);
      let opinions = await ParseDispatcher.getOpinionsForAssets(superUser, relevantAssets);
      let opinionCounts = await ParseDispatcher.getOpinionCountsForAssets(user, relevantAssets);

      callback(results, likedResults, likedCounts, opinions, opinionCounts);
    } catch (error) {
      console.debug(error);
      callback([], [], []);
    }
  },

  async getLikeCountForAssets(user, assets) {
    /*
    let friendships = user.relation("friendships");

    let friendQuery = new Parse.Query(Parse.User);
    friendQuery.matchesKeyInQuery("facebookID", "friend_id", friendships.query());
    */

    try {
      // let results = await friendQuery.find();

      let assetQuery = new Parse.Query(LikedAsset);
      // assetQuery.containedIn("owner", results);
      assetQuery.containedIn("cusip", assets);

      let likedAssets = await assetQuery.find();

      let assetMap = {};

      for (let asset of likedAssets) {
        let oldValue = assetMap[asset.get("cusip")];
        assetMap[asset.get("cusip")] = oldValue ? oldValue + 1 : 1;
      }

      return assetMap;
    } catch (error) {
      console.debug(error);
      return {};
    }
  },

  async getOpinionsForAssets(user, assets) {
    let query = new Parse.Query(AssetOpinion);
    query.equalTo("owner", user);
    query.containedIn("cusip", assets);
    try {
      let results = await query.find();
      console.debug('found results', results);
      let opinions = {};
      for (let result of results) {
        opinions[result.get("cusip")] = result.get("opinion");
      }
      return opinions;
    } catch (error) {
      console.debug(error);
      return {};
    }
  },

  removeAsset(user, cusip, isShort, callback) {
    console.debug('remove attemt', user, cusip, isShort);
    ParseDispatcher.getAsset(user, cusip, isShort, (asset, error) => {
      if (error) {
        callback(null, error);
        return;
      }
    
      if (!asset) {
        callback();
        return;
      }
      
      let id = asset.id;
      asset.destroy({
        success: () => callback(asset),
        error: (myObject, error) => callback(null, error),
      });
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
  
  saveUserMetadata(user, name, facebookID, deviceToken) {
    user.set("name", name);
    user.set("facebookID", facebookID);
    if (deviceToken) {
      user.set("deviceToken", deviceToken);
    }
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

  async getFollowerCount(user) {
    let query = new Parse.Query(Friendship);
    query.equalTo("friend_id", user.get("facebookID"));
    try {
      return await query.count();
    } catch (error) {
      console.debug(error);
      return 0;
    }
  },

  async getFollowerCounts(user_ids) {
    let query = new Parse.Query(Friendship);
    query.containedIn("friend_id", user_ids);
    try {
      let counts = {};
      let results = await query.find();
      for (let result of results) {
        let value = counts[result.get("friend_id")];
        counts[result.get("friend_id")] = value ? value + 1 : 1;
      }
      console.debug(counts);
      return counts;
    } catch (error) {
      console.debug(error);
      return {};
    }
  },

  async saveOpinion(user, cusip, comment, opinion) {
    let query = new Parse.Query(AssetOpinion);
    query.equalTo("owner", user);
    query.equalTo("cusip", cusip);

    try {
      let results = await query.find();
      if (results.length) {
        let result = results[0];
        result.set("opinion", opinion);
        await result.save();
        return;
      }

      let newOpinion = new AssetOpinion(cusip, user, comment, opinion);
      await newOpinion.save();
    } catch (error) {
      console.debug(error);
      return;
    }
  },

  async getOpinionCountsForAssets(user, assets) {
    try {
      let query = new Parse.Query(AssetOpinion);
      query.containedIn("cusip", assets);

      let opinionResults = await query.find();
      let opinions = {};

      for (let opinion of opinionResults) {
        if (!opinions[opinion.get("cusip")]) {
          opinions[opinion.get("cusip")] = {[OPINIONS.BULLISH]: 0, [OPINIONS.BEARISH]: 0};
        }
        console.debug(opinions);
        let oldValue = opinions[opinion.get("cusip")][opinion.get("opinion")];
        opinions[opinion.get("cusip")][opinion.get("opinion")] = oldValue ? oldValue + 1 : 1;
      }

      return opinions;
    } catch (error) {
      console.debug(error);
      return {};
    }
  },
}

module.exports = ParseDispatcher;
