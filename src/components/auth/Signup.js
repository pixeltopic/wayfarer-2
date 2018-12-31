import React, { Component } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import  { Button, Form as SemForm, Segment, Header, Icon } from "semantic-ui-react";
import * as Yup from "yup";
import MediaQuery from "react-responsive";

import SemanticField from "../helpers/SemanticField";

class Signup extends Component {

  onSubmit = (values, actions) => {
    console.log(values);
    actions.setSubmitting(false);
  }

  validateSchema = () => (
    Yup.object().shape({ 
      email: Yup.string().email("Not a valid email.").required("You need an email!"),
      password: Yup.string().min(5, "Too short!").required("You need a password!")
    })
  );

  validateForm = (values) => {
    const errors = {};
    if (values.password !== values.confirmPassword) {
      errors.confirmPassword = "Your password doesn't match!";
    }

    return errors;
  }

  renderError = props => {
    console.log(props);
    return <div style={{ color: "red" }}>{props.children}</div>;
  }

  renderForm = ({ isSubmitting }) => {
    return (
      <Segment stacked padded="very">
        <div style={{ textAlign: "center" }}>
          <Header as="h2" color="teal" icon>
            <Icon name="user circle" />
            Sign Up for an account
          </Header>
        </div>
        <Form>
          <SemanticField type="text" fluid icon="user" iconPosition="left" component={SemForm.Input} name="email" placeholder="email" />
          <ErrorMessage name="email" component={this.renderError} />
          <SemanticField type="password" fluid icon="lock" iconPosition="left" component={SemForm.Input} name="password" placeholder="password" />
          <ErrorMessage name="password" component={this.renderError} />
          <SemanticField type="password" fluid icon="lock" iconPosition="left" component={SemForm.Input} name="confirmPassword" placeholder="confirm password" />
          <ErrorMessage name="confirmPassword" component={this.renderError} />
          <Button 
            type="submit" 
            style={{ marginTop: "20px" }} 
            loading={isSubmitting}
            disabled={isSubmitting}
            className="teal" 
            fluid 
            size="large"
          >
            Register
          </Button>
        </Form>
      </Segment>
    );
  }

  renderWithQuery = props => {
    return (
      <React.Fragment>
        <MediaQuery minWidth={700}>
          <div style={{ width: "50%", margin: "auto", padding: "70px 0" }}>
            {this.renderForm(props)}
          </div>
        </MediaQuery>
        <MediaQuery maxWidth={700}>
          <div style={{ width: "80%", margin: "auto", padding: "70px 0" }}>
            {this.renderForm(props)}
          </div>
        </MediaQuery>
      </React.Fragment>
    );

  }

  render() {
    return (
      <Formik 
        render={this.renderWithQuery}
        initialValues={{ email: "", password: "", confirmPassword: "" }}
        validationSchema={this.validateSchema}
        validate={this.validateForm}
        onSubmit={this.onSubmit}
      />
    );
  }
}

export default Signup;