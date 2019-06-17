import React, { Component } from "react";
import { connect } from "react-redux";
import { Formik, Form, ErrorMessage } from "formik";
import  { Button, Form as SemForm, Segment, Header, Icon, Message, Label } from "semantic-ui-react";
import * as Yup from "yup";
import MediaQuery from "react-responsive";

import SemField from "../../components/helpers/SemanticField";
import { signin, resetAuthMessage } from "../../actions";
import history from "../../history";
import requireNoAuth from "../../components/hocs/requireNoAuth";

class Signin extends Component {

  state = { disableButton: false };

  componentWillUnmount() {
    this.props.resetAuthMessage();
  }

  onSubmit = (values, actions) => {
    this.setState({ disableButton: true});
    // console.log(values);

    this.props.signin(
      values, 
      () => () => history.push("/"), 
      () => this.setState({ disableButton: false })
    );
    actions.setSubmitting(false);
  }

  validateSchema = () => (
    Yup.object().shape({ 
      email: Yup.string().required("You need an email!"),
      password: Yup.string().required("You need a password!")
    })
  );

  renderError = props => {
    return <div style={{ marginBottom: "5px" }}><Label basic color='red' pointing>{props.children}</Label></div>;
  }

  renderServerError = () => (
    <Message negative>
      <Message.Header>Oops!</Message.Header>
      <p>{this.props.serverErrorMessage}</p>
    </Message>
  );

  renderForm = ({ isSubmitting }) => {
    return (
      <Segment stacked padded="very">
        <div style={{ textAlign: "center" }}>
          <Header as="h2" color="teal" icon>
            <Icon name="user circle" />
            Sign In
          </Header>
        </div>
        <Form>
          <SemField type="text" fluid icon="user" iconPosition="left" component={SemForm.Input} name="email" placeholder="email" />
          <ErrorMessage name="email" component={this.renderError} />
          <SemField type="password" fluid icon="lock" iconPosition="left" component={SemForm.Input} name="password" placeholder="password" />
          <ErrorMessage name="password" component={this.renderError} />
          
          <Button 
            type="submit" 
            style={{ marginTop: "20px" }} 
            loading={this.state.disableButton}
            disabled={this.state.disableButton}
            className="teal" 
            fluid 
            size="large"
          >
            Log In
          </Button>
          {this.props.serverErrorMessage && this.renderServerError()}
        </Form>
      </Segment>
    );
  }

  renderWithQuery = props => {
    return (
      <React.Fragment>
        <MediaQuery minWidth={700}>
          <div style={{ width: "450px", margin: "auto", padding: "70px 0" }}>
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

const mapStateToProps = state => {
  return { auth: state.auth, serverErrorMessage: state.error.authMessage };
}

export default connect(mapStateToProps, { signin, resetAuthMessage })(requireNoAuth(Signin));