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
import Parse from 'parse/react-native';

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
    ParseDispatcher.buyAsset(
      this.props.loggedInUser,
      this.state.cusipText,
      1,
      this.state.commentText,
      this.state.shortSwitch,
      this._onBuyCallback.bind(this),
    );
  }
  
  _onBuyCallback(asset, error) {
    if (error) {
      Alert.alert(
        'Error',
        'Something went wrong.  Please try again later.',
        [{text: 'OK'}],
      );
    } else {
      ParseDispatcher.sendPushToFollowers(asset.attributes.cusip, "buy");
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
    ParseDispatcher.sellAsset(
      this.props.loggedInUser,
      this.state.cusipText,
      1,
      this.state.commentText,
      this.state.shortSwitch,
      this._onSellCallback.bind(this),
      );
  }
  
  _onSellCallback(asset, error) {
    if (error) {
      Alert.alert(
        'Error',
        'Something went wrong.  Please try again later.',
        [{text: 'OK'}],
      );
    } else {
      ParseDispatcher.sendPushToFollowers(asset.attributes.cusip, "sell");
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
    /*
    <View style={styles.transactionTypeRow}>
      <Switch
        onValueChange={(value) => this.setState({shortSwitch: value})}
        value={this.state.shortSwitch}
      />
      <Text>
        Short
      </Text>
    </View>
    */
  
  	return (
      <View style={styles.container}>
      	<Text style={styles.header}>
        	Add Security
        </Text>
        <View style={styles.cusipRow}>
          <Text style={styles.cusipText}>
            Symbol
          </Text>
        	<TextInput
            autoCapitalize="characters"
            maxLength={4}
            style={styles.cusip}
            onChangeText={(cusipText) => this.setState({cusipText})}
            value={this.state.cusipText}
          />
        </View>
        <TextInput
          blurOnSubmit={true}
          style={styles.commentBox}
          onChangeText={(commentText) => this.setState({commentText})}
          value={this.state.commentText}
          multiline={true}
          numberOfLines={4}
          placeholder="Comments (optional)"
          returnKeyType="done"
        />
        <View style={styles.notifyFriendsRow}>
          <Switch
            onValueChange={(value) => this.setState({notifyFriendsSwitch: value})}
            value={this.state.notifyFriendsSwitch}
          />
        	<Text style={styles.notifyFriendsText}>
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
    fontSize: 20,
    height: 150,
    padding: 10,
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
  cusipText: {
    fontSize: 20,
  },
  cusipRow: {
    alignItems: 'center',
    alignSelf: 'center',
  	flexDirection: 'row',
    height: 40,
    justifyContent: 'space-around',
    marginTop: 20,
    width: 200,
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
  notifyFriendsText: {
    fontWeight: 'bold',
  },
});

module.exports = BuySell;
