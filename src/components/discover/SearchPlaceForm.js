import React, { Component } from "react";
import { connect } from "react-redux"
import { Formik, Form, ErrorMessage } from "formik";
import  { Button, Form as SemForm, Select, Menu, Message, Dropdown, Input, Label } from "semantic-ui-react";
import * as Yup from "yup";

import SemField from "../helpers/SemanticField";
import { fetchPlaces, formCache } from "../../actions";
import { formNames } from "../../utils";

const priceSelect = [
  { value: -1, text: "None" },
  { value: 1, text: "Inexpensive" },
  { value: 2, text: "Moderate" },
  { value: 3, text: "Expensive" },
  { value: 4, text: "Very Expensive" },
];

const typeSelect = ["accounting", "airport", "amusement park", "aquarium", "art gallery",
  "atm", "bakery", "bank", "bar", "beauty salon", "bicycle store", "book store",
  "bowling alley", "bus station", "cafe", "campground", "car dealer", "car rental", "car repair", 
  "car wash", "casino", "cemetery", "church", "city hall", "clothing store", "convenience store",
  "courthouse", "dentist", "department store", "doctor", "electrician", "electronics store",
  "embassy", "fire station", "florist", "funeral home", "furniture store",
  "gas station", "gym", "hair care", "hardware store", "hospital", "jewelry store", "laundry",
  "lawyer", "library", "liquor store", "local government office",
  "locksmith", "lodging", "movie theater", "museum", "night club",
  "park", "parking", "pet store", "pharmacy", "police", "post office", "restaurant",
  "school", "shoe store", "shopping mall", "spa", "stadium", "store", "subway station", 
  "supermarket", "train station", "transit station", "veterinary care", "zoo"
];

class SearchPlaceForm extends Component {

  state = { 
    disableButton: false, 
    errorMessage: "" ,
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
    console.log({ ...values, ...this.state.locationEnabled && values.useCurrentLocation && { currentLocation: { lat: this.state.lat, lng: this.state.lng }}});
    this.setState(
      { disableButton: true }, 
      () => this.props.fetchPlaces(
        { ...values, ...this.state.locationEnabled && values.useCurrentLocation && { currentLocation: { lat: this.state.lat, lng: this.state.lng }}}, 
        () => this.setState({ disableButton: false, errorMessage: "" }),
        (payload) => this.setState({ disableButton: false, errorMessage: payload })
      )
    );
    this.props.formCache(this.props.formName, values); // caches form on submit
    actions.setSubmitting(false);
  }

  validateSchema = () => (
    Yup.object().shape({ 
      keyword: Yup.string().min(2, "Too short!").required("Keyword required."),
      address: Yup.string(),
      radius: Yup.number().moreThan(0, "Must be greater than 0!").required("Radius required.") // Do the harder checking later (no negatives must be, under 31 miles or 50km)
    })
  );

  validateForm = (values) => {
    const errors = {};
    if (!values.useCurrentLocation && !values.address) {
      errors.address = "Address required.";
    }


    if (values.units === "metric" && values.radius > 50) {
      errors.radius = "Max radius is 50 kilometers.";
    }
    if (values.units === "imperial" && values.radius > 30) {
      errors.radius = "Max radius is 30 miles.";
    }
    if (values.minprice > values.maxprice) {
      errors.minprice = "Minimum price cannot exceed maximum price.";
    }
    return errors;
  }

  renderError = props => {
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
          <Menu.Header>Search for</Menu.Header>
          <SemForm.Group>
            <SemField type="text" fluid component={SemForm.Input} name="keyword" placeholder="Sharetea" />
            <ErrorMessage name="keyword" component={this.renderError} />
          </SemForm.Group>
        </Menu.Item>

        <Menu.Item>
          <Menu.Header>Near</Menu.Header>
          <SemForm.Group>
            <SemField type="text" fluid component={SemForm.Input} disabled={values.useCurrentLocation} name="address" placeholder="Irvine" />
            
          </SemForm.Group>
          <SemForm.Group style={{ marginTop: "5px" }}>
            <SemField component={SemForm.Checkbox} disabled={!this.state.locationEnabled} name="useCurrentLocation" label="Use Current Location"/>  
            <ErrorMessage name="address" component={this.renderError} />    
          </SemForm.Group>
        </Menu.Item>

        <Menu.Item>
          <Menu.Header>Distance away</Menu.Header>
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
        </Menu.Item>

        <Menu.Item>
          <Menu.Header>Establishment Type</Menu.Header>
          <SemField name="type" component={Select} fluid options={[ { value: "", text: "None" }, ...typeSelect.map((name) => ({ value: name, text: name }))]} placeholder="None" />
        </Menu.Item>

        <Menu.Item>
          <Menu.Header>Minimum Price</Menu.Header>
          <SemField name="minprice" component={Select} fluid options={priceSelect} placeholder="Min price" />
          <ErrorMessage name="minprice" component={this.renderError} />
        </Menu.Item>

        <Menu.Item>
          <Menu.Header>Maximum Price</Menu.Header>
          <SemField name="maxprice" component={Select} fluid options={priceSelect} placeholder="Max price" />
          <ErrorMessage name="maxprice" component={this.renderError} />
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
            keyword: cachedFormData.keyword || "", 
            address: cachedFormData.address || "",
            useCurrentLocation: cachedFormData.useCurrentLocation || false,
            radius: cachedFormData.radius || "0", 
            units: cachedFormData.units || "imperial",
            type: cachedFormData.type || "",
            minprice: cachedFormData.minprice || -1,
            maxprice: cachedFormData.maxprice || -1
          }}
          onSubmit={this.onSubmit}
          render={this.renderForm} 
          enableReinitialize
        />
      </Menu>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return { cachedFormData: state.form[ownProps.formName] || {} };
}

const ConnectedSearchPlaceForm = connect(mapStateToProps, { fetchPlaces, formCache })(SearchPlaceForm);

ConnectedSearchPlaceForm.defaultProps = {
  formName: formNames.SEARCH_PLACE_FORM
};

export default ConnectedSearchPlaceForm;