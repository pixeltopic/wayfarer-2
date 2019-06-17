import React, { Component } from "react";
import { connect } from "react-redux"
import { Formik, Form } from "formik";
import  { Button, Form as SemForm, Header, Label } from "semantic-ui-react";
import * as Yup from "yup";
import MediaQuery from "react-responsive";

import SemField from "../../components/helpers/SemanticField";
import { formCache, processQuery } from "../../actions";
import history from "../../history";
import { routes } from "../../utils";

import "./basiclabel.css";

const textArray = [
  "Events at Staples Center, LA",
  "Directions from Irvine to Anaheim",
  "Nearest Boba places",
  "Sharetea within 3 miles",
  "Route from Riverside to Montebello"
];

/* 
To do:
Add more options to textArray

An incident type from the query endpoint means fetchDirections will need to be called first before redirecting to the discover page with the proper active tab.

Need to figure out how to handle error messages. Perhaps use a red pointing label
*/

class CallToAction extends Component {
  state = { 
    disableButton: false, 
    locationEnabled: false, 
    errorMessage: "", 
    textIdx: 0, 
    lat: null, 
    lng: null,
    geoLoc: window.navigator.geolocation
  };

  componentDidMount() {
    this.timeout = setInterval(() => {
      let currentIdx = this.state.textIdx;
      this.setState({ textIdx: currentIdx + 1 });
    }, 1500);
    this.watchID = this.state.geoLoc.watchPosition(
      pos => this.setState({ lat: pos.coords.latitude, lng: pos.coords.longitude, locationEnabled: true }),
      err => this.setState({ errorMessage: err.message, locationEnabled: false })
    );
  }

  componentWillUnmount() {
    clearInterval(this.timeout);
    this.state.geoLoc.clearWatch(this.watchID);
  }

  onSubmit = (values, actions) => {
    const queryProps = { ...values, currentLocation: { lat: this.state.lat, lng: this.state.lng }};
    console.log(queryProps);
    this.setState(
      { disableButton: true }, 
      () => this.props.processQuery(
        queryProps, 
        () => history.push(routes.DISCOVER),
        (payload) => this.setState({ disableButton: false, errorMessage: payload })
      )
    );
    // this.props.formCache(this.props.formName, values); // caches form on submit
    actions.setSubmitting(false);
  }

  validateSchema = () => (
    Yup.object().shape({ 
      query: Yup.string().min(2, "Too short!").required("Query required."),
    })
  );

  renderError = props => {
    // Unused method
    return <div><Label basic color='red' pointing>{props.children}</Label></div>;
  }

  renderServerError = () => {
    return (
        <Label color="red" size="large" className="calltoaction" basic pointing>{this.state.errorMessage}</Label>
    );
  }

  renderForm = ({ errors, status, touched, isSubmitting }) => {
    let textThatChanges = textArray[this.state.textIdx % textArray.length];
    return (
      <Form autoComplete="off" >
        <MediaQuery minWidth={630}>
          <SemForm.Group>
            <SemField 
              type="text" 
              size="huge" 
              component={SemForm.Input} 
              name="query" 
              placeholder={textThatChanges} 
              action={<Button primary icon="search" type="submit" disabled={isSubmitting || this.state.disableButton || !this.state.locationEnabled} loading={this.state.disableButton} ></Button>} 
              style={{ width:"50%"}}
            />
            {!this.state.locationEnabled && <Label color='teal' size="large" className="calltoaction" basic pointing>Enable location in your browser settings to start searching!</Label>}
            {/* <ErrorMessage name="command" component={this.renderError} /> */}
          </SemForm.Group>
        </MediaQuery>
        <MediaQuery maxWidth={630}>
          <SemForm.Group>
            <SemField 
              type="text" 
              size="huge"
              fluid
              component={SemForm.Input} 
              name="query" 
              placeholder={textThatChanges} 
              action={<Button primary icon="search" type="submit" disabled={isSubmitting || this.state.disableButton || !this.state.locationEnabled} loading={this.state.disableButton} ></Button>} 
            />
            {!this.state.locationEnabled && <Label color='teal' size="large" className="calltoaction" basic pointing>Enable location to start searching!</Label>}
            {/* <ErrorMessage name="command" component={this.renderError} /> */}
          </SemForm.Group>
        </MediaQuery>
        {this.state.errorMessage && this.renderServerError()}
      </Form>
    );
  }


  render () {
    const { cachedFormData } = this.props;
    return(
      <div style={{ 
        height: "100vh", 
        width: "100%", 
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(https://i.redd.it/viynhsjiiet11.png)",
        backgroundSize: "cover",
        textAlign: "center",
        margin: "0 auto",
        padding: "40vh 0"
        // WebkitFilter: "blur(8px)",
        // filter: "blur(8px)"
      }}>
        <Header inverted size="huge" style={{ marginBottom: "20px" }}>
          <Header.Content>
            The Wayfarer
            <Header.Subheader>Get Started by typing something below.</Header.Subheader>
          </Header.Content>
        </Header>
        <Formik
          validationSchema={this.validateSchema()}
          initialValues={{ 
            query: cachedFormData.query || "", 
          }}
          onSubmit={this.onSubmit}
          render={this.renderForm} 
        />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return { cachedFormData: state.form[ownProps.formName] || {} };
}

const ConnectedCallToAction = connect(mapStateToProps, { formCache, processQuery })(CallToAction);

ConnectedCallToAction.defaultProps = {
  formName: "CallToAction"
};

export default ConnectedCallToAction;