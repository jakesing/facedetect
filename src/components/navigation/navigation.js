import React from 'react';
import { NavLink } from 'react-router-dom';

const Navigation = ({ onRouteChange, isSignedIn }) => {
	if(isSignedIn) {
		return (
			<nav style={{display: 'flex', justifyContent: 'flex-end'}}>
				<p 
					onClick = {() => onRouteChange('signout')}
					className='f3 link dim black underline pa3 pointer'
				>
					<NavLink to='/'>
						Sign Out
					</NavLink>
				</p>
			</nav>
			);
	} else {
		return (
			<nav style={{display: 'flex', justifyContent: 'flex-end'}}>
				<p 
					onClick = {() => onRouteChange('signin')}
					className='f3 link dim black underline pa3 pointer'
				>	
					<NavLink to="/signin">
						Sign In
					</NavLink>
				</p>
				<p 
					onClick = {() => onRouteChange('register')}
					className='f3 link dim black underline pa3 pointer'
				>
					<NavLink to='/register'>
						Register
					</NavLink>
				</p>
			</nav>
			)
	}

}

export default Navigation;