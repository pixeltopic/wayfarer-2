import React, { Component } from "react";
import { connect } from "react-redux";
import { Item, Tab } from "semantic-ui-react";
import _ from "lodash";

import { fetchIncidents } from "../../actions";

class Incidents extends Component {
  // note: this component should only be rendered after this.props.maps.routes is not null/empty

  state = { cached: null, loading: false, activeIndex: 0 };

  updateOnRouteChange = () => {
    // whenever the data in this.props.routes changes, function is called to show necessary loading screen and updated data
    this.setState(
      { loading: true }, 
      () => this.props.fetchIncidents(() => this.setState({ loading: false }))
    );
    this.setState({ cached: this.props.routes });
  }

  componentDidMount() {
    this.updateOnRouteChange();
  }

  componentDidUpdate() {
    // prevents infinite incident fetching
    if (this.state.cached !== this.props.routes) {
      this.updateOnRouteChange();
    }
    console.log(`activeIndex: ${this.state.activeIndex} routes.length: ${this.props.routes.length-1}`);
    if (this.state.activeIndex !== 0 && this.state.activeIndex > this.props.routes.length-1) {
      console.log("hit");
      this.setState({ activeIndex: 0 });
    }
  }

  handleTabChange = (e, { activeIndex }) => this.setState({ activeIndex });

  renderIncidents = () => {
    const panes = _.map(this.props.incidents, (route, routeNum) => {
      const paneData = route.map((incident, key) => {
        const { shortDesc, /*type, severity, impacting*/ } = incident;
        return (
          <Item key={key}>
            <Item.Content>
              <Item.Header as="h4">{shortDesc}
              </Item.Header>
              <Item.Extra>
                {/* <Icon color="teal" name="time" />{step.duration.text}{" "}
                <Icon color="teal" name="road" />{step.distance.text} */}
              </Item.Extra>
            </Item.Content>
          </Item>
        );
      });
      if (paneData.length !== 0)
        return { menuItem: `Route ${Number(routeNum)+1}`, render: () => <Tab.Pane loading={this.state.loading} attached={false}><Item.Group divided>{paneData}</Item.Group></Tab.Pane>};
      else
        return { menuItem: `Route ${Number(routeNum)+1}`, render: () => <Tab.Pane loading={this.state.loading} attached={false}>No incidents to look out for!</Tab.Pane> };
    });

    const initialPanes = this.props.routes.map((route, routeNum) => {
      return { menuItem: `Route ${routeNum+1}`, render: () => <Tab.Pane loading={true} attached={false}></Tab.Pane> };
    });

    return (
      <Tab 
        menu={{ pointing: true }} 
        activeIndex={this.state.activeIndex} 
        onTabChange={this.handleTabChange}
        panes={panes.length !== 0 ? panes : initialPanes } 
      />
    );
  }

  render() {
    console.log(this.props.incidents);
    if (!this.props.routes) {
      return null;
    }
    return (
      <div>{this.renderIncidents()}</div>
    );
  }
}

const mapStateToProps = state => {
  return { incidents: state.incidents, routes: state.maps.routes };
}

export default connect(mapStateToProps, { fetchIncidents })(Incidents);