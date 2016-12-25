
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.define('sendPushToFollowers', (req, res) => {
  let user = req.user;
  let {asset, activityType} = req.params;
  let friendships = user.relation("friendships");
  friendships.query().find({
    success: friends => {
      tokens = friends.map(friend => friend.get("deviceToken"));
      tokens.push(user.get("deviceToken"));

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
          res.success(0);
        },
        error: error => {
          res.error({error});
        },
      });
    },
    error: error => {
      res.error({error});
    },
  });
});
