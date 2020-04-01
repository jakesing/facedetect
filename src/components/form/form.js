import React from 'react';
import { NavLink } from 'react-router-dom';

function Form(props)  {
		return (
		<article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
			<main className="pa4 black-80">
			  <div className="measure">
			    <fieldset id={props.formID} className="ba b--transparent ph0 mh0">
			      <legend className="f1 fw6 ph0 mh0">{props.formTitle}</legend>
			      { props.errorMessage }
			      {	props.fields.map((field) => {
			      	return (
				      <div className="mt3">
				        <label key={field.id} className="db fw6 lh-copy f6" htmlFor="email-address">{field.title}</label>
				        <input
				        	className={field.classname}
				        	type={field.type}
				        	name={field.name}
				        	id={field.id}
				        	onChange={field.onChange}
				        	key={field}
				        	 />
				      </div>		      		
			      		)
			      	})
				  }
			    </fieldset>
			    <div className="">
			    	<NavLink to={props.submitButton.route}> 
			      		<input 
					      	onClick={props.submitButton.onclick}
					      	className={props.submitButton.className} 
					      	type={props.submitButton.type}
					      	value={props.submitButton.value}
				      	/>
			      	</NavLink>
			    </div>
			    <div className="lh-copy mt3">
			      <p 
			      	
			      		onClick = {props.altButton.onclick} 
			      		className={props.altButton.classname}
	      			>
	      				<NavLink to={props.NavLink}>
			      			{props.altButton.text}
		      			</NavLink>
		      		</p>
			    </div>
			  </div>
			</main>
		</article>
		)
};

export default Form;
