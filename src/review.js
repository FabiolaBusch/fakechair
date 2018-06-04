import React from 'react'

class Review extends React.Component{


	render(){

		return(

      <li><a target="_blank" href={ 'http://localhost:8080/ipfs/' + this.props.hash }>Review {this.props.number}: Score: {this.props.score} </a></li>
		);
	}
}

export default Review