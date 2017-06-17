import Expo, { Components, Location, Permissions } from 'expo';
import React, { Component } from 'react';
import { ListView, TextInput, TouchableHighlight, TouchableOpacity, StyleSheet, Text, View, Dimensions, Linking } from 'react-native';
import KeyboardEventListener from './util/KeyboardEventListener';
import InvertibleScrollView from 'react-native-invertible-scroll-view';

const io = require('socket.io-client');
const url = 'https://expo-chat-example.herokuapp.com/';
const SleekLoadingIndicator = require('react-native-sleek-loading-indicator');
var {height, width} = Dimensions.get('window');
var component = this;

const styles = StyleSheet.create({
   input: {
      borderWidth: 1,
      borderColor: '#D7D7D7',
      height: 50,
      marginLeft: 10,
      marginRight: 10,
      padding: 15,
      borderRadius: 3,
   },
   button: {
      height: 45,
      alignSelf: 'stretch',
      backgroundColor: '#05A5D1',
      marginTop: 10,
      marginLeft: 10,
      marginRight: 10,
      alignItems: 'center',
      justifyContent: 'center',
   },
   locationButton: {
      height: 45,
      alignSelf: 'stretch',
      backgroundColor: '#00A742',
      marginTop: 10,
      marginLeft: 10,
      marginRight: 10,
      marginBottom: 10,
      alignItems: 'center',
      justifyContent: 'center',
   },
   chatBox: {
      height: 25,
      alignSelf: 'stretch',
      marginTop: 10,
      marginLeft: 10,
      marginRight: 10,
      marginBottom: 10,
      justifyContent: 'center',
      backgroundColor: '#F6F6F6',
   },
   buttonText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FAFAFA',
   },
   chatText: {
     fontSize: 14,
     fontWeight: '400',
   },
   nameText: {
     fontSize: 14,
     fontWeight: '500',
   },
   map: {
     width: width,
     height: height - 67,
   },
});

class App extends React.Component {
  constructor() {
    super();
    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    var initialMessages = [ { text: 'Connecting...',
                              location: null, }];
    const socket = io(url, {
      transports: ['websocket'],
    });
    socket.emit('name', ' ');
    this.state = {
      isConnected: false,
      message: ' ',
      messageList: initialMessages,
      dataSource: ds.cloneWithRows(initialMessages),
      location: null,
      lastLocation: null,
      inMapView: false,
      latitude: 35.4478014,
      longitude: -120.1680304,
      nickname: null,
      loading: false,
      buttonStyle: {
         height: 45,
         alignSelf: 'stretch',
         backgroundColor: '#E1E1E1',
         marginTop: 10,
         marginLeft: 10,
         marginRight: 10,
         alignItems: 'center',
         justifyContent: 'center',
      },
      containerStyle: {
         flex: 1,
         justifyContent: 'flex-end',
         paddingTop: 24,
         marginLeft: 10,
         backgroundColor: '#F7F7F7',
         paddingBottom: 10,
      },
    }
  }

  componentDidMount() {
    KeyboardEventListener.subscribe(({keyboardHeight}) => {
      this.setState({
        containerStyle: {
           flex: 1,
           justifyContent: 'flex-end',
           paddingTop: 24,
           marginLeft: 10,
           backgroundColor: '#F7F7F7',
           paddingBottom: 10 + keyboardHeight,
        },
      });
    })

    const socket = io(url, {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      this.setState({
        isConnected: true,
        buttonStyle: {
          height: 45,
          alignSelf: 'stretch',
          backgroundColor: '#05A5D1',
          marginTop: 10,
          marginLeft: 10,
          marginRight: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }
      });
    });

    socket.on('location', location => {
      socket.emit('location message', this.state.nickname, ' just shared their location!', location);
    });

    socket.on('message list', list => {
      this.setState({
        messageList: list,
        dataSource: this.state.dataSource.cloneWithRows(list),
        loading: false,
      })
    });

    socket.on('name', name => {
      if (this.state.nickname == null) {
        this.setState({
          nickname: name,
        });
        socket.emit('chat message', this.state.nickname, ' has connected.');
      }
    });
  }

  onChange(text) {
    this.setState({
        message: text
    });
  }

  onAddPressed() {
    this.refs['chatInput'].clear();

    const socket = io(url, {
      transports: ['websocket'],
    });
    socket.emit('chat message', this.state.nickname, ': ' + this.state.message);
    this.setState({
      message: '',
      loading: true,
    });
    this.listView.scrollTo({ y: 0 });
  }

  onSharePressed() {
    this.setState({
      loading: true,
    });
    this._getLocationAsync();
  }

  onMapPressed() {
    this.setState({
      lastLocation: null,
      inMapView: false,
    });
  }

  nameStyle = function(nick) {
   if (nick == this.state.nickname) {
     return {
       fontSize: 14,
       fontWeight: '500',
       color: '#5676D9',
     }
   } else {
     return {
      fontSize: 14,
      fontWeight: '500',
     }
   }
 }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });

    const socket = io(url, {
      transports: ['websocket'],
    });

    socket.emit('location message', this.state.nickname, ' just shared their location!', location);
  };

  _handlePressButtonAsync = async () => {
    this.setState({ inMapView: true });
  };

  renderRowView(rowData) {
    if (rowData.location == null) {
      return (
        <TouchableHighlight style={styles.chatBox} >
        <Text>
          <Text style={this.nameStyle(rowData.name)}>
            {rowData.name}
          </Text>
          <Text style={styles.chatText}>
            {rowData.text}
          </Text>
        </Text>
        </TouchableHighlight>
      );
    } else {
      return (
        <TouchableHighlight
          style={styles.locationButton}
          // the line below this
          onPress={() => {
            this.setState({
              longitude: rowData.location.coords.longitude,
              latitude: rowData.location.coords.latitude,
              inMapView: true,
            });
            /*Linking.canOpenURL('http://google.com').then(supported => {
            if (!supported) {
              console.log('Cant handle url: ' + url);
            } else {
              return Linking.openURL('https://www.google.com/maps/search/' + this.state.latitude + ',' + this.state.longitude);
            }
          }).catch(err => console.error('An error occurred', err));*/
            //this._handlePressButtonAsync.bind(this);
          }}
        >
          <Text style={styles.buttonText}>
            {rowData.name + rowData.text}
          </Text>
        </TouchableHighlight>
      );
    }
  }

  render() {
    if (this.state.loading && !this.state.inMapView) {
      return (
        <View style={this.state.containerStyle}>
          <ListView
            ref={ref => this.listView = ref}
            onContentSizeChange={() => {
            this.listView.scrollTo({y: 0})
            }}
            renderScrollComponent={props => <InvertibleScrollView {...props} inverted />}
            dataSource = {this.state.dataSource}
            renderRow = {this.renderRowView.bind(this)}
          />
          <TextInput
            ref={'chatInput'}
            style={styles.input}
            onChangeText={this.onChange.bind(this)}
          />
            <TouchableHighlight
              onPress={this.onAddPressed.bind(this)}
              style={this.state.buttonStyle}
            >
              <Text style={styles.buttonText}>
                Send Message
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={this.onSharePressed.bind(this)}
              style={this.state.buttonStyle}
            >
              <Text style={styles.buttonText}>
                Share Location
              </Text>
            </TouchableHighlight>
            <SleekLoadingIndicator loading={this.state.loading} text={'Sending...'}/>
        </View>
      );
    } else if (!this.state.inMapView) {
    //if (this.state.inMapView != true) {
      return (
        <View style={this.state.containerStyle}>
          <ListView
            ref={ref => this.listView = ref}
            onContentSizeChange={() => {
            this.listView.scrollTo({y: 0})
            }}
            renderScrollComponent={props => <InvertibleScrollView {...props} inverted />}
            dataSource = {this.state.dataSource}
            renderRow = {this.renderRowView.bind(this)}
          />
          <TextInput
            ref={'chatInput'}
            style={styles.input}
            onChangeText={this.onChange.bind(this)}
          />
            <TouchableHighlight
              onPress={this.onAddPressed.bind(this)}
              style={this.state.buttonStyle}
            >
              <Text style={styles.buttonText}>
                Send Message
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={this.onSharePressed.bind(this)}
              style={this.state.buttonStyle}
            >
              <Text style={styles.buttonText}>
                Share Location
              </Text>
            </TouchableHighlight>
        </View>
      );
    } else {
      return (
        <View>
          <Components.MapView
            style={styles.map}
            region={{
              latitude: this.state.latitude,
              longitude: this.state.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
          <Components.MapView.Marker
            coordinate={{
              latitude: this.state.latitude,
              longitude: this.state.longitude,
            }}
          />
          </Components.MapView>
          <TouchableOpacity style={styles.button} onPress={this.onMapPressed.bind(this)}>
            <Text style={styles.buttonText}> Back to Chatroom </Text>
          </TouchableOpacity>
        </View>
      );
    }
  }
}

Expo.registerRootComponent(App);
