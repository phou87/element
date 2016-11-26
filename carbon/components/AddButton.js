import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

class AddButton extends Component {
  render() {
    return (
      <TouchableOpacity style={styles.button} onPress={() => this.props.onClick()}>
      	<Text style={styles.cross}>
        	+
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
  	borderColor: 'white',
    borderWidth: 2,
    height: 50,
    justifyContent: 'center',
  	width: 50,
  },
  cross: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 40,
    paddingBottom: 4,
  },
});

module.exports = AddButton;
