import React, { Component } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import  { Button, Form as SemForm, Select, Checkbox } from "semantic-ui-react";
import * as Yup from "yup";

const SemanticField = ({ component, ...fieldProps }) => (
  <Field
    {...fieldProps}
    render={({
      field: { value, onBlur, ...field },
      form: { setFieldValue, setFieldTouched },
      ...props
    }) =>
      React.createElement(component, {
        ...fieldProps,
        ...field,
        ...props,
        ...(typeof value === 'boolean'
          ? {
              checked: value
            }
          : {
              value
            }),
        onChange: (e, { value: newValue, checked }) =>
          setFieldValue(fieldProps.name, newValue || checked),
        onBlur: (e, blurProps) =>
          blurProps ? setFieldTouched(fieldProps.name, blurProps.value) : onBlur(e)
      })
    }
  />
);

const modeSelect = [
  { value: "driving", text: "Driving" },
  { value: "bicycling", text: "Biking" },
  { value: "transit", text: "Transit" },
  { value: "walking", text: "Walking" }
] 

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
      <Form autoComplete="off" >

        <SemForm.Group>
          <label>Origin</label>
          <SemanticField type="text" component={SemForm.Input} name="origin" placeholder="Anaheim" />
          <ErrorMessage name="origin" component={this.renderError} />

          <label>Destination</label>
          <SemanticField type="text" component={SemForm.Input} name="destination" placeholder="Irvine" />
          <ErrorMessage name="destination" component={this.renderError} />
        </SemForm.Group>

        
        <SemanticField name="mode" component={Select} options={modeSelect} placeholder="Travel Mode" />
        <ErrorMessage name="mode" component={this.renderError} />

        <SemForm.Group>
          <label >
            <SemanticField component={SemForm.Checkbox} name="altRoutes" label="Alt Routes"/>
          </label>
        </SemForm.Group>

        <SemanticField name="units" component={Select} options={[{ value: "imperial", text: "Imperial"}, { value: "metric", text: "Metric"}]} placeholder="Units" />
        <SemForm.Group>
          <h4>Avoid:</h4>
          <label >
            <SemanticField component={SemForm.Checkbox} name="avoidTolls" label="Tolls" />
          </label>
          <label >
            <SemanticField component={SemForm.Checkbox} name="avoidHighways" label="Highways" />
          </label>
          <label >
            <SemanticField component={SemForm.Checkbox} name="avoidFerries" label="Ferries" />
          </label>
          <label >
            <SemanticField component={SemForm.Checkbox} name="avoidIndoor" label="Indoor" />
          </label>
        </SemForm.Group>

        <Button type="submit" disabled={isSubmitting} >
          Submit
        </Button>

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
            units: "imperial",
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