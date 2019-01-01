import React, { Component } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import  { Button, Form as SemForm, Segment, Header, Icon } from "semantic-ui-react";
import * as Yup from "yup";
import MediaQuery from "react-responsive";

import { SemFieldTxt } from "../helpers/SemanticField";

class Signin extends Component {

  onSubmit = (values, actions) => {
    console.log(values);
    actions.setSubmitting(false);
  }

  validateSchema = () => (
    Yup.object().shape({ 
      email: Yup.string().required("You need an email!"),
      password: Yup.string().required("You need a password!")
    })
  );

  renderError = props => {
    return <div style={{ color: "red" }}>{props.children}</div>;
  }

  renderForm = ({ isSubmitting }) => {
    return (
      <Segment stacked padded="very">
        <div style={{ textAlign: "center" }}>
          <Header as="h2" color="teal" icon>
            <Icon name="user circle" />
            Sign In to Your Account
          </Header>
        </div>
        <Form>
          <SemFieldTxt type="text" fluid icon="user" iconPosition="left" component={SemForm.Input} name="email" placeholder="email" />
          <ErrorMessage name="email" component={this.renderError} />
          <SemFieldTxt type="password" fluid icon="lock" iconPosition="left" component={SemForm.Input} name="password" placeholder="password" />
          <ErrorMessage name="password" component={this.renderError} />
          
          <Button 
            type="submit" 
            style={{ marginTop: "20px" }} 
            loading={isSubmitting}
            disabled={isSubmitting}
            className="teal" 
            fluid 
            size="large"
          >
            Sign in
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
        initialValues={{ email: "", password: "" }}
        validationSchema={this.validateSchema}
        onSubmit={this.onSubmit}
      />
    );
  }
}

export default Signin;