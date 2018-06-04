import React, { Component } from 'react'


import NavBar from './navbar'
import MainContent from './maincontent'
import Footer from './footer'

//import './css/oswald.css'
//import './css/open-sans.css'
//import './css/pure-min.css'
import './App.css'

class App extends Component {

	render(){
		return(
			<div className="component-app">

			<NavBar />
			<MainContent/>
			<Footer />

			</div>
		);
	}	
}

export default App;
