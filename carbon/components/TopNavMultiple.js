import {
  PixelRatio,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import React, { Component } from 'react';
import {Button} from 'native-base';

pixelRatio = PixelRatio.get();

class TopNavMultiple extends Component {
  props: {
    items: Array<Object>,
    selected: number,
    onSwitchNav: Function,
  };

  _renderItems() {
    return this.props.items.map((item, index) => {
      let selected = this.props.selected === item.id;
      /*
      let style = selected
        ? styles.itemContainerSelected
        : styles.itemContainerDeselected;
      let textStyle = selected
        ? styles.itemTextSelected
        : styles.itemTextDeselected;
      */
      /*
      let ItemContainer = selected
        ? View
        : TouchableOpacity;
      */
        
      let containerStyle = [style];
      if (index === 0) {
        containerStyle.push(styles.itemContainerFirst);
      } else if (index === this.props.items.length - 1) {
      	containerStyle.push(styles.itemContainerLast);
      }
      
      let style = {
        backgroundColor: selected ? 'lightgrey' : undefined,
        marginLeft: index ? 10 : 0,
      };
        
      return (
        <Button
          disabled={selected}
          key={item.id}
          style={style}
          success
          onPress={() => this.props.onSwitchNav(item.id)}>
            {item.name}
        </Button>
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 100,
    justifyContent: 'center',
    padding: 20,
  },
  itemContainerSelected: {
    backgroundColor: '#414141',
    borderColor: 'white',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  itemContainerDeselected: {
    backgroundColor: '#0A8FFD',
    borderColor: 'white',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  itemContainerFirst: {
    borderBottomLeftRadius: 4,
    borderTopLeftRadius: 4,
  },
  itemContainerLast: {
    borderBottomRightRadius: 4,
    borderTopRightRadius: 4,
  },
  itemTextSelected: {
    color: 'white',
    fontSize: 10 * pixelRatio,
    textAlign: 'center',
    margin: 5,
  },
  itemTextDeselected: {
    color: 'white',
    fontSize: 10 * pixelRatio,
    textAlign: 'center',
    margin: 5,
  },
});

module.exports = TopNavMultiple;
