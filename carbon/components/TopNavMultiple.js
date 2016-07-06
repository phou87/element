import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import React, { Component } from 'react';

class TopNavMultiple extends Component {
  props: {
    items: Array<Object>,
    selected: number,
    onSwitchNav: Function,
  };

  _renderItems() {
    return this.props.items.map(item => {
      let style = this.props.selected === item.id
        ? styles.itemContainerSelected
        : styles.itemContainerDeselected;
      let ItemContainer = this.props.selected === item.id
        ? View
        : TouchableOpacity;
      return (
        <ItemContainer
          key={item.id}
          style={style}
          onPress={() => this.props.onSwitchNav(item.id)}>
          <Text style={styles.itemText}>
            {item.name}
          </Text>
        </ItemContainer>
      );
    });
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
});

module.exports = TopNavMultiple;
