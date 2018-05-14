import React from 'react'
//import ConferenceList from './conferenceList'
//import RegisterForm from './registerform'
//mport CreateEventForm from './createeventform'
import IpfsUpload from './ipfsUpload'

// <RegisterForm /> <ConferenceList />

class MainContent extends React.Component{
  render() {
    return (
        <main role="main" className="container main-container">
          <h1 className="mt-5">Register Form</h1>
          
          <h1 className="mt-5">Available Conferences</h1>
          <p className="lead">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod</p>
          <p>Use <a href="#">ut labore et dolore magna aliquyam</a> Duis autem vel eum iriure dolor in hendrerit.</p>
          
          <hr></hr>
          <h1 className="mt-5">Create a new Event</h1>
          <p className="lead">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod</p>
          <p>Use <a href="#">ut labore et dolore magna aliquyam</a> Duis autem vel eum iriure dolor in hendrerit.</p>
          
          <hr></hr>
          <h1 className="mt-5">IPFS Upload</h1>
          <IpfsUpload />

        </main>
    );
  }
}

export default MainContent;