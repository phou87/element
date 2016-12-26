import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

class Button extends Component {
  render() {
    return (
      <TouchableOpacity style={[styles.button, this.props.buttonStyle]} onPress={() => this.props.onClick()}>
      	<Text style={[styles.label, this.props.textStyle]}>
        	{this.props.children}
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
    width: 100,
  },
  label: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 15,
    lineHeight: 15,
  },
});

module.exports = Button;
