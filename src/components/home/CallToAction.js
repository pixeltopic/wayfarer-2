import React, { Component } from "react";
import { connect } from "react-redux"
import { Formik, Form } from "formik";
import  { Button, Form as SemForm, Message, Header } from "semantic-ui-react";
import * as Yup from "yup";
import MediaQuery from "react-responsive";

import SemField from "../helpers/SemanticField";
import { formCache } from "../../actions";

const textArray = [
  "Events at Staples Center, LA",
  "Directions from Irvine to Anaheim",
  "Nearest Boba places"
];

/* 
To do:
Add more options to textArray
Disable search bar if location is not enabled?
Alternatively, add a hover popup?

add location services

An incident type from the query endpoint means fetchDirections will need to be called first before redirecting to the discover page with the proper active tab.

Need to figure out how to handle error messages. Perhaps use a red pointing label
*/

class CallToAction extends Component {
  state = { disableButton: false, errorMessage: "", textIdx: 0 };

  componentDidMount() {
    this.timeout = setInterval(() => {
      let currentIdx = this.state.textIdx;
      this.setState({ textIdx: currentIdx + 1 });
    }, 1500);
  }

  componentWillUnmount() {
    clearInterval(this.timeout);
  }

  onSubmit = (values, actions) => {
    console.log(values);
    // this.setState(
    //   { disableButton: true }, 
    //   () => this.props.fetchDirections(
    //     values, 
    //     () => this.setState({ disableButton: false, errorMessage: "" }),
    //     (payload) => this.setState({ disableButton: false, errorMessage: payload })
    //   )
    // );
    // this.props.formCache(this.props.formName, values); // caches form on submit
    actions.setSubmitting(false);
  }

  validateSchema = () => (
    Yup.object().shape({ 
      query: Yup.string().min(2, "Too short!").required("Query required."),
    })
  );

  renderError = props => {
    // console.log(props);
    return <div style={{ color: "red" }}>{props.children}</div>;
  }

  renderServerError = () => {
    return (
      
        <Message negative>
          <Message.Header>Oops!</Message.Header>
          <p>{this.state.errorMessage}</p>
        </Message>
  
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
              action={<Button primary icon="search" type="submit" disabled={isSubmitting || this.state.disableButton} loading={this.state.disableButton} ></Button>} 
              style={{ width:"50%"}}
            />
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
              action={<Button primary icon="search" type="submit" disabled={isSubmitting || this.state.disableButton} loading={this.state.disableButton} ></Button>} 
            />
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

const ConnectedCallToAction = connect(mapStateToProps, { formCache })(CallToAction);

ConnectedCallToAction.defaultProps = {
  formName: "CallToAction"
};

export default ConnectedCallToAction;