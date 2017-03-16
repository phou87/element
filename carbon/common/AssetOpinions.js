import {OPINIONS} from '../common/constants';

class AssetOpinions {
  constructor() {
    this._opinions = {};
  }

  checkCusip(cusip) {
    if (!this._opinions[cusip]) {
      this._opinions[cusip] = {
        [OPINIONS.BULLISH]: 0,
        [OPINIONS.BEARISH]: 0,
      };
    }
  }

  decrementOpinion(cusip, opinion) {
    this.checkCusip(cusip);
    this._opinions[cusip][opinion] -= 1;
  }

  incrementOpinion(cusip, opinion) {
    this.checkCusip(cusip);
    this._opinions[cusip][opinion] += 1;
  }

  getOpinionCount(cusip, opinion) {
    if (!this._opinions[cusip]) {
      return 0;
    }

    let count = this._opinions[cusip][opinion];
    return count ? count : 0;
  }
}

export {
  AssetOpinions,
};
