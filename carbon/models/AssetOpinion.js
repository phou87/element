import Parse from 'parse/react-native';

class AssetOpinion extends Parse.Object {
  constructor(cusip, owner, comment, opinion) {
    super('AssetOpinion');
    this.set('cusip', cusip);
    this.set('owner', owner);
    this.set('comment', comment);
    this.set('opinion', opinion);
  }
}

Parse.Object.registerSubclass('AssetOpinion', AssetOpinion);

export {
  AssetOpinion,
};
