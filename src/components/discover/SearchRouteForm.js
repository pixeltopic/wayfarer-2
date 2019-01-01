import React, { Component } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import  { Button, Form as SemForm, Select, Menu } from "semantic-ui-react";
import * as Yup from "yup";

import SemanticField from "../helpers/SemanticField";

const modeSelect = [
  { value: "driving", text: "Driving" },
  { value: "bicycling", text: "Biking" },
  { value: "transit", text: "Transit" },
  { value: "walking", text: "Walking" }
] 

class SearchRouteForm extends Component {

  onSubmit = (values, actions) => {
    console.log(values);
    console.log(process.env.REACT_APP_BACKEND_KEY);
    actions.setSubmitting(false);
  }

  validateSchema = () => (
    Yup.object().shape({ 
      origin: Yup.string().min(2, "Too short!").required("You must enter an origin"),
      destination: Yup.string().min(2, "Too short!").required("You must enter a destination"),
      mode: Yup.string().required("Pick a travel mode.")
    })
  );

  validateForm = (values) => {
    const errors = {};
    if (values.mode !== "walking" && values.avoidIndoor) {
      errors.mode = "You can only avoid indoor routes if you are walking.";
    }

    return errors;
  }

  renderError = props => {
    console.log(props);
    return <div style={{ color: "red" }}>{props.children}</div>;
  }

  renderForm = ({ errors, status, touched, isSubmitting }) => {
    return (
      <Form autoComplete="off" >

        <Menu.Item>
          <Menu.Header>Origin</Menu.Header>
          <SemForm.Group>
            <SemanticField type="text" fluid component={SemForm.Input} name="origin" placeholder="Anaheim" />
            <ErrorMessage name="origin" component={this.renderError} />
          </SemForm.Group>
        </Menu.Item>
        <Menu.Item>
          <Menu.Header>Destination</Menu.Header>
          <SemForm.Group>
            <SemanticField type="text" fluid component={SemForm.Input} name="destination" placeholder="Irvine" />
            <ErrorMessage name="destination" component={this.renderError} />
          </SemForm.Group>
        </Menu.Item>

        <Menu.Item>
          <SemanticField name="mode" component={Select} fluid options={modeSelect} placeholder="Travel Mode" />
          <ErrorMessage name="mode" component={this.renderError} />
        </Menu.Item>

        <Menu.Item>
          <SemForm.Group>
            <SemanticField component={SemForm.Checkbox} name="altRoutes" label="Alt Routes"/>      
          </SemForm.Group>
        </Menu.Item>

        <Menu.Item>
          <Menu.Header>Unit Display</Menu.Header>
          <SemanticField name="units" fluid component={Select} options={[{ value: "imperial", text: "Imperial"}, { value: "metric", text: "Metric"}]} placeholder="Units" />
        </Menu.Item>

        <Menu.Item>
          <Menu.Header>Avoid</Menu.Header>
          <SemForm.Group>     
              <SemanticField component={SemForm.Checkbox} name="avoidTolls" label="Tolls" />  
              <SemanticField component={SemForm.Checkbox} name="avoidHighways" label="Highways" />
              <SemanticField component={SemForm.Checkbox} name="avoidFerries" label="Ferries" />
              <SemanticField component={SemForm.Checkbox} name="avoidIndoor" label="Indoor" />
          </SemForm.Group>
        </Menu.Item>

        <Menu.Item>
          <Button type="submit" disabled={isSubmitting} >
            Submit
          </Button>
        </Menu.Item>

      </Form>
    );
  }


  render () {
    return(
      <Menu vertical>
        <Formik
          validationSchema={this.validateSchema()}
          validate={this.validateForm}
          initialValues={{ 
            origin: "", 
            destination: "", 
            mode: "", 
            altRoutes: false, 
            units: "imperial",
            avoidTolls: false, avoidHighways: false, avoidFerries: false, avoidIndoor: false 
          }} // later unit preference should be set on acc settings
          onSubmit={this.onSubmit}
          render={this.renderForm} 
        />
      </Menu>
    );
  }
}

export default SearchRouteForm;