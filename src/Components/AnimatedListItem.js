import React from 'react';
import { Animated } from 'react-native';

class AnimatedListItem extends React.Component {
  constructor(...props) {
    super(...props);
    this.state = {
      height: new Animated.Value(0),
      opacity: new Animated.Value(0)
    };
  }

  componentDidMount() {
    Animated.sequence([
      Animated.timing(
        this.state.height,
        {
          toValue: this.props.height,
          duration: this.props.duration || 1000
        }
      ),
      Animated.timing(
        this.state.opacity,
        {
          toValue: 1,
          duration: this.props.duration || 1000
        }
      )
    ]).start();
  }

  render() {
    const { height, opacity } = this.state;
    return (
      <Animated.View
        style={{
          ...this.props.style,
          height: height,
          opacity: opacity
        }}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}

export default AnimatedListItem;
