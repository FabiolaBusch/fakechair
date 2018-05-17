import React, { Component } from "react";
import ipfs from './ipfs';
import Form from "react-jsonschema-form";


class EventSchemaInput extends Component {

  schema = {
    "$schema": "http://json-schema.org/draft-06/schema#",
    "title": "NewEvent",
    "description": "Description of a new Conference",
    "type": "object",
    "properties": {
      "Title": {
        "type": "string"
      }, 
      "Year": {
        "description": "Year the Conference will take place",
        "type": "integer", 
        "minimum": 2018
      },
      "Start": {
        "format": "alt-date",
        "type": "string",
        "description": "Event starting time"
      },
      "End": {
        "format": "alt-date",
        "type": "string",
        "description": "Event ending time"
      },
      "Abstract": {
        "type": "string",
        "description": "A brief description of the event.",
        "minLength": 500,
        "maxLength": 1500
      }, 
      "Topics": {
        "type": "array", 
        "items": {
          "type": "string", 
          "description": "Topics of interest."
        }, 
        "minLength": 1,
              "uniqueItems": true
      }, 
      "Paper-Submission-Date": {
        "format": "alt-date",
        "type": "string"
      }, 
      "Acceptance-Notification-Date": {
        "format": "alt-date",
        "type": "string"
      }, 
      "Submission-Details": {
        "type": "string", 
        "description": "Details about the submission format, length, requirements and conditions."
      }, 
      "Chairs": {
        "type": "array", 
        "items": {
          "type": "string", 
          "description": "Name/id of chairs"
        }, 
        "minItems": 1,
              "uniqueItems": true

      },
      "Programm-Committee": {
        "type": "array", 
        "items": {
          "type": "string",
          "description": "Name/id of PC members."
        }, 
        "minItems": 1,
              "uniqueItems": true
      }
    },
    "required": ["title", "year","start", "end", "abstract", "topics", "paper-submission-date", "acceptance-notification-date", "submission-details" ]
  };

  log = (type) => console.log.bind(console, type);

  onSubmit = ({formData}) => console.log("Data submitted: ",  formData);

  onSubmitIPFS = async ({formData}) => {
    const buf = Buffer.from(JSON.stringify(formData)); // create Buffer 
    
    await ipfs.add(buf, (err, ipfsHash) => {
        console.log(err,ipfsHash);
        }
      ); 
  };


render() {

  return (
    <Form schema={this.schema}
          onChange={this.log("changed")}
          onSubmit={this.onSubmitIPFS}
          onError={this.log("errors")} />
    );
  }

}

export default EventSchemaInput;