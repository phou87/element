import {
  StyleSheet,
  View,
} from 'react-native';

import React, { Component } from 'react';
import {Button, Card, CardItem, Icon, Input, InputGroup, Tabs, Text} from 'native-base';

import {OPINIONS} from '../common/constants'
import mytheme from '../common/mytheme';

class AssetCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: props.comment,
      editing: false,
    };

    this.onBearish = this.onBearish.bind(this);
    this.onBullish = this.onBullish.bind(this);
    this.onChangeComment = this.onChangeComment.bind(this);
    this.onClickLike = this.onClickLike.bind(this);
    this.onEditAsset = this.onEditAsset.bind(this);
    this.onRemoveAsset = this.onRemoveAsset.bind(this);
  }

  onBearish() {
		this.props.onBearish(this.props.cusip);
  }

  onBullish() {
		this.props.onBullish(this.props.cusip);
  }

  onChangeComment(comment) {
    this.setState({comment});
  }

  onClickLike() {
    if (this.props.removeOnUnlike) {
      this.props.onSwipe(() => this.props.onClickLike(this.props.cusip, this.props.comment));
    } else {
      this.props.onClickLike(this.props.cusip, this.props.comment);
    }
  }

  onEditAsset() {
    this.setState({editing: true});
  }

  onRemoveAsset() {
    this.props.onSwipe(() => this.props.onRemoveAsset(this.props.cusip, this.props.isShort, this.props.id));
  }

  renderCommentSection() {
    if (!this.state.editing) {
      return (
        <View>
          <Text style={styles.commentTexttitle}>Comment on the Stock:</Text>
          <Text style={styles.commentText}>
            {this.props.comment ? this.props.comment : 'No comment provided'}
          </Text>
        </View>
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
        {this.props.onRemoveAsset &&<Button
          onPress={this.onRemoveAsset}
          rounded
          style={styles.closeButton}
          transparent
        >
          <Icon name='ios-close-circle' style={{fontSize: 25, color: '#f0ad4e'}} />
        </Button>}
      </View>
    );
  }

  renderOpinion() {
    let opinion = this.props.opinion;

    return (
      <View style={styles.cardFooter}>
        <Button
          disabled={opinion === OPINIONS.BULLISH}
          onPress={this.onBullish}
          small
          success={opinion !== OPINIONS.BULLISH}
          rounded
        >
          <Text style={styles.bullbutton}>Bullish: {this.props.bullishCount}</Text>
        </Button>
        <Button
          disabled={opinion === OPINIONS.BEARISH}
          onPress={this.onBearish}
          small
          danger={opinion !== OPINIONS.BEARISH}
          rounded
        >
          <Text style={styles.bullbutton}>Bearish: {this.props.bearishCount}</Text>
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
              {this.props.updatedAt && <Text style={styles.updatedAtText}>Updated on {this.props.updatedAt}</Text>}
            </View>
            {this.renderEditButton()}
          </View>
        </CardItem>

        <CardItem cardBody>
          {this.renderCommentSection()}
        </CardItem>
   
        <CardItem>
        {this.renderOpinion()}
        </CardItem>
        <CardItem>
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
    flex: 1,
    justifyContent: 'space-between',
  },
  closeButton: {
    minWidth: 15,
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
    marginTop: 0,
  },
  commentTexttitle: {
  color: '#000000',
  fontWeight: '500',
  fontSize: 14,
  marginTop: 0,
  },
  bullbutton: {
    color: 'white',
    fontWeight: '300',
    fontSize: 14,
    marginLeft: 10,
    marginRight: 10,
  }
});

export {
  AssetCard,
};
