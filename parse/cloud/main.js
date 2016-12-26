
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

function sendPushToFollowers(req, res) {
  "use strict";
  let user = req.user;
  let asset = req.params.asset;
  let activityType = req.params.activityType;

  let Friendship = Parse.Object.extend("Friendship");
  let friendshipQuery = new Parse.Query(Friendship);
  friendshipQuery.equalTo("friend_id", user.get("authData").facebook.id);
  friendshipQuery.find({
    success: friendships => {
      let friendIDs = friendships.map(friendship => friendship.get("user_id"));
      let friendQuery = new Parse.Query(Parse.User);
      friendQuery.containedIn("objectId", friendIDs);
      friendQuery.find({
        success: friends => {
          let tokens = friends.map(friend => friend.get("deviceToken"));
          // tokens.push(user.get("deviceToken"));
          if (tokens.length === 0) {
            res.success(0);
            return;
          }

          let name = user.get("name");
          name = name ? name : "A friend";
          let activity = activityType === "buy" ? "bought" : "sold";

          let query = new Parse.Query(Parse.Installation);
          query.containedIn("deviceToken", tokens);

          Parse.Push.send({
            where: query,
            data: {
              alert: name + ' just ' + activity + ' ' + asset + '.',
            },
          }, {
            useMasterKey: true,
            success: () => {
              console.log("Successfully sent push notification.");
              res.success(0);
            },
            error: error => {
              console.log("Error sending push notification.", error);
              res.error({error});
            },
          });
        },
        error: error => {
          console.log("Error querying friends.", error);
          res.error({error});
        },
      });
    },
    error: error => {
      console.log("Error querying friendships.", error);
      res.error({error});
    },
  });
}

Parse.Cloud.define('sendPushToFollowers', (req, res) => {
  try {
    sendPushToFollowers(req, res);
  } catch (error) {
    console.log("Exception while sending push notification.", error);
    res.error({error});
  }
});
