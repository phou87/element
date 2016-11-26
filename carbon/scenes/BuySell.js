import {
  Alert,
  Image,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import React, { Component } from 'react';

import Button from '../components/Button'
import ParseDispatcher from '../dispatchers/ParseDispatcher'

class BuySell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commentText: '',
      cusipText: '',
      notifyFriendsSwitch: false,
      shortSwitch: false,
    };
  }
  
  _buy() {
    if (!this._checkInputs()) {
      return;
    }
    ParseDispatcher.buyAsset(this.props.loggedInUser, this.state.cusipText, 1, this._onBuyCallback.bind(this));
  }
  
  _onBuyCallback(asset, error) {
    if (error) {
      Alert.alert(
        'Error',
        'Something went wrong.  Please try again later.',
        [{text: 'OK'}],
      );
    } else {
      Alert.alert(
        'Stock bought',
        'You successfully bought ' + asset.attributes.cusip + '!',
        [{text: 'OK'}],
      );
    }
  }
  
  _sell() {
    if (!this._checkInputs()) {
      return;
    }
    ParseDispatcher.sellAsset(this.props.loggedInUser, this.state.cusipText, 1, this._onSellCallback.bind(this));
  }
  
  _onSellCallback(asset, error) {
    if (error) {
      Alert.alert(
        'Error',
        'Something went wrong.  Please try again later.',
        [{text: 'OK'}],
      );
    } else {
      Alert.alert(
        'Stock sold',
        'You successfully sold ' + asset.attributes.cusip + '!',
        [{text: 'OK'}],
      );
    }
  }
  
  _checkInputs() {
    if (!this.state.cusipText) {
      Alert.alert(
        'No stock entered',
        'You must enter a stock to buy or sell.',
        [
          {text: 'OK', onPress: () => console.log('OK Pressed!')},
        ]
      );
      return false;
    }
    
    return true;
  }

	render() {
  	return (
      <View style={styles.container}>
      	<Text style={styles.header}>
        	ADD STOCK
        </Text>
        <View style={styles.cusipRow}>
        	<TextInput
            style={styles.cusip}
            onChangeText={(cusipText) => this.setState({cusipText})}
            value={this.state.cusipText}
          />
          <View style={styles.transactionTypeRow}>
            <Switch
              onValueChange={(value) => this.setState({shortSwitch: value})}
              value={this.state.shortSwitch}
            />
            <Text>
              Short
            </Text>
          </View>
        </View>
        <TextInput
          style={styles.commentBox}
          onChangeText={(commentText) => this.setState({commentText})}
          value={this.state.commentText}
          multiline={true}
          numberOfLines={4}
        />
        <View style={styles.notifyFriendsRow}>
          <Switch
            onValueChange={(value) => this.setState({notifyFriendsSwitch: value})}
            value={this.state.notifyFriendsSwitch}
          />
        	<Text>
            Notify Friends
          </Text>
        </View>
        <View style={styles.actionRow}>
        	<Button onClick={() => this._buy()}>Buy</Button>
          <Button onClick={() => this._sell()}>Sell</Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  commentBox: {
    backgroundColor: 'white',
  	flex: 1,
    height: 150,
    margin: 20,
  },
  container: {
  	flex: 1,
    flexDirection: 'column',
    backgroundColor: '#04A0FD',
    padding: 20,
  },
  header: {
  	alignSelf: 'center',
    color: 'white',
  },
  actionRow: {
  	flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  cusip: {
    backgroundColor: 'white',
    fontSize: 30,
  	width: 100,
  },
  cusipRow: {
  	flexDirection: 'row',
    height: 40,
    justifyContent: 'space-around',
    marginTop: 20,
  },
  transactionTypeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 100,
  },
  notifyFriendsRow: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
  	justifyContent: 'space-around',
    width: 160,
  },
});

module.exports = BuySell;
