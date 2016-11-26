import Parse from 'parse/react-native';

class Asset extends Parse.Object {
  constructor(cusip, quantity, owner) {
  	super('Asset');
    this.set('cusip', cusip);
    this.set('quantity', quantity);
    this.set('owner', owner);
  }
}

Parse.Object.registerSubclass('Asset', Asset);

module.exports = Asset;
