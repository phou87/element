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
    
    this.buy = this.buy.bind(this);
    this.onBuyCallback = this.onBuyCallback.bind(this);
    this.onSellCallback = this.onSellCallback.bind(this);
    this.sell = this.sell.bind(this);
    this.setCommentText = this.setCommentText.bind(this);
    this.setCusipText = this.setCusipText.bind(this);
    this.setNotifyFriendsSwitch = this.setNotifyFriendsSwitch.bind(this);
  }
  
  buy() {
    if (!this._checkInputs()) {
      return;
    }
    ParseDispatcher.buyAsset(
      this.props.loggedInUser,
      this.state.cusipText,
      1,
      this.state.commentText,
      this.state.shortSwitch,
      this.onBuyCallback,
    );
  }
  
  onBuyCallback(asset, error) {
    if (error) {
      Alert.alert(
        'Error',
        'Something went wrong.  Please try again later.',
        [{text: 'OK'}],
      );
    } else {
      if (this.state.notifyFriendsSwitch) {
        ParseDispatcher.sendPushToFollowers(asset.attributes.cusip, "buy");
      }
      Alert.alert(
        'Stock bought',
        'You successfully bought ' + asset.attributes.cusip + '!',
        [{text: 'OK'}],
      );
    }
  }
  
  sell() {
    if (!this._checkInputs()) {
      return;
    }
    ParseDispatcher.removeAsset(
      this.props.loggedInUser,
      this.state.cusipText,
      false,
      this.onSellCallback,
    );
  }
  
  onSellCallback(asset, error) {
    if (!asset) {
      Alert.alert(
        'Error',
        'You do not own this security.',
        [{text: 'OK'}],
      );
      return;
    }
  
    if (error) {
      Alert.alert(
        'Error',
        'Something went wrong.  Please try again later.',
        [{text: 'OK'}],
      );
    } else {
      if (this.state.notifyFriendsSwitch) {
        ParseDispatcher.sendPushToFollowers(asset.attributes.cusip, "sell");
      }
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
  
  setCommentText(commentText) {
    this.setState({commentText});
  }
  
  setCusipText(cusipText) {
    this.setState({cusipText});
  }
  
  setNotifyFriendsSwitch(value) {
    this.setState({notifyFriendsSwitch: value});
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
            onChangeText={this.setCusipText}
            value={this.state.cusipText}
          />
        </View>
        <TextInput
          blurOnSubmit={true}
          style={styles.commentBox}
          onChangeText={this.setCommentText}
          value={this.state.commentText}
          multiline={true}
          numberOfLines={4}
          placeholder="Comments (optional)"
          returnKeyType="done"
        />
        <View style={styles.notifyFriendsRow}>
          <Switch
            onValueChange={this.setNotifyFriendsSwitch}
            value={this.state.notifyFriendsSwitch}
          />
        	<Text style={styles.notifyFriendsText}>
            Notify Friends
          </Text>
        </View>
        <View style={styles.actionRow}>
        	<Button onClick={this.buy}>Buy</Button>
          <Button onClick={this.sell}>Sell</Button>
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
