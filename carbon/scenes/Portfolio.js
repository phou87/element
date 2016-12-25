import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import React, { Component } from 'react';

import ParseDispatcher from '../dispatchers/ParseDispatcher'
import RemoveButton from '../components/RemoveButton'

class Portfolio extends Component {
  constructor(props) {
    super(props);
  	this.state = {
      assets: [],
    };
  }

  componentWillMount() {
    ParseDispatcher.getAllAssets(this.props.loggedInUser, this._onGetAssets.bind(this));
  }
  
  _onGetAssets(assets) {
    console.debug('set state to', assets);
    this.setState({assets});
  }
  
  _renderAssets() {
    console.debug(this.state.assets);
  	return this.state.assets.map(asset =>
      <TouchableOpacity key={asset.id} style={styles.assetRow} onPress={() => this._onClickRow(asset)}>
        <Text style={styles.assetText}>
      		{asset.attributes.cusip + (asset.attributes.isShort ? ' (Short)' : '')}
        </Text>
        {this._renderRightRowSection(asset)}
      </TouchableOpacity>
    );
  }

  _renderRightRowSection(asset) {
  	if (asset.removed) {
    	return (
        <Text>
          Removed!
        </Text>
      );
    }
    
    return (
      <RemoveButton onClick={() => this._onRemoveAsset(asset.attributes.cusip, asset.attributes.isShort)} />
    );
  }
  
  _onClickRow(asset) {
  	console.debug('heyo');
  }
  
  _onRemoveAsset(cusip, isShort) {
    ParseDispatcher.removeAsset(this.props.loggedInUser, cusip, isShort, this._onRemoveAssetCallback.bind(this));
  }
  
  _onRemoveAssetCallback(assetID) {
  	let index = this.state.assets.findIndex(asset => asset.id === assetID);
    this.state.assets[index].removed = true;
    this.forceUpdate();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>MY PORTFOLIO</Text>
        </View>
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
    backgroundColor: '#575757',
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
    margin: 10,
  },
  assetText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'left',
    margin: 10,
  },
});

export {
  Portfolio,
};
