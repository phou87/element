import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import React, { Component } from 'react';
import {SCENES} from '../common/constants'

class BottomNav extends Component {
  props: {
    sceneIDSelected: number,
    onTransact: Function,
    onSwitchNav: Function,
  };

  _renderNormalItem(sceneIDs, name) {
    let selected = sceneIDs.indexOf(this.props.sceneIDSelected) === -1;
    let style = selected
      ? styles.itemContainerDeselected
      : styles.itemContainerSelected;
    let ItemContainer = selected
      ? View
      : TouchableOpacity;
    return (
      <ItemContainer
        key={name}
        style={style}
        onPress={() => this.props.onSwitchNav(sceneIDs[0])}>
        <Text style={styles.itemText}>
          {name}
        </Text>
      </ItemContainer>
    );
  }

  _renderTransactionButton() {
    return (
      <View style={styles.transactButton}>
        <Text style={styles.transactButtonText}>
          {'$'}
        </Text>
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#006400',
    justifyContent: 'center',
    padding: 20,
  },
  itemContainerSelected: {
    backgroundColor: 'grey',
  },
  itemContainerDeselected: {
    backgroundColor: 'white',
  },
  itemText: {
    fontSize: 30,
    textAlign: 'center',
    margin: 5,
  },
  transactButton: {
    backgroundColor: '#A4D2A4',
    borderRadius: 50,
    justifyContent: 'center',
    width: 100,
    height: 100,
  },
  transactButtonText: {
    fontSize: 40,
    textAlign: 'center',
  }
});

module.exports = BottomNav;
