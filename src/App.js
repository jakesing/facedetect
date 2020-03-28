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
    fetch('https://fathomless-beach-13490.herokuapp.com/rank',{
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
    fetch('https://fathomless-beach-13490.herokuapp.com/imageurl', {
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
              fetch('https://fathomless-beach-13490.herokuapp.com/image', {
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
      console.log(this.state)
    }
    this.setState({route: route})
  }




  render(){
    const { isSignedIn, imageURL, route, box } = this.state;
    return (
      <div className="App">
        <h1>TESTING!</h1>
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
              ? <SignIn loadUser = {this.loadUser} onRouteChange = {this.onRouteChange}/>
              : <Register loadUser = {this.loadUser} onRouteChange = {this.onRouteChange}/>
            )
        }
        

      </div>
    );
  }
}

export default App;
