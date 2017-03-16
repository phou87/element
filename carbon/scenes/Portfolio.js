import {
  LayoutAnimation,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import React, { Component } from 'react';
import {Button, Card, CardItem, Icon, Tabs, Text} from 'native-base';
import {Container, Content, Spinner} from 'native-base';

import {OPINIONS} from '../common/constants';
import ParseDispatcher from '../dispatchers/ParseDispatcher';
import {AssetCard} from '../components/AssetCard';
import {SwipeableComponent} from '../components/SwipeableComponent';

const AssetCardSwipable = SwipeableComponent(AssetCard);

class Portfolio extends Component {
  constructor(props) {
    super(props);
  	this.state = {
      assets: [],
      expandedAssets: [],
      isLoading: true,
      likedAssets: [],
      likeCounts: {},
      opinions: {},
      testIsLiked: false,
    };

    this.onBearish = this.onBearish.bind(this);
    this.onBullish = this.onBullish.bind(this);
    this.onClickLike = this.onClickLike.bind(this);
    this.onGetAssets = this.onGetAssets.bind(this);
    this.onRemoveAsset = this.onRemoveAsset.bind(this);
    this.onRemoveAssetCallback = this.onRemoveAssetCallback.bind(this);
    this.unlikeLikedAsset = this.unlikeLikedAsset.bind(this);
  }

  componentWillMount() {
    ParseDispatcher.getAllAssets(this.props.loggedInUser, this.props.superUser, this.onGetAssets);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.loggedInUser === nextProps.loggedInUser) {
      return;
    }
    this.setState({expandedAssets: [], isLoading: true});
		ParseDispatcher.getAllAssets(nextProps.loggedInUser, this.props.superUser, this.onGetAssets);
  }
  
  isAssetLiked(cusip) {
    return this.state.likedAssets.findIndex(a => a.attributes.cusip === cusip) !== -1;
  }

  onBearish(cusip, comment) {
    ParseDispatcher.saveOpinion(this.props.superUser, cusip, comment, OPINIONS.BEARISH);
    if (this.state.opinions[cusip] === OPINIONS.BULLISH) {
      this.state.opinionCounts[cusip][OPINIONS.BULLISH] -= 1;
    }
    this.state.opinions[cusip] = OPINIONS.BEARISH;
    this.state.opinionCounts[cusip][OPINIONS.BEARISH] += 1;
    this.forceUpdate();
  }

  onBullish(cusip, comment) {
    ParseDispatcher.saveOpinion(this.props.superUser, cusip, comment, OPINIONS.BULLISH);
    if (this.state.opinions[cusip] === OPINIONS.BEARISH) {
      this.state.opinionCounts[cusip][OPINIONS.BEARISH] -= 1;
    }
    this.state.opinions[cusip] = OPINIONS.BULLISH;
    this.state.opinionCounts[cusip][OPINIONS.BULLISH] += 1;
    this.forceUpdate();
  }
  
  onClickLike(cusip, comment) {
    if (this.isAssetLiked(cusip)) {
      ParseDispatcher.unlikeAsset(this.props.superUser, cusip);
      let index = this.state.likedAssets.findIndex(asset => asset.attributes.cusip === cusip);
      this.state.likedAssets.splice(index, 1);
      this.state.likeCounts[cusip] -= 1;
    } else {
      ParseDispatcher.likeAsset(this.props.superUser, cusip, comment);
      this.state.likedAssets.push({attributes: {cusip}});
      this.state.likeCounts[cusip] += 1;
    }
    
    this.forceUpdate();
  }
  
  onGetAssets(assets, likedAssets, likeCounts, opinions, opinionCounts) {
		likedAssets.sort((asset1, asset2) =>
      likeCounts[asset2.attributes.cusip] - likeCounts[asset1.attributes.cusip]
    );

    this.setState({
      assets,
      isLoading: false,
      likedAssets,
      likeCounts,
      opinions,
      opinionCounts,
    });
  }
  
  _renderAssets() {
    if (this.state.isLoading) {
      return (
        <View style={{alignItems: 'center', flex: 1, justifyContent: 'center'}}>
          <Spinner color="green" />
        </View>
      );
    }

  	return (
      <View style={styles.tab}>
        {this.state.assets.map(asset => this._renderAsset(asset))}
      </View>
    );
  }
  
  _renderAsset(asset) {
    if (asset.removed) {
      return null;
    }
    let opinions = this.state.opinionCounts[asset.get("cusip")];
    let main = (
      <View key={asset.id} style={styles.assetRow}>
        <AssetCardSwipable
          bearishCount={opinions ? opinions[OPINIONS.BEARISH] : 0}
          bullishCount={opinions ? opinions[OPINIONS.BULLISH] : 0}
          comment={asset.attributes.comment}
          cusip={asset.attributes.cusip}
          id={asset.id}
          isLiked={this.isAssetLiked(asset.attributes.cusip)}
          isShort={false}
          likeCount={this.state.likeCounts[asset.get("cusip")]}
          onBearish={this.onBearish}
          onBullish={this.onBullish}
          onClickLike={this.onClickLike}
          onRemoveAsset={this.props.ownPortfolio && this.onRemoveAsset}
          opinion={this.state.opinions[asset.get("cusip")]}
          updatedAt={asset.attributes.updatedAt.toDateString()}
        />
      </View>
    );
    
    if (this.state.expandedAssets.indexOf(asset.id) === -1 ) {
      return main;
    }
    

    return (
      <View style={styles.assetWrapper} key={asset.id}>
        {main}
      </View>
    );
  }

  renderLikedAssets() {
		return (
      <View style={styles.tab}>
        {this.state.likedAssets.map(asset => this.renderLikedAsset(asset))}
      </View>
    );
  }

  renderLikedAsset(asset) {
    let opinions = this.state.opinionCounts[asset.get("cusip")];
    return (
      <View key={asset.attributes.cusip} style={styles.assetRow}>
        <AssetCardSwipable
          bearishCount={opinions ? opinions[OPINIONS.BEARISH] : 0}
          bullishCount={opinions ? opinions[OPINIONS.BULLISH] : 0}
          comment={asset.attributes.originalComment}
          cusip={asset.attributes.cusip}
          isLiked={true}
          likeCount={this.state.likeCounts[asset.attributes.cusip]}
          onBearish={this.onBearish}
          onBullish={this.onBullish}
          onClickLike={this.unlikeLikedAsset}
          opinion={this.state.opinions[asset.get("cusip")]}
          removeOnUnlike={true}
        />
      </View>
    );
  }
  
  onRemoveAsset(cusip, isShort, id) {
    ParseDispatcher.removeAsset(this.props.loggedInUser, cusip, isShort, this.onRemoveAssetCallback);
  }
  
  onRemoveAssetCallback(asset, error) {
  	let index = this.state.assets.findIndex(currentAsset => currentAsset.id === asset.id);
    this.state.assets[index].removed = true;
    LayoutAnimation.easeInEaseOut();
    this.forceUpdate();
  }

  unlikeLikedAsset(cusip) {
    LayoutAnimation.easeInEaseOut();
		this.onClickLike(cusip);
  }

  renderOwnPortfolio() {
    return (
      <View>
        <Tabs>
          <View style={styles.tab} tabLabel="My Portfolio">{this._renderAssets()}</View>
          <View style={styles.tab} tabLabel="Stocks I've Liked">{this.renderLikedAssets()}</View>
        </Tabs>
      </View>
    );
  }

  renderOtherPortfolio() {
    return (
      <View>
        {this._renderAssets()}
      </View>
    );
  }

  render() {
    if (this.props.ownPortfolio) {
      return this.renderOwnPortfolio();
    } else {
      return this.renderOtherPortfolio();
    }
  }
}

const styles = StyleSheet.create({
  assetRow: {
    alignItems: 'center',
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginVertical: 2,
  },
  assetWrapper: {
    backgroundColor: '#04A0FD',
  },
  footerButtons: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tab: {
    flex: 1,
  },
  test: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export {
  Portfolio,
};
