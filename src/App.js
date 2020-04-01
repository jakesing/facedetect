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
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
  Redirect
} from 'react-router-dom';

const prodServer = 'https://thawing-spire-16932.herokuapp.com'

const particlesOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 500
      }
    }
  }
}


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

function Home(props) {
  return (
    <div>
      <Logo />
      <Rank name={props.user.name} entries={props.user.entries} rank={props.user.rank} />
      <ImageLinkForm onInputChange={props.onInputChange} onPictureSubmit={props.onPictureSubmit}/>
      <FaceRecognition imageURL = {props.imageURL} box={props.box}/>
    </div>
  ) 
}

class App extends Component {
  constructor(){
    super();
    this.state = initialState;
  }

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

  //https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2134&q=80  
  calculateFaceLocation = (data) => {
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

  displayFaceBox = (box) => {
    this.setState({
      box: box,
    })
  }

  onInputChange = (event) => {
    this.setState({
      input: event.target.value
    });
  }

  getRank = () => {
    fetch(`${prodServer}/rank`,{
      method: 'put',
      headers: {
            'Content-Type': 'application/json'
          },
      body: JSON.stringify({
        id: this.state.user.id
      })
    }).then(response => response.json())
      .then(rank => {
        this.setState(Object.assign(this.state.user, {rank: rank}))
      })
      .catch(err => console.log(err))
  }


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

  onRouteChange = (route) => {
    if(route==='signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})

    }
    this.setState({route: route})
  }

  render(){
    const { isSignedIn, imageURL, route, box, user } = this.state;
    return (
      <div className="App">
        <Particles  className='particles'
                    params={particlesOptions}/>
        <Navigation isSignedIn = {isSignedIn} onRouteChange = {this.onRouteChange}/>

        <Switch>
          <Route exact path="/register"><Register loadUser = {this.loadUser} onRouteChange = {this.onRouteChange} server = {prodServer}/></Route>
          <Route exact path="/signin"><SignIn loadUser = {this.loadUser} onRouteChange = {this.onRouteChange} server = {prodServer}/></Route>
          <Route exact path="/"><SignIn loadUser = {this.loadUser} onRouteChange = {this.onRouteChange} server = {prodServer}/></Route>
          <Route exact path="/home"><Home user={user} imageURL={imageURL} box={box} onInputChange={this.onInputChange} onPictureSubmit={this.onPictureSubmit}/></Route>
        </Switch>

{/*        { route === 'home' 
          ? <Home user={user} imageURL={imageURL} box={box} onInputChange={this.onInputChange} onPictureSubmit={this.onPictureSubmit}/>
          : ( 
              route === 'signin' || route === 'signout'
              ? <SignIn loadUser = {this.loadUser} onRouteChange = {this.onRouteChange} server = {prodServer}/>
              : <Register loadUser = {this.loadUser} onRouteChange = {this.onRouteChange} server = {prodServer}/>
            )
        }
*/}        

      </div>
    );
  }
}

export default App;
