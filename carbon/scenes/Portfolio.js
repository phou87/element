import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import React, { Component } from 'react';
import {Button, Card, CardItem, Icon, Tabs, Text} from 'native-base';
import {Container, Content, Spinner} from 'native-base';

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
      testIsLiked: false,
    };
    
    this.onClickLike = this.onClickLike.bind(this);
    this.onGetAssets = this.onGetAssets.bind(this);
    this.onRemoveAsset = this.onRemoveAsset.bind(this);
    this.onRemoveAssetCallback = this.onRemoveAssetCallback.bind(this);
    this.unlikeLikedAsset = this.unlikeLikedAsset.bind(this);
  }

  componentWillMount() {
    ParseDispatcher.getAllAssets(this.props.loggedInUser, this.onGetAssets);
  }
  
  isAssetLiked(cusip) {
    return this.state.likedAssets.findIndex(a => a.attributes.cusip === cusip) !== -1;
  }
  
  onClickLike(cusip) {
    if (this.isAssetLiked(cusip)) {
      ParseDispatcher.unlikeAsset(this.props.loggedInUser, cusip);
      let index = this.state.likedAssets.findIndex(asset => asset.attributes.cusip === cusip);
      this.state.likedAssets.splice(index, 1);
    } else {
      ParseDispatcher.likeAsset(this.props.loggedInUser, cusip);
      this.state.likedAssets.push({attributes: {cusip}});
    }
    
    this.forceUpdate();
  }
  
  onGetAssets(assets, likedAssets, likeCounts) {
    this.setState({
      assets,
      isLoading: false,
      likedAssets,
      likeCounts,
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
      <View>
        {this.state.assets.map(asset => this._renderAsset(asset))}
      </View>
    );
  }
  
  _renderAsset(asset) {
    if (asset.removed) {
      return null;
    }

    let main = (
      <View key={asset.id} style={styles.assetRow}>
        <AssetCardSwipable
          comment={asset.attributes.comment}
          cusip={asset.attributes.cusip}
          id={asset.id}
          isLiked={this.isAssetLiked(asset.attributes.cusip)}
          likeCount={this.state.likeCounts[asset.get("cusip")]}
          onClickLike={this.onClickLike}
          onRemoveAsset={this.onRemoveAsset}
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
      <View>
        {this.state.likedAssets.map(asset => this.renderLikedAsset(asset))}
      </View>
    );
  }

  renderLikedAsset(asset) {
    return (
      <View key={asset.attributes.cusip} style={styles.assetRow}>
        <AssetCardSwipable
          cusip={asset.attributes.cusip}
          isLiked={true}
          likeCount={this.state.likeCounts[asset.attributes.cusip]}
          onClickLike={this.unlikeLikedAsset}
        />
      </View>
    );
  }
  
  onRemoveAsset(cusip, isShort, id) {
    console.debug('gogo');
    this.onRemoveAssetCallback({id});
    // ParseDispatcher.removeAsset(this.props.loggedInUser, cusip, isShort, this.onRemoveAssetCallback);
  }
  
  onRemoveAssetCallback(asset) {
    console.debug(asset);
  	let index = this.state.assets.findIndex(currentAsset => currentAsset.id === asset.id);
    this.state.assets[index].removed = true;
    this.forceUpdate();
  }

  unlikeLikedAsset(cusip) {

  }

  render() {
    let title = this.props.ownPortfolio ? 'Portfolio' : this.props.loggedInUser.get("name");

    return (
      <View>
        <Tabs>
          <View style={styles.tab} tabLabel="My Portfolio">{this._renderAssets()}</View>
          <View style={styles.tab} tabLabel="Stocks I've Liked">{this.renderLikedAssets()}</View>
        </Tabs>
      </View>
    );
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
