import React, { Component } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import  { Button, Form as SemForm } from "semantic-ui-react";
import * as Yup from "yup";

import SemanticField from "../helpers/SemanticField";

class Signup extends Component {

  onSubmit = (values, actions) => {
    console.log(values);
    actions.setSubmitting(false);
  }

  validateSchema = () => (
    Yup.object().shape({ 
      email: Yup.string().email("Not a valid email.").required("You an email!"),
      password: Yup.string().min(5, "Too short!").required("You need a password!")
    })
  );

  renderError = props => {
    console.log(props);
    return <div style={{ color: "red" }}>{props.children}</div>;
  }

  renderForm = ({ isSubmitting }) => {
    return (
      <Form>
        <SemanticField type="text" fluid component={SemForm.Input} name="email" placeholder="email" />
        <ErrorMessage name="email" component={this.renderError} />
        <SemanticField type="password" fluid component={SemForm.Input} name="password" placeholder="*****" />
        <ErrorMessage name="password" component={this.renderError} />
        <Button type="submit" disabled={isSubmitting}>
          Submit
        </Button>


      </Form>
    );
  }

  render() {
    return (
      <Formik 
        render={this.renderForm}
        initialValues={{ email: "", password: "" }}
        validationSchema={this.validateSchema}
        onSubmit={this.onSubmit}
      />
    );
  }
}

export default Signup;