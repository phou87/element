/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View
} from 'react-native';

import {Button, CheckBox, Icon, Input, InputGroup, List, ListItem, Text, Textarea} from 'native-base';


export default class hydrogen extends Component {
  render() {
    return (
            <View style={styles.container}>
            <List>
            <ListItem>
            <InputGroup>
            <Icon name='ios-search' style={{color: '#5cb85c'}}/>
            <Input placeholder="Enter a Stock Symbol" />
            </InputGroup>
            </ListItem>
            </List>
            </View>
            
            );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('hydrogen', () => hydrogen);
