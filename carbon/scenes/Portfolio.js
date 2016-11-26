import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

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
      <View key={asset.id} style={styles.assetRow}>
        <Text style={styles.assetText}>
      		{asset.attributes.cusip}
        </Text>
      </View>
    );
  }

  render() {
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
    backgroundColor: '#575757',
  },
  assetRow: {
    alignItems: 'center',
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-around',
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
