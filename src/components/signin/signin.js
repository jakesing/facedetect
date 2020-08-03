import React from 'react';
import Form from '../form/form'
import Axios from 'axios';
import Cheerio from 'cheerio'

class SignIn extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			signInEmail: '',
			signInPassword: '',
			signInError: false
		}
	}
	
	onEmailChange = (event) => {
		this.setState({signInEmail: event.target.value})
	}

	onPasswordChange = (event) => {
		this.setState({signInPassword: event.target.value})
	}

	displayErrorMessage = () => {
		return this.state.signInError
		? (
			this.state.signInEmail === '' 
			? <h2 className="f3 fw6 ph0 mh0">Log-in Error</h2> 
			: '' 
			)
		: ''
	}

	onSubmitSignIn = () => {
		fetch('https://fathomless-beach-13490.herokuapp.com/signin', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: this.state.signInEmail,
				password: this.state.signInPassword
			})
		})
			.then(response => response.json())
			.then(user => {
				if(user.id){
					this.props.loadUser(user);
					this.props.onRouteChange('home');
				} else {
					this.setState({signInError: true})
				}
			}).catch(err => console.log(err))
	}

	render() {
		const { onRouteChange } = this.props;	
		let formFields = [
		    {
		      title: 'Email: ', 
		      classname: 'pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100', 
		      type: 'email', 
		      name: 'email', 
		      id: 'email',
		      onChange: this.onEmailChange
		    },
		    {
		      title: 'Password: ', 
		      classname: 'pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100', 
		      type: 'password', 
		      name: 'password', 
		      id: 'password',
		      onChange: this.onPasswordChange
		    }
		  ]

		let submitButton = {
			    className: "b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib",
			    type: "submit",
			    value: "Sign in",
			    onclick: this.onSubmitSignIn
	  		};

	  	let reRouteButton = {
	  		onclick: () => onRouteChange('register'),
	  		classname: "f6 link dim black db pointer",
	  		text: 'New User? Register Instead'
	  	}

		return (
			<Form 
				formTitle = 'Sign In' 
				formID = 'sign_in'
				fields = {formFields} 
				submitButton = {submitButton} 
				errorMessage = {this.displayErrorMessage()}
				altButton = {reRouteButton}/>
		);
	}
}

export default SignIn
