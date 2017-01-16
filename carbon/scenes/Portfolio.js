import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import React, { Component } from 'react';
import {Button, Card, CardItem, Icon, Text} from 'native-base';
import {Container, Content} from 'native-base';

import ParseDispatcher from '../dispatchers/ParseDispatcher'
import RemoveButton from '../components/RemoveButton'

class Portfolio extends Component {
  constructor(props) {
    super(props);
  	this.state = {
      assets: [],
      expandedAssets: [],
      isLoading: true,
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
      return <ActivityIndicator />;
    }
  
  	return this.state.assets.map(asset => this._renderAsset(asset));
  }
  
  _renderAsset(asset) {
    let main = (
      <View style={styles.assetRow}>
        <Card>
          <CardItem>
            <Text>{asset.attributes.cusip + (asset.attributes.isShort ? ' (Short)' : '')}</Text>
            <Text note>{asset.attributes.updatedAt.toDateString()}</Text>
          </CardItem>

          <CardItem cardBody>
            <TouchableOpacity key={asset.id} onPress={() => this._onClickRow(asset)}>
            <Text>
              {asset.attributes.comment ? asset.attributes.comment : '(no comment saved)'}
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
    
    let crossStyle = null;
    if (this.state.expandedAssets.indexOf(asset.id) !== -1 ) {
      crossStyle = {color: 'white'};
		}
    
    return (
      <View style={styles.footerButtons}>
        <Button
          info
          onPress={() => this._onRemoveAsset(asset.attributes.cusip, asset.attributes.isShort)}
          rounded
          style={styles.footerEditButton}
        >
          <Icon name='ios-color-wand' />
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
    let title = this.props.ownPortfolio ? 'My Portfolio' : this.props.loggedInUser.get("name");
  
    return (
      <View style={styles.container}>
        {this._renderAssets()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  header: {
    margin: 10,
  },
  headerText: {
    color: 'white',
    fontSize: 28,
    textAlign: 'center',
  },
  assetRow: {
    alignItems: 'center',
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginVertical: 2,
  },
  assetText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'left',
    margin: 10,
  },
  assetWrapper: {
    backgroundColor: '#04A0FD',
  },
  commentBox: {
    height: 50,
    padding: 10,
    margin: 10,
  },
  updatedAtText: {
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
});

export {
  Portfolio,
};
