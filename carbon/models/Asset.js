import Parse from 'parse/react-native';

class Asset extends Parse.Object {
  constructor(cusip, quantity, owner, comment, isShort) {
    super('Asset');
    this.set('cusip', cusip);
    this.set('quantity', quantity);
    this.set('owner', owner);
    this.set('comment', comment);
    this.set('isShort', isShort);
  }
}

Parse.Object.registerSubclass('Asset', Asset);

module.exports = Asset;
