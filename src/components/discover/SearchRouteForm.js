import React, { Component } from "react";
import { connect } from "react-redux"
import { Formik, Form, ErrorMessage } from "formik";
import  { Button, Form as SemForm, Select, Menu, Message, Input, Dropdown } from "semantic-ui-react";
import * as Yup from "yup";

import SemField from "../helpers/SemanticField";
import { fetchDirections, formCache } from "../../actions";

const modeSelect = [
  { value: "driving", text: "Driving" },
  { value: "bicycling", text: "Biking" },
  { value: "transit", text: "Transit" },
  { value: "walking", text: "Walking" }
] 

class SearchRouteForm extends Component {

  state = { disableButton: false, errorMessage: "" };

  onSubmit = (values, actions) => {
    console.log(values);
    this.setState(
      { disableButton: true }, 
      () => this.props.fetchDirections(
        values, 
        () => this.setState({ disableButton: false, errorMessage: "" }),
        (payload) => this.setState({ disableButton: false, errorMessage: payload }),
        () => this.props.formCache(this.props.formName, values)
      )
    );
    // this.props.formCache(this.props.formName, values); // caches form on submit
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
    if (this.props.activeItem === "incidents" && values.units === "metric" && values.radius > 24) {
      errors.radius = "Max radius is 24 kilometers.";
    }
    if (this.props.activeItem === "incidents" && values.units === "imperial" && values.radius > 15) {
      errors.radius = "Max radius is 15 miles.";
    }
    if (this.props.activeItem === "incidents" && values.radius !== null && values.radius <= 0) {
      errors.radius = "Radius must be greater than 0!"
    }
    if (values.mode !== "walking" && values.avoidIndoor) {
      errors.mode = "You can only avoid indoor routes if you are walking.";
    }

    return errors;
  }

  renderError = props => {
    // console.log(props);
    return <div style={{ color: "red" }}>{props.children}</div>;
  }

  renderServerError = () => {
    return (
      <Menu.Item>
        <Message negative>
          <Message.Header>Oops!</Message.Header>
          <p>{this.state.errorMessage}</p>
        </Message>
      </Menu.Item>
    );
  }

  renderForm = ({ errors, status, touched, isSubmitting, values }) => {
    return (
      <Form autoComplete="off" >

        <Menu.Item>
          <Menu.Header>Origin</Menu.Header>
          <SemForm.Group>
            <SemField type="text" fluid component={SemForm.Input} name="origin" placeholder="Anaheim" />
            <ErrorMessage name="origin" component={this.renderError} />
          </SemForm.Group>
        </Menu.Item>
        <Menu.Item>
          <Menu.Header>Destination</Menu.Header>
          <SemForm.Group>
            <SemField type="text" fluid component={SemForm.Input} name="destination" placeholder="Irvine" />
            <ErrorMessage name="destination" component={this.renderError} />
          </SemForm.Group>
        </Menu.Item>

        <Menu.Item>
          <SemField name="mode" component={Select} fluid options={modeSelect} placeholder="Travel Mode" />
          <ErrorMessage name="mode" component={this.renderError} />
        </Menu.Item>

        <Menu.Item>
          <SemForm.Group>
            <SemField component={SemForm.Checkbox} name="altRoutes" label="Alt Routes"/>      
          </SemForm.Group>
        </Menu.Item>

        <Menu.Item>
          <Menu.Header>Unit Display</Menu.Header>
          <SemField name="units" fluid component={Select} options={[{ value: "imperial", text: "Imperial"}, { value: "metric", text: "Metric"}]} placeholder="Units" />
        </Menu.Item>

        { this.props.activeItem === "incidents" &&
        <Menu.Item>
          <Menu.Header>Incidents within</Menu.Header>
          <SemForm.Group>
            <SemField 
              type="number" 
              fluid
              component={Input}
              label={<SemField name="units" component={Dropdown} options={[{ value: "imperial", text: "mi"}, { value: "metric", text: "km"}]}/>}
              labelPosition="right"
              name="radius" 
              placeholder="10" 
            />
            <ErrorMessage name="radius" component={this.renderError} />
          </SemForm.Group>
        </Menu.Item> }

        <Menu.Item>
          <Menu.Header>Avoid</Menu.Header>
          <SemForm.Group>     
              <SemField component={SemForm.Checkbox} name="avoidTolls" label="Tolls" />  
              <SemField component={SemForm.Checkbox} name="avoidHighways" label="Highways" />
              <SemField component={SemForm.Checkbox} name="avoidFerries" label="Ferries" />
              <SemField component={SemForm.Checkbox} name="avoidIndoor" label="Indoor" />
          </SemForm.Group>
        </Menu.Item>

        <Menu.Item>
          <Button type="submit" disabled={isSubmitting || this.state.disableButton} loading={this.state.disableButton} >
            Submit
          </Button>
        </Menu.Item>
        {this.state.errorMessage && this.renderServerError()}

      </Form>
    );
  }


  render () {
    const { cachedFormData } = this.props;
    return(
      <Menu vertical fluid>
        <Formik
          validationSchema={this.validateSchema()}
          validate={this.validateForm}
          initialValues={{ 
            origin: cachedFormData.origin || "", 
            destination: cachedFormData.destination || "", 
            mode: cachedFormData.mode || "", 
            altRoutes: cachedFormData.altRoutes || false, 
            units: cachedFormData.units || "imperial",
            radius: cachedFormData.radius || null,
            avoidTolls: cachedFormData.avoidTolls || false, 
            avoidHighways: cachedFormData.avoidHighways || false, 
            avoidFerries: cachedFormData.avoidFerries || false, 
            avoidIndoor: cachedFormData.avoidIndoor || false 
          }} // later unit preference should be set on acc settings
          onSubmit={this.onSubmit}
          render={this.renderForm} 
        />
      </Menu>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return { 
    cachedFormData: state.form[ownProps.formName] || {}, 
    activeItem: state.discover.activeItem 
  };
}

const ConnectedSearchRouteForm = connect(mapStateToProps, { fetchDirections, formCache })(SearchRouteForm);

ConnectedSearchRouteForm.defaultProps = {
  formName: "SearchRouteForm"
};

export default ConnectedSearchRouteForm;