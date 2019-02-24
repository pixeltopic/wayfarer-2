import React, { Component } from "react";
import { connect } from "react-redux"
import  { Form as SemForm, Select, Input, Button } from "semantic-ui-react";
import _ from "lodash";

import { formCache } from "../../actions";

class PlaceResultsFilter extends Component {

  state = { keyword: "", attribute: "" };

  debouncedCallback = _.debounce(() => this.props.formCache(this.props.formName, this.state), 500);

  renderForm = () => {
    return (
      <SemForm autoComplete="off" onSubmit={e => e.preventDefault()} >
        <SemForm.Group inline>
          
            <Input
              type="text" 
              name="keyword" 
              placeholder="Peet's Coffee"
              style={{ verticalAlign: "middle" }}
              onChange={e => this.setState({keyword: e.target.value }, this.debouncedCallback) }
              value={this.state.keyword}
            />
          
            <Select
              name="attribute"
              style={{ verticalAlign: "middle", marginLeft: "7px" }}
              options={[{ value: "rating", text: "Rating" }, { value: "distance", text: "Distance" }]} 
              placeholder="Attribute"
              onChange={(e, { value }) => this.setState({ attribute: value }, () => this.props.formCache(this.props.formName, this.state))}
              value={this.state.attribute}
            />

            <Button floated="right" primary onClick={() => this.setState({ keyword: "", attribute: "" }, () => this.props.formCache(this.props.formName, this.state))}>
              Reset
            </Button>
          
        </SemForm.Group>
      </SemForm>
    );
  }

  render () {
    return this.renderForm();
  }
}

const ConnectedComponent = connect(null, { formCache })(PlaceResultsFilter);

ConnectedComponent.defaultProps = {
  formName: "PlacesResultsFilter",
};

export default ConnectedComponent;