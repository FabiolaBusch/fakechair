import React from 'react'
import ConferenceList from './conferenceList'
import AddMember from './addMember'
import AddPaper from './addPaper'

import CreateConference from './createConference'

class MainContent extends React.Component{
  render() {
    return (
        <main role="main" className="container main-container">
          
          <h1 className="mt-5">Find a Conference</h1>
          <ConferenceList />
          <hr></hr>

          <h1 className="mt-5">Add Members to Conference</h1>
          <AddMember />
          <hr></hr>

          <h1 className="mt-5">Add a Paper to a Conference</h1>
          <AddPaper />
          <hr></hr>

          <h1 className="mt-5">Create a new Conference</h1>
          <CreateConference />

        </main>
    );
  }
}

export default MainContent;