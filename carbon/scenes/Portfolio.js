import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import React, { Component } from 'react';
import {Button, Card, CardItem, Icon, Tabs, Text} from 'native-base';
import {Container, Content, Spinner} from 'native-base';

import ParseDispatcher from '../dispatchers/ParseDispatcher';

class Portfolio extends Component {
  constructor(props) {
    super(props);
  	this.state = {
      assets: [],
      expandedAssets: [],
      isLoading: true,
      testIsLiked: false,
    };
    
    this.onGetAssets = this.onGetAssets.bind(this);
    this.onRemoveAssetCallback = this.onRemoveAssetCallback.bind(this);
  }

  componentWillMount() {
    ParseDispatcher.getAllAssets(this.props.loggedInUser, this.onGetAssets);
  }
  
  onGetAssets(assets) {
    this.setState({
      assets,
      isLoading: false,
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
  
  	return this.state.assets.map(asset => this._renderAsset(asset));
  }
  
  _renderAsset(asset) {
    let main = (
      <View key={asset.id} style={styles.assetRow}>
        <Card>
          <CardItem>
            <View style={styles.test}>
              <View>
            <Text>{asset.attributes.cusip + (asset.attributes.isShort ? ' (Short)' : '')}</Text>
            <Text style={{color: '#808080', fontWeight: '100'}}>{asset.attributes.updatedAt.toDateString()}</Text>
              </View>
            <Button
              info
              onPress={() => this._onRemoveAsset(asset.attributes.cusip, asset.attributes.isShort)}
              rounded
              style={styles.footerEditButton}
            >
              <Icon name='ios-color-wand' />
            </Button>
            </View>
          </CardItem>

          <CardItem cardBody>
            <TouchableOpacity key={asset.id} onPress={() => this._onClickRow(asset)}>
            <Text>
              {asset.attributes.comment ? asset.attributes.comment : 'No comment'}
            </Text>
            </TouchableOpacity>
          </CardItem>

          <CardItem header>                        
            {this._renderRightRowSection(asset)}
          </CardItem>
        </Card>
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

  _renderRightRowSection(asset) {
  	if (!this.props.ownPortfolio) {
      return null;
    }
  
  	if (asset.removed) {
    	return (
        <Text>
          Removed!
        </Text>
      );
    }
    
    return (
      <View style={styles.footerButtons}>
        <Button onPress={() => this.setState({testIsLiked: !this.state.testIsLiked})} transparent>
          {this.state.testIsLiked ? <Icon name='ios-heart' /> : <Icon name='ios-heart-outline' />}
          12
        </Button>
        <Button
          onPress={() => this._onRemoveAsset(asset.attributes.cusip, asset.attributes.isShort)}
          rounded
          style={styles.footerCloseButton}
          warning
        >
          <Icon name='ios-close' />
        </Button>
      </View>
    );
  }
  
  _onClickRow(asset) {
    this.setState({
      expandedAssets: [asset.id],
    });
  }
  
  _onRemoveAsset(cusip, isShort) {
    ParseDispatcher.removeAsset(this.props.loggedInUser, cusip, isShort, this.onRemoveAssetCallback);
  }
  
  onRemoveAssetCallback(asset) {
  	let index = this.state.assets.findIndex(currentAsset => currentAsset.id === asset.id);
    this.state.assets[index].removed = true;
    this.forceUpdate();
  }

  render() {
    let title = this.props.ownPortfolio ? 'Portfolio' : this.props.loggedInUser.get("name");
  
    return (
      <View>
        <Tabs>
          <Container tabLabel="My Portfolio"><Content>{this._renderAssets()}</Content></Container>
          <Container tabLabel="Shit I've Liked"><Content><Text>Test</Text></Content></Container>
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
  footerEditButton: {
    minWidth: 21,
  },
  footerCloseButton: {
    minWidth: 17,
  },
  test: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export {
  Portfolio,
};
