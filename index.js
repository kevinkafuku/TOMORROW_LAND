import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Environment
} from 'react-360';

export default class TOMORROW_LAND extends React.Component {
  constructor() {
    super()
    this.state = {
      game: {
        name: 'Space Exploration',
        world: 'https://s3.amazonaws.com/mernbook/vrGame/milkyway.jpg',
        answerObjects: [
          {
            objUrl: 'https://s3.amazonaws.com/mernbook/vrGame/planet.obj',
            mtlUrl: 'https://s3.amazonaws.com/mernbook/vrGame/planet.mtl',
            translateX: -50,
            translateY: 0,
            translateZ: 30,
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            scale: 7,
            color: 'white'
          }
        ],
        wrongObjects: [
          {
            objUrl: 'https://s3.amazonaws.com/mernbook/vrGame/tardis.obj',
            mtlUrl: 'https://s3.amazonaws.com/mernbook/vrGame/tardis.mtl',
            translateX: 0,
            translateY: 0,
            translateZ: 90,
            rotateX: 0,
            rotateY: 20,
            rotateZ: 0,
            scale: 1,
            color: 'white'
          }
        ]
      }
    }
  }
  componentDidMount = () => {
    let vrObjects = this.state.game.answerObjects.concat(this.state.game.wrongObjects)
    this.setState({vrObjects: vrObjects})
    Environment.setBackgroundImage(
      {uri: this.state.game.world}
    )
  }
  render() {
    return (
      <View style={styles.panel}>
        <View style={styles.greetingBox}>
          <Text style={styles.greeting}>
            Welcome to Tomorrow Land
          </Text>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  completeMessage: {
    margin: 0.1,
    height: 1.5,
    backgroundColor: 'green',
    transform: [ {translate: [0, 0, -5] } ]
  },
  congratsText: {
    fontSize: 0.5,
    textAlign: 'center',
    marginTop: 0.2
  },
  collectedText: {
    fontSize: 0.2,
    textAlign: 'center'
  },
  button: {
    margin: 0.1,
    height: 0.5,
    backgroundColor: 'blue',
    transform: [ { translate: [0, 0, -5] } ]
  },
  buttonText: {
    fontSize: 0.3,
    textAlign: 'center'
  }
})

AppRegistry.registerComponent('TOMORROW_LAND', () => TOMORROW_LAND);
