import React, { Component } from 'react';
import {Animated, Dimensions} from 'react-native';

const deviceScreen = Dimensions.get('window');

const SwipeableComponent = El => class extends Component {
  constructor(props) {
    super(props);
		this.state = {
			offset: new Animated.ValueXY(),
      rotate: new Animated.Value(0),
    };

    this.onSwipe = this.onSwipe.bind(this);
  }

  onSwipe(callback) {
		Animated.timing(this.state.offset, {
      duration: 350,
      toValue: {x: 800, y: -800},
    }).start(callback);
  }

  getStyles() {
		let {offset} = this.state;
    let rotate = offset.x.interpolate({inputRange: [-700, 0, 700], outputRange: ['-10deg', '0deg', '1080deg']});

		return {
      transform: [
        {translateX: offset.x},
        {translateY: offset.y},
        {rotate},
      ],
    };
  }

  render() {
    return (
      <Animated.View style={this.getStyles()}>
        <El {...this.props} onSwipe={this.onSwipe} />
      </Animated.View>
    );
  }
}

export {
  SwipeableComponent,
};
