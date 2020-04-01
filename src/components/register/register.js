import React from 'react';
import Form from '../form/form'
import EmailValidator from 'email-validator'

class Register extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			email: '',
			password: '',
			name: '',
			regAttempted: false,
			validName: false,
			validEmail: false,
			validPassword: false
		}
	}

	passwordValidator = () => {
		return this.state.password.length > 8
	}

	onEmailChange = (event) => {
		this.setState({	
				email: event.target.value, 
				validEmail: EmailValidator.validate(this.state.email)
				})	
	}

	onPasswordChange = (event) => {
		this.setState({
				password: event.target.value,
				validPassword: this.passwordValidator(this.state.password)
			})
	}

	onNameChange = (event) => {
		this.setState({
				name: event.target.value, 
				validName: this.state.name !== ''
			})
	}

	displayErrorMessage = () => {
		//placeholder for 'invalid creds' error
		if(this.state.regAttempted){
			if(!this.state.validName){
				return <h2 className="f3 fw6 ph0 mh0">Please enter a name</h2>
			} else if (!this.state.validEmail) {
				return <h2 className="f3 fw6 ph0 mh0">Invalid Email</h2>
			} else {
				return <h2 className="f3 fw6 ph0 mh0">Password must be longer than 8 characters</h2>
			}
		}
	}

	onSubmitRegister = () => {
		if(this.state.validName && this.state.validEmail && this.state.validPassword){
			fetch(`${this.props.server}/register`, {
				method: 'post',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: this.state.name,
					email: this.state.email,
					password: this.state.password
				})
			})
				.then(response => response.json())
				.then(user => {
					//need to check for user id - not just user
					if(user.id){
						this.props.loadUser(user)
						this.props.onRouteChange('home');
					} 
				})
			} else {
				this.setState({	
					regAttempted: true,
				})
				console.log('something is not valid')
			}
	}	

	render() {
		const { onRouteChange } = this.props;	
		let formFields = [
		    {
		      title: 'Name: ', 
		      classname: 'pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100', 
		      type: 'text', 
		      name: 'name', 
		      id: 'name',
		      onChange: this.onNameChange
		    },		    {
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
			    value: "Sign Up",
			    route: '/home', /*NEED TO UPDATE THIS*/
			    onclick: this.onSubmitRegister
	  		};

	  	let reRouteButton = {
	  		onclick: () => onRouteChange('signin'),
	  		classname: "f6 link dim black db pointer",
	  		text: 'Existing User? Sign in instead'
	  	}

		return (
			<Form 
				formTitle = 'Register' 
				formID = 'sign_up'
				fields = {formFields} 
				submitButton = {submitButton} 
				errorMessage = {this.displayErrorMessage()}
				altButton = {reRouteButton}
				NavLink = '/signin'
			/>
		);
	}
}

export default Register

