import Parse from 'parse/react-native';

class LikedAsset extends Parse.Object {
  constructor(cusip, owner, likedFrom) {
    super('LikedAsset');
    this.set('cusip', cusip);
    this.set('owner', owner);
    this.set('likedFrom', likedFrom);
  }
}

Parse.Object.registerSubclass('LikedAsset', LikedAsset);

export {
  LikedAsset,
};
