import React from 'react';
import Tilt from 'react-tilt';
import './logo.css'
import brain from './logo.png'

const logo = () => {
	return (
		<div className='ma4 mt0'>
			<Tilt className="Tilt br2 shadow-2" options={{ max : 55 }} style={{ height: 150, width: 150 }} >
	 			<div className="Tilt-inner pa3">
	 				<img style={{paddingTop: '10px'}} alt='logo' src={brain} height={100} />
	 			</div>
			</Tilt>	
		</div>
	)
}

export default logo;