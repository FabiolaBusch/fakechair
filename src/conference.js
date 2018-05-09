import React from 'react'

class Conference extends React.Component{
	

	constructor(props){
		super(props)

		this.state=
			{			
			id: 0,
			title: 'ExampleConf0',
			creator: 'ExapleChair1',
			shortDescr: 'Short Description 1'
		}
	}

	componentDidMount() {
		this.setState(this.props.data)
	}

	render(){
		return(
			<div className="card" >
			  <img className="card-img-top" src="" alt="Card"></img>
			  <div className="card-body">
			    <h5 className="card-title">{this.state.title}</h5>
			    <p className="card-text">{this.state.shortDescr}</p>
			    <button href="#" className="btn btn-outline-secondary" onClick={() => this.props.onClick()}>{this.props.value}</button>
			    <br></br>
			  </div>
			</div>
		);
	}
}


export default Conference