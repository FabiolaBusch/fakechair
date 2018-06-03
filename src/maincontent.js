import React from 'react'
import ConferenceList from './conferenceList'
import AddMember from './addMember'
import AddPaper from './addPaper'
import ShowPaper from './showPaper'


import CreateConference from './createConference'

class MainContent extends React.Component{
  render() {
    return (
        <main role="main" className="container main-container">

    
          <h1 className="mt-5">Find a Conference</h1>
          <ConferenceList />
          <hr></hr>

          <div className="row">
            <div className="col-sm">
              <h3 className="mt-5">Show Available Paper</h3>
              List here paper for a conference
              <ShowPaper />
              <hr></hr>
            </div>

            <div className="col-sm">
              <h3 className="mt-5">Add Members to Conference</h3>
              <AddMember />
              <hr></hr>
            </div>
          
            <div className="col-sm">
              <h3 className="mt-5">Add a Paper to a Conference</h3>
              <AddPaper />
              <hr></hr>
            </div>
          </div>

          <h1 className="mt-5">Create a new Conference</h1>
          <CreateConference />

        </main>
    );
  }
}

export default MainContent;