import React from 'react';

/*
The form component is being rendered by the signin or register components. 
Signin and register tell the form which fields to render.
Most of the styles are defined in those other components. 
*/

function Form(props)  {
		return (
			<article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
				<main className="pa4 black-80">
				  <div className="measure">

				  {/*This section defines the form fields that should appear--it dynamically defines them based on whatever component is rendering the form.*/}

				    <fieldset id={props.formID} className="ba b--transparent ph0 mh0">
				      <legend className="f1 fw6 ph0 mh0">{props.formTitle}</legend>
				      { props.errorMessage }
				      {	props.fields.map((field) => {
				      	return (
					      <div className="mt3 text-left">
					        <label className="db fw6 lh-copy f6" htmlFor="email-address">{field.title}</label>
					        <input
					        	className={field.classname}
					        	type={field.type}
					        	name={field.name}
					        	id={field.id}
					        	onChange={field.onChange}
					        	 />
					      </div>		      		
				      		)
				      	})
					  }
				    </fieldset>

				    {/*These next two divs define the buttons that appear below the form (e.g. Sign In and 'alt button')*/}

				    <div className="">
				      <input 
				      	onClick = {props.submitButton.onclick}
				      	className = {props.submitButton.className} 
				      	type = {props.submitButton.type}
				      	value = {props.submitButton.value}
				      	/>
				    </div>
				    <div className="lh-copy mt3">
				      <p 
				      	onClick = {props.altButton.onclick} 
				      	className = {props.altButton.classname}>
				      	{props.altButton.text}
			      	</p>
				    </div>
				  </div>
				</main>
			</article>	
		)
};

export default Form;
