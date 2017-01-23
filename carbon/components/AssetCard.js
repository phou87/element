import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import React, { Component } from 'react';
import {Button, Card, CardItem, Icon, Input, InputGroup, Tabs, Text} from 'native-base';

import mytheme from '../common/mytheme';

class AssetCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: props.comment,
      editing: false,
    };
    
    this.onChangeComment = this.onChangeComment.bind(this);
    this.onClickLike = this.onClickLike.bind(this);
    this.onEditAsset = this.onEditAsset.bind(this);
    this.onRemoveAsset = this.onRemoveAsset.bind(this);
  }

  onChangeComment(comment) {
    this.setState({comment});
  }

  onClickLike() {
    this.props.onClickLike(this.props.cusip);
  }

  onEditAsset() {
    this.setState({editing: true});
  }

  onRemoveAsset() {
    this.props.onRemoveAsset(this.props.cusip, this.props.isShort);
  }

  renderCommentSection() {
    if (!this.state.editing) {
      return (
        <Text style={styles.commentText}>
          {this.props.comment ? this.props.comment : 'Nothing to say - this stock speaks for itself'}
        </Text>
      );
    }

    return (
      <InputGroup>
        <Input onChangeText={this.onChangeComment} value={this.state.comment} />
      </InputGroup>
    );
  }

  renderEditButton() {
    return null;

    /*
    return (
      <Button
        info
        onPress={this.onEditAsset}
        rounded
        style={styles.editButton}
        transparent
      >
        <Icon name='ios-color-wand' style={{fontSize: 35, color: '#5bc0de'}} />
      </Button>
    );
    */
  }

  renderFooter() {
    return (
      <View style={styles.cardFooter}>
        <Button onPress={this.onClickLike} transparent>
          {this.props.isLiked ? <Icon name='ios-heart' style={{color: '#d9534f'}} /> : <Icon name='ios-heart-outline' style={{color: '#d9534f'}} />}
          {this.props.likeCount ? this.props.likeCount : ''}
        </Button>
        <Button
          onPress={this.onRemoveAsset}
          rounded
          style={styles.closeButton}
          transparent
        >
          <Icon name='ios-close-circle' style={{fontSize: 30, color: '#5cb85c'}} />
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
              <Text style={styles.symbolText}>{this.props.cusip}</Text>
              <Text style={styles.updatedAtText}>Updated on {this.props.updatedAt}</Text>
            </View>
            {this.renderEditButton()}
          </View>
        </CardItem>

        <CardItem cardBody>
					{this.renderCommentSection()}
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
    fontWeight: '600',
    fontSize: 12,
  },
  symbolText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 16,
  },
  commentText: {
    color: '#000000',
    fontWeight: '300',
    fontSize: 14,
  },
});

export {
  AssetCard,
};
