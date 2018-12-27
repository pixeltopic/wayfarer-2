import React, { Component } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

class SearchRouteForm extends Component {

  onSubmit = (values, actions) => {
    console.log(values);
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
      <Form autoComplete="off" className="pure-form pure-form-stacked" >
        <label>Origin</label>
        <Field type="text" component="input" name="origin" placeholder="Anaheim" />
        <ErrorMessage name="origin" component={this.renderError} />

        <label>Destination</label>
        <Field type="text" component="input" name="destination" placeholder="Irvine" />
        <ErrorMessage name="destination" component={this.renderError} />

        <label>Travel Mode</label>
        <Field name="mode" component="select" style={{ padding: "2px"}}>
          <option value="driving">Driving</option>
          <option value="bicycling">Biking</option>
          <option value="transit">Transit</option>
          <option value="walking">Walking</option>
        </Field>
        <ErrorMessage name="mode" component={this.renderError} />

        <label className="pure-checkbox">
          <Field type="checkbox" component="input" name="altRoutes" /> Alt Routes
        </label>

        <label>Unit</label>
        <Field name="units" component="select" style={{ padding: "2px"}}>
          <option value="imperial">Imperial</option>
          <option value="metric">Metric</option>
        </Field>

        <h4>Avoid:</h4>
        <label className="pure-checkbox">
          <Field type="checkbox" component="input" name="avoidTolls" /> Tolls
        </label>
        <label className="pure-checkbox">
          <Field type="checkbox" component="input" name="avoidHighways" /> Highways
        </label>
        <label className="pure-checkbox">
          <Field type="checkbox" component="input" name="avoidFerries" /> Ferries
        </label>
        <label className="pure-checkbox">
          <Field type="checkbox" component="input" name="avoidIndoor" /> Indoor
        </label>

        <button type="submit" className="pure-button pure-button-primary" disabled={isSubmitting} >
          Submit
        </button>

      </Form>
    );
  }


  render () {
    return(
      <div>
        <Formik
          validationSchema={this.validateSchema()}
          validate={this.validateForm}
          initialValues={{ 
            origin: "", 
            destination: "", 
            mode: "", 
            altRoutes: false, 
            unit: "imperial",
            avoidTolls: false, avoidHighways: false, avoidFerries: false, avoidIndoor: false 
          }} // later unit preference should be set on acc settings
          onSubmit={this.onSubmit}
          render={this.renderForm} 
        />
      </div>
    );
  }
}

export default SearchRouteForm;