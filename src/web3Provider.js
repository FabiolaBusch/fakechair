import React, { Component } from 'react'


import getWeb3 from './utils/getWeb3'


class Web3Provider extends Component {
	

  constructor(props){
    super(props);
    this.state={
      web3: null
    };


  }

  componentWillMount() {
    
      getWeb3.then(results => {
       
        this.setState({web3: results.web3})

      })
      .catch(() => {
        console.log('Error finding web3.')
      })
  }

  componentDidMount() {
    console.log("web3provider mounted")
    console.log(this.props)
  }

  static defaultProps = {
    web3: this.state.web3
  }

	render(){
    return(
      <div>
        {this.props.children}
      </div>

      );
	}	
}


export default Web3Provider;
