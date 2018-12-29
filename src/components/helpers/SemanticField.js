import React from "react";
import { Field } from "formik";

// Field wrapper for semantic ui react. Instead of using Field from formik, use this instead.
// props can be passed through the SemanticField component and will be properly placed in Sem UI component.
// (Should) work for all types of components
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

export default SemanticField;