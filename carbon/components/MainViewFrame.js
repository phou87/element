import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import BottomNav from './BottomNav'
import Header from './Header'

class MainViewFrame extends Component {
  render() {
    return (
      <View style={styles.mainView}>
        <Header loggedInUser={this.props.loggedInUser} onLogout={this.props.onLogout} />
        <View style={styles.middleContent}>
        	{this.props.children}
        </View>
        <BottomNav
          sceneIDSelected={this.props.scene}
          onSwitchNav={(id) => this.props.onSwitchNav(id)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  middleContent: {
    flex: 1,
  },
});

module.exports = MainViewFrame;
