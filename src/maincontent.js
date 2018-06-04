import React from 'react'
import ConferenceList from './conferenceList'
import AddMember from './addMember'
import AddPaper from './addPaper'
import ShowPaper from './showPaper'
import CreateReview from "./createReview"



import CreateConference from './createConference'

class MainContent extends React.Component{



  render() {
    return (
        <main role="main" className="container main-container">

        
          <h1 className="mt-5">Available Conferences</h1>
          <ConferenceList />
          <hr></hr>

          <div className="row">

            <div className="col-sm">
              <h3 className="mt-5">Add Members to Conference</h3>
              <AddMember />
              <hr></hr>
            </div>
          
            <div className="col-sm">
              <h3 className="mt-5">Add a Paper to a Conference</h3>
              <AddPaper/>
              <hr></hr>
            </div>
          </div>

          <h2 className="mt-5">Show Available Paper</h2>
          List here paper for a conference
          <ShowPaper />
          <hr></hr>

          <h2 className="mt-5">Write a Review</h2>
          <CreateReview />
          <hr></hr>
          
          <h2 className="mt-5">Create a Conference</h2>
          <CreateConference />
          
        
        </main>
    );
  }
}

export default MainContent;