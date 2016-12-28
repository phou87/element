import {
  ActivityIndicator,
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
      expandedAssets: [],
      isLoading: true,
    };
    
    this.onGetAssets = this.onGetAssets.bind(this);
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
      <TouchableOpacity key={asset.id} style={styles.assetRow} onPress={() => this._onClickRow(asset)}>
        <Text style={styles.assetText}>
      		{asset.attributes.cusip + (asset.attributes.isShort ? ' (Short)' : '')}
        </Text>
        {this._renderRightRowSection(asset)}
      </TouchableOpacity>
    );
    
    if (this.state.expandedAssets.indexOf(asset.id) === -1 ) {
      return main;
    }
    
    return (
      <View style={styles.assetWrapper} key={asset.id}>
        {main}
        <View style={styles.commentBox}>
          <Text>
            {asset.attributes.comment ? asset.attributes.comment : '(no comment saved)'}
          </Text>
        </View>
        <Text style={styles.updatedAtText}>
          {'Updated: ' + asset.attributes.updatedAt.toDateString()}
        </Text>
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
      <RemoveButton
        crossStyle={crossStyle}
        onClick={() => this._onRemoveAsset(asset.attributes.cusip, asset.attributes.isShort)}
      />
    );
  }
  
  _onClickRow(asset) {
    this.setState({
      expandedAssets: [asset.id],
    });
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
    let title = this.props.ownPortfolio ? 'My Portfolio' : this.props.loggedInUser.get("name");
  
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{title}</Text>
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
  assetWrapper: {
    backgroundColor: '#04A0FD',
  },
  commentBox: {
    backgroundColor: 'white',
    height: 50,
    padding: 10,
    margin: 10,
  },
  updatedAtText: {
    color: 'white',
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
});

export {
  Portfolio,
};
