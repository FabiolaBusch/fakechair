import React from 'react'

class Conference extends React.Component{



	getBorder(){
		let border = 'border-secondary'

		if(this.props.role === 'admin'){
			border = 'border-danger'
		}else if(this.props.role === 'pcmember'){
			border = 'border-success'
		}else if(this.props.role === 'author'){
			border = 'border-info'

		}

		return border;
	}

    render(){
      return(
      	<div className={"card mb-3 bg-transparent " + this.getBorder()}  >
		  <h5 className="card-header">{this.props.title}</h5>
		  <div className="card-body">
		    <h5 className="card-title">{this.props.year}</h5>
		    <p className="card-text">Contract Address: {this.props.address}</p>
		    <p className="card-text">Your Role: {this.props.role}</p>

		    <a target="_blank" href={ 'http://localhost:8080/ipfs/' + this.props.hash } className="card-link">See Details</a>
		  </div>
		</div>
       );
    }

}

export default Conference;