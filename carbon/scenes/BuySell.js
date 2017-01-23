import {
  Alert,
  Image,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from 'react-native';

import React, { Component } from 'react';
import Parse from 'parse/react-native';

import {Button, CheckBox, Icon, Input, InputGroup, List, ListItem, Text, Textarea} from 'native-base';

import ParseDispatcher from '../dispatchers/ParseDispatcher'

class BuySell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commentText: '',
      cusipText: '',
      notifyFriendsSwitch: true,
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
        'Something went wrong.  Please try again.',
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
        'You do not have this Stock in your portfolio.',
        [{text: 'OK'}],
      );
      return;
    }
  
    if (error) {
      Alert.alert(
        'Error',
        'Something went wrong.  Please try again.',
        [{text: 'OK'}],
      );
    } else {
      if (this.state.notifyFriendsSwitch) {
        ParseDispatcher.sendPushToFollowers(asset.attributes.cusip, "sell");
      }
      Alert.alert(
        'Stock sold',
        'You successfully sold this Stock ' + asset.attributes.cusip + '!',
        [{text: 'OK'}],
      );
    }
  }
  
  _checkInputs() {
    if (!this.state.cusipText) {
      Alert.alert(
        'No Symbol Found',
        'You must enter a stock symbol to create a transaction.',
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
  
  setNotifyFriendsSwitch() {
    this.setState({notifyFriendsSwitch: !this.state.setNotifyFriendsSwitch});
  }

	render() {
    return (
      <View style={styles.container}>
      <List>
        <ListItem>
          <InputGroup>
              <Input placeholder="Enter a Stock Symbol" style={styles.cusipText} />
          </InputGroup>
        </ListItem>
        <ListItem>
          <InputGroup>
              <Input multiline={true} numberOfLines={4} placeholder="Tell your friends more about this stock!" style={styles.commentBox} />
          </InputGroup>
        </ListItem>
        <ListItem>
          <CheckBox checked={this.state.notifyFriendsSwitch} onPress={this.setNotifyFriendsSwitch} />
          <Text>Notify Your Friends</Text>
        </ListItem>
        <ListItem>
            <Button rounded block info onPress={this.buy}>Buy</Button>
        </ListItem>
        <ListItem>
            <Button rounded block success onPress={this.sell}> Sell </Button>
        </ListItem>
      </List>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  commentBox: {
    height: 200,
    fontWeight: '500',
    fontSize: 15,
  },
  container: {
  	flex: 1,
    flexDirection: 'column',
    height: 300,
    justifyContent: 'space-around',
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
    fontWeight: '700',
    justifyContent: 'space-around',

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

export {
  BuySell,
};



/*
brandPrimary : '#428bca',
10	    brandInfo: '#5bc0de',
11	    brandSuccess: '#5cb85c',
12	    brandDanger: '#d9534f',
13	    brandWarning: '#f0ad4e',
*/
