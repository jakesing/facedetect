import React, { Component } from 'react';
import './App.css';
import Navigation from './components/navigation/navigation'
import Rank from './components/rank/rank'
import Logo from './components/logo/logo'
import ImageLinkForm from './components/imagelinkform/imagelinkform'
import SignIn from './components/signin/signin'
import Register from './components/register/register'
import FaceRecognition from './components/facerecognition/facerecognition'
import Particles from 'react-particles-js';

//defines the product server destination for use throughout the app--it is hosted on Heroku. 
const prodServer = 'https://thawing-spire-16932.herokuapp.com'

/*
  particles is a visual effect on the site, which adds moving background. 
  these configurations are a random example. 
  see more configurations here: https://particles.matteobruni.it/ 
*/

const particlesOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 500
      }
    },
    collisions: {
      enable: true,
    }
  }
}

/*
  sets the initial state of the application.
  - Input changes on every keystroke
  - imageURL gets stored upon submit
  - box calculates the box for purposes of face detection
  - route determines the specific experience to render. The initial state is 'signin', which shows the sign in page.
  - isSignedIn is a check field to see if user is authenticated. Defaults to no. 
  - user is the current user - defaults to null.
*/

const initialState = {
    input: '',
    imageURL: '',
    box: {},
    route: 'signin',
    isSignedIn: false,
    user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: '',
        rank: null
      }
}

//the full app logic

class App extends Component {
  //constructor is called for every component before it is mounted. 
  //sub components will get super(props)
  constructor(){
    super();
    this.state = initialState;
  }

  //defines a function that can be called to load user details into the state of the app. 
  //this isn't very sophisticated, it just says 'set the state to equal all these properties for a given user'.
  //the last step is to call a function (defined below) to get the rank of the user.
  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
    this.getRank();
  }

  //takes the results of the face detection API call and computes the boundaries of the box. 
  calculateFaceLocation = (data) => {
    //this is defined in facerecognition.js
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: data.left_col * width,
      topRow: data.top_row * height,
      rightCol: width - (data.right_col * width),
      bottomRow: height - (data.bottom_row * height),
    }
  }

  //sets the box in the app state
  displayFaceBox = (box) => {
    this.setState({
      box: box,
    })
  }

  //updates 'input' in state when keys are pressed in the text bar.
  onInputChange = (event) => {
    this.setState({
      input: event.target.value
    });
  }

  //gets the user's rank from the database.
  getRank = () => {
    //check the rank endpoint for the logic used
    fetch(`${prodServer}/rank`,{
      method: 'put',
      headers: {
            'Content-Type': 'application/json'
          },
      body: JSON.stringify({
        id: this.state.user.id
      })
    }).then(response => response.json()) //parses the response to JSON
      .then(rank => { //assigns the resulting rank to the app state's users data.
        this.setState(Object.assign(this.state.user, {rank: rank}))
      })
      .catch(err => console.log(err))
  }

  //the logic for calling the facedetect API
  onPictureSubmit = () => {
    this.setState({imageURL: this.state.input})
    //https://samples.clarifai.com/face-det.jpg
    fetch(`${prodServer}/imageURL`, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            input: this.state.input
          })
        })
          .then(response => response.json())
          .then(response => {
            if (response) {
              fetch(`${prodServer}/image`, {
                method: 'put',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  id: this.state.user.id
                })
              })
                .then(response => response.json())
                .then(entries => {
                  this.setState(Object.assign(this.state.user, {entries: entries}))
                })
                .catch(console.log);
            }
            this.displayFaceBox(this.calculateFaceLocation(response.outputs[0].data.regions[0].region_info.bounding_box))
          })
          .catch(err => console.log(err))

          this.getRank();
        }
        
  //some basic routing logic
  onRouteChange = (route) => {
    if(route==='signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
      console.log(this.state)
    }
    this.setState({route: route})
  }



  //rendering logic
  render(){
    const { isSignedIn, imageURL, route, box } = this.state;
    return (

      <div className="App">
        <h1 className="font-sans text-lg text-gray-800 text-center"> hey poop!</h1>
        <Particles  className='particles'
                    params={particlesOptions}
          />
        <Navigation isSignedIn = {isSignedIn} onRouteChange = {this.onRouteChange}/>
        { route === 'home' 
          ? <div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries} rank={this.state.user.rank} />
              <ImageLinkForm onInputChange={this.onInputChange} onPictureSubmit={this.onPictureSubmit}/>
              <FaceRecognition imageURL = {imageURL} box={box}/>
            </div>
          : ( 
              route === 'signin' || route === 'signout'
              ? <SignIn loadUser = {this.loadUser} onRouteChange = {this.onRouteChange} server = {prodServer}/>
              : <Register loadUser = {this.loadUser} onRouteChange = {this.onRouteChange} server = {prodServer} />
            )
        }
        

      </div>
    );
  }
}

export default App;
