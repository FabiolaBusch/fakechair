import React from 'react'
import ConferenceList2 from './conferenceList2'
//import RegisterForm from './registerform'
//import CreateEventForm from './createEventForm'
import EventSchemaInput from './eventSchemaInput'
// <RegisterForm /> <CreateEventForm /> <ConferenceList /> <RegisterForm />

class MainContent extends React.Component{
  render() {
    return (
        <main role="main" className="container main-container">
          <h1 className="mt-5">Register Form</h1>
          
          <h1 className="mt-5">Last Created Conferences</h1>
          <ConferenceList2 />
          <hr></hr>
          <h1 className="mt-5">Create a new Event</h1>
          <p className="lead">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod</p>
          <p>Use <a href="#">ut labore et dolore magna aliquyam</a> Duis autem vel eum iriure dolor in hendrerit.</p>
          <EventSchemaInput />

        </main>
    );
  }
}

export default MainContent;