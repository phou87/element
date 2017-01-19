import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import React, { Component } from 'react';
import {Button, Card, CardItem, Icon, Tabs, Text} from 'native-base';

import mytheme from '../common/mytheme';

class AssetCard extends Component {
  constructor(props) {
    super(props);
    
    this.onClickLike = this.onClickLike.bind(this);
    this.onRemoveAsset = this.onRemoveAsset.bind(this);
  }
  
  onClickLike() {
    this.props.onClickLike(this.props.cusip);
  }

  onRemoveAsset() {
    this.props.onRemoveAsset(this.props.cusip, this.props.isShort);
  }
  
  renderFooter() {
    return (
      <View style={styles.cardFooter}>
        <Button onPress={this.onClickLike} transparent>
          {this.props.isLiked ? <Icon name='ios-heart' style={{color: '#d9534f'}} /> : <Icon name='ios-heart-outline' style={{color: '#d9534f'}} />}
          12
        </Button>
        <Button
          onPress={this.onRemoveAsset}
          rounded
          style={styles.closeButton}
          warning
        >
          <Icon name='ios-close-circle' style={{fontSize: 30, color: '#f0ad4e'}} />
        </Button>
      </View>
    );
  }

  render() {
    return (
      <Card theme={mytheme}>
        <CardItem>
          <View style={styles.cardHeader}>
            <View>
              <Text>{this.props.cusip}</Text>
              <Text style={styles.updatedAtText}>Updated on {this.props.updatedAt}</Text>
            </View>
            <Button
              info
              onPress={this.onRemoveAsset}
              rounded
              style={styles.editButton}
              transparent
            >
              <Icon name='ios-color-wand' style={{fontSize: 35, color: '#5bc0de'}} />
            </Button>
          </View>
        </CardItem>

        <CardItem cardBody>
          <Text>
            {this.props.comment ? this.props.comment : 'Nothing to say - this stock speaks for itself'}
          </Text>
        </CardItem>

        <CardItem header>                        
          {this.renderFooter()}
        </CardItem>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  cardFooter: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  closeButton: {
    minWidth: 17,
  },
  editButton: {
    minWidth: 21,
  },
  updatedAtText: {
    color: '#000000',
    fontWeight: '100',
  },
});

export {
  AssetCard,
};
