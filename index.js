import React from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Environment,
  VrButton,
  VrHeadModel,
  asset,
  NativeModules
} from 'react-360'
import Entity from 'Entity'
const {AudioModule} = NativeModules
//const Location = NativeModules.Location

export default class TOMORROW_LAND extends React.Component {
  constructor() {
    super()
    this.state = {
      game: {
        name: 'Space Exploration',
        world: '/static_assets/background.png',
        answerObjects: [
          {
            objUrl: 'https://s3.us-east-2.amazonaws.com/tomorrowland/tomorrowlandarcade/yamaha-yzr-r6.obj',
            mtlUrl: 'https://s3.us-east-2.amazonaws.com/tomorrowland/tomorrowlandarcade/yamaha-yzr-r6.mtl',
            translateX: -50,
            translateY: 80,
            translateZ: 300,
            rotateX: 0,
            rotateY: 16,
            rotateZ: 0,
            scale: 1,
            color: 'white'
          },
          {
            objUrl: 'https://s3.us-east-2.amazonaws.com/tomorrowland/tomorrowlandarcade/mp3Station.obj',
            mtlUrl: 'https://s3.us-east-2.amazonaws.com/tomorrowland/tomorrowlandarcade/mp3Station.mtl',
            translateX: -200,
            translateY: 30,
            translateZ: -300,
            rotateX: 600,
            rotateY: 0,
            rotateZ: 600,
            scale: 3,
            color: 'white'
          }
        ],
        wrongObjects: [
          {
            objUrl: 'https://s3.us-east-2.amazonaws.com/tomorrowland/medicoscopia_bottle.obj',
            mtlUrl: 'https://s3.us-east-2.amazonaws.com/tomorrowland/medicoscopia_bottle.mtl',
            translateX: 600,
            translateY: -75,
            translateZ: -100,
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            scale: 14,
            color: 'white'
          }
        ]
      },
      vrObjects: [],
      hide: 'none',
      collectedNum: 0,
      collectedList: [],
      hmMatrix: VrHeadModel.getHeadMatrix()
    }
    this.lastUpdate = Date.now()
  }
  componentDidMount = () => {
    let vrObjects = this.state.game.answerObjects.concat(this.state.game.wrongObjects)
    this.setState({vrObjects: vrObjects})
    Environment.setBackgroundImage(
      {uri: this.state.game.world}
    )
  }
  setModelStyles = (vrObject, index) => {
    return {
            display: this.state.collectedList[index] ? 'none' : 'flex',
            color: vrObject.color,
            transform: [
              {translateX: vrObject.translateX},
              {translateY: vrObject.translateY},
              {translateZ: vrObject.translateZ},
              {scale: vrObject.scale},
              {rotateY: vrObject.rotateY},
              {rotateX: vrObject.rotateX},
              {rotateZ: vrObject.rotateZ}
            ]
          }
  }
  collectItem = vrObject => event => {
    let match = this.state.game.answerObjects.indexOf(vrObject)
    if (match != -1) {
      let updateCollectedList = this.state.collectedList
      let updateCollectedNum = this.state.collectedNum + 1
      updateCollectedList[match] = true
      this.checkGameCompleteStatus(updateCollectedNum)
      AudioModule.playOneShot({
          source: asset('collect.wav'),
      })
      this.setState({collectedList: updateCollectedList, collectedNum: updateCollectedNum})
    } else {
      AudioModule.playOneShot({
        source: asset('wrong.wav'),
      })
    }
  }
  checkGameCompleteStatus = (collectedTotal) => {
    if (collectedTotal == this.state.game.answerObjects.length) {
      AudioModule.playEnvironmental({
        source: asset('success.wav'),
        loop: true
      })
      this.setState({hide: 'flex', hmMatrix: VrHeadModel.getHeadMatrix()})
    }
  }
  setGameCompletedStyle = () => {
    return {
            position: 'absolute',
            display: this.state.hide,
            layoutOrigin: [0.5, 0.5],
            width: 6,
            transform: [{translate: [0, 0, 0]}, {matrix: this.state.hmMatrix}]
          }
  }
  exitGame = () => {
    Location.replace('/')
  }
  rotate = index => event => {
    const now = Date.now()
    const diff = now - this.lastUpdate
    const vrObjects = this.state.vrObjects
    vrObjects[index].rotateY = vrObjects[index].rotateY + diff / 200
    this.lastUpdate = now
    this.setState({vrObjects: vrObjects})
    this.requestID = requestAnimationFrame(this.rotate(index))
  }
  stopRotate = () => {
    if (this.requestID) {
      cancelAnimationFrame(this.requestID)
      this.requestID = null
    }
  }
  render() {
    return (
       <View>
        {this.state.vrObjects.map((vrObject, i) => {
           return (<VrButton onClick={this.collectItem(vrObject)} key={i}>
           <Entity style={this.setModelStyles(vrObject, i)}
                        source={{
                          obj: {uri: vrObject.objUrl},
                          mtl: {uri: vrObject.mtlUrl}
                        }}
                        onEnter={this.rotate(i)}
                        onExit={this.stopRotate}
                      />
                    </VrButton>
                  )
        })}
          <View style={this.setGameCompletedStyle()}>
          <View style={styles.completeMessage}>
            <Text style={styles.congratsText}>CONGRATULATIONS !</Text>
            <Text style={styles.collectedText}>You've Collected All The Objects In {this.state.game.name}</Text>
          </View>
          <VrButton onClick={this.exitGame}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Play Another Game.</Text>
            </View>
          </VrButton>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  completeMessage: {
    margin: 0.1,
    height: 1.5,
    backgroundColor: 'red',
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
    backgroundColor: 'skyblue',
    transform: [ { translate: [0, 0, -5] } ]
  },
  buttonText: {
    fontSize: 0.3,
    textAlign: 'center'
  }
})

AppRegistry.registerComponent('TOMORROW_LAND', () => TOMORROW_LAND)