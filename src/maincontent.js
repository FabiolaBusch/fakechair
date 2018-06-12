import React from 'react'
import ConferenceList from './conferenceList'
import AddMember from './addMember'
import AddPaper from './addPaper'
import ShowPaper from './showPaper'
import CreateReview from "./createReview"



import CreateConference from './createConference'

class MainContent extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      roleConfMapping: null,
      confPaperMapping:null
    }
  }

  getRolesForConferences = (conf,role) => {
    let pair = {[conf]: role}
    let newMapping = {...this.state.roleConfMapping,...pair}
    this.setState({roleConfMapping: newMapping});
    console.log(this.state.roleConfMapping)
  }

  getConferenceForPapers = (paper,conf) => {
    let pair = {[paper]: conf}
    let newMapping = {...this.state.confPaperMapping,...pair}
    this.setState({confPaperMapping: newMapping});
    console.log(this.state.confPaperMapping)
  }



  render() {
    return (
        <main role="main" className="container main-container">

        
          <h1 className="mt-5">Available Conferences</h1>
          <ConferenceList getRolesForConferences={this.getRolesForConferences}/>
          <hr></hr>

          <div className="row">

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

          <h2 className="mt-5">Show Available Paper</h2>
          List here paper for a conference
          <ShowPaper getConferenceForPapers={this.getConferenceForPapers}/>
          <hr></hr>

          <h2 className="mt-5">Write a Review</h2>
          <CreateReview roleConfMapping={this.state.roleConfMapping} confPaperMapping={this.state.confPaperMapping}/>
          <hr></hr>
          
          <h2 className="mt-5">Create a Conference</h2>
          <CreateConference />
          
        
        </main>
    );
  }
}

export default MainContent;