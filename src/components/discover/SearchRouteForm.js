import React, { Component } from "react";
import { connect } from "react-redux"
import { Formik, Form, ErrorMessage } from "formik";
import  { Button, Form as SemForm, Select, Menu, Message, Input, Dropdown, Label } from "semantic-ui-react";
import * as Yup from "yup";
import _ from "lodash";

import SemField from "../helpers/SemanticField";
import { fetchDirections, formCache } from "../../actions";
import { formNames } from "../../utils";

const modeSelect = [
  { value: "driving", text: "Driving" },
  { value: "bicycling", text: "Biking" },
  { value: "transit", text: "Transit" },
  { value: "walking", text: "Walking" }
] 

class SearchRouteForm extends Component {

  state = { 
    disableButton: false, 
    errorMessage: "", 
    locationEnabled: false, 
    lat: null,
    lng: null,
    geoLoc: window.navigator.geolocation
  };

  componentDidMount() {
    this.watchID = this.state.geoLoc.watchPosition(
      pos => this.setState({ lat: pos.coords.latitude, lng: pos.coords.longitude, locationEnabled: true }),
      err => this.setState({ locationEnabled: false })
    );
  }

  componentWillUnmount() {
    this.state.geoLoc.clearWatch(this.watchID);
  }

  onSubmit = (values, actions) => {
    console.log(values);

    let omittedKeys = ["useCurrentLocation", "radius"];

    // if (!values.radius) {
    //   omittedKeys.push("radius");
    // }

    const payload = _.omit({ 
      ...values, 
      ...this.state.locationEnabled && values.useCurrentLocation && { currentLocation: { lat: this.state.lat, lng: this.state.lng }}
    }, omittedKeys);

    this.setState(
      { disableButton: true }, 
      () => this.props.fetchDirections(
        payload, 
        () => this.setState({ disableButton: false, errorMessage: "" }),
        (payload) => this.setState({ disableButton: false, errorMessage: payload }),
        () => this.props.formCache(this.props.formName, { ...values, ...this.state.locationEnabled && values.useCurrentLocation && { currentLocation: { lat: this.state.lat, lng: this.state.lng }} })
      )
    );
    
    actions.setSubmitting(false);
  }

  validateSchema = () => (
    Yup.object().shape({ 
      origin: Yup.string(),
      destination: Yup.string().min(2, "Too short!").required("Destination required."),
      mode: Yup.string().required("Pick a travel mode.")
    })
  );

  validateForm = (values) => {
    const errors = {};
    if (!values.useCurrentLocation && !values.origin) {
      errors.origin = "Origin required.";
    }

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
    return <div><Label basic color='red' pointing>{props.children}</Label></div>;
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

  renderLocationMsg = () => {
    return (
      <Menu.Item>
        <Message info>
          <Message.Header>Tip</Message.Header>
          <p>Enable location to use current position.</p>
        </Message>
      </Menu.Item>
    );
  }

  renderForm = ({ isSubmitting, values }) => {
    return (
      <Form autoComplete="off" >

        <Menu.Item>
          <Menu.Header>Origin</Menu.Header>
          
          <SemForm.Group>
            <SemField type="text" fluid component={SemForm.Input} disabled={values.useCurrentLocation} name="origin" placeholder="Anaheim" />
            
          </SemForm.Group>
          <SemForm.Group style={{ marginTop: "5px" }}>
            <SemField component={SemForm.Checkbox} disabled={!this.state.locationEnabled} name="useCurrentLocation" label="Use Current Location"/>  
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
        {!this.state.locationEnabled && this.renderLocationMsg()}

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
            useCurrentLocation: cachedFormData.useCurrentLocation || false,
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
          enableReinitialize
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
  formName: formNames.SEARCH_ROUTE_FORM
};

export default ConnectedSearchRouteForm;