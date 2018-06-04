import React from 'react'

class Conference extends React.Component{

    render(){
      return(
      	<div className="card border-secondary mb-3 bg-transparent">
		  <h5 className="card-header">{this.props.title}</h5>
		  <div className="card-body">
		    <h5 className="card-title">{this.props.year}</h5>
		    <p className="card-text">Contract Address: {this.props.address}</p>
		    <a target="_blank" href={ 'http://localhost:8080/ipfs/' + this.props.hash } className="card-link">See Details</a>
		  </div>
		</div>
       );
    }

}

export default Conference;