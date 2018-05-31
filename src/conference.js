import React from 'react'

import Table from 'react-bootstrap/lib/Table';



class Conference extends React.Component{

    render(){
      return(<Table bordered responsive>
          <thead>
            <tr>
              <th>Type</th>
              <th>Value</th>
            </tr>
          </thead>
         
          <tbody>
            <tr>
              <td>Title</td>
              <td>{this.props.title}</td>
            </tr>
            <tr>
              <td>Year</td>
              <td>{this.props.year}</td>
            </tr>

            <tr>
              <td>IPFS Hash</td>
              <td>{this.props.hash}</td>
            </tr>

            <tr>
              <td>Contract Address</td>
              <td>{this.props.address}</td>
            </tr>
          </tbody>
       </Table>
       );
    }

}

export default Conference;