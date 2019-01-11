import { FORM_CACHE } from "./types";

export const formCache = (formName, formValues) => {
  // preserves form data upon form submission. Form state stored in according to formName.
  return {
    type: FORM_CACHE,
    payload: { name: formName, values: formValues }
  };
}
