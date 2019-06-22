import React, { Component } from "react";
import { connect } from "react-redux";

import Tabs from "./Tabs";

class DirectionSteps extends Component {
  state = { activeIndex: 0 };

  componentDidUpdate() {
    if (
      this.state.activeIndex !== 0 &&
      this.state.activeIndex > this.props.routes.length - 1
    ) {
      // console.log(`activeIndex: ${this.state.activeIndex}`)
      this.setState({ activeIndex: 0 });
    }
  }

  handleTabChange = (e, { activeIndex }) => this.setState({ activeIndex });

  render() {
    if (!this.props.routes) {
      return null;
    }
    console.log("Component re-rendered");
    return (
      <Tabs
        handleTabChange={this.handleTabChange}
        activeIndex={this.state.activeIndex}
        tabContent={this.props.routes}
      />
    );
  }
}

const mapStateToProps = state => {
  return { routes: state.maps.routes };
};

export default connect(mapStateToProps)(DirectionSteps);
