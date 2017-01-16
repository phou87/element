import {
  PixelRatio,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import React, { Component } from 'react';
import {SCENES} from '../common/constants'
import {Button} from 'native-base';

pixelRatio = PixelRatio.get();

class BottomNav extends Component {
  props: {
    sceneIDSelected: number,
    onTransact: Function,
    onSwitchNav: Function,
  };

  _renderNormalItem(sceneIDs, name) {
    let selected = sceneIDs.indexOf(this.props.sceneIDSelected) !== -1;
    /*
    let style = selected
      ? styles.itemContainerSelected
      : styles.itemContainerDeselected;
    let textStyle = selected
      ? styles.itemTextSelected
      : styles.itemTextDeselected;
    let ItemContainer = selected
      ? View
      : TouchableOpacity;
    */
    
    let style = {
      backgroundColor: selected ? 'lightgrey' : undefined,
    };
    
    return (
      <Button
        disabled={selected}
        key={name}
        style={style}
        success
        onPress={() => this.props.onSwitchNav(sceneIDs[0])}>
          {name}
      </Button>
    );
  }

  _renderTransactionButton() {
  	let selected = this.props.sceneIDSelected === SCENES.BUY_SELL;
    let ItemContainer = selected
      ? View
      : TouchableOpacity;
  
    return (
      <View key="button">
        <View style={styles.transactButtonShadow} />
        <ItemContainer
          onPress={() => this.props.onSwitchNav(SCENES.BUY_SELL)}
          style={styles.transactButton}>
          <Text style={styles.transactButtonText}>
            {'$'}
          </Text>
        </ItemContainer>
        
      </View>
    );
  }

  _renderItems() {
    return [
      this._renderNormalItem([SCENES.FOLLOWING_FRIENDS, SCENES.FIND_FRIENDS], "Following"),
      this._renderTransactionButton(),
      this._renderNormalItem([SCENES.PORTFOLIO], "Portfolio"),
    ];
  }

  render() {
    return (
      <View style={styles.container}>
        {this._renderItems()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 120,
    justifyContent: 'center',
    padding: 15,
  },
  itemContainerSelected: {
    backgroundColor: 'white',
    borderColor: 'dimgrey',
    borderRadius: 4,
    borderWidth: 1,
  },
  itemContainerDeselected: {
    backgroundColor: 'white',
    borderColor: 'deepskyblue',
    borderRadius: 4,
    borderWidth: 1,
  },
  itemTextSelected: {
    color: 'dimgrey',
    fontSize: 10 * pixelRatio,
    textAlign: 'center',
    margin: 5,
  },
  itemTextDeselected: {
    color: 'deepskyblue',
    fontSize: 10 * pixelRatio,
    textAlign: 'center',
    margin: 5,
  },
  transactButton: {
    backgroundColor: 'deepskyblue',
    borderColor: 'black',
    borderRadius: 20 * pixelRatio,
    borderWidth: 1,
    justifyContent: 'center',
    marginLeft: 10 * pixelRatio,
    marginRight: 10 * pixelRatio,
    width: 35 * pixelRatio,
    height: 35 * pixelRatio,
  },
  transactButtonShadow: {
    borderColor: 'white',
    borderRadius: 20 * pixelRatio,
    borderWidth: 1,
    left: -1,
    marginLeft: 10 * pixelRatio,
    marginRight: 10 * pixelRatio,
    position: 'absolute',
    top: -1,
    width: 36 * pixelRatio,
    height: 36 * pixelRatio,
  },
  transactButtonText: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 40,
  }
});

module.exports = BottomNav;
