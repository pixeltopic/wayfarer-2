import React, { Component } from "react";
import { connect } from "react-redux";
import { Icon, Item, Tab } from "semantic-ui-react";
import _ from "lodash";

import { fetchIncidents } from "../../actions";

class Incidents extends Component {
  // note: this component should only be rendered after this.props.maps.routes is not null/empty

  state = { cached: null };

  componentDidMount() {
    this.props.fetchIncidents();
    this.setState({ cached: this.props.routes });
  }

  componentDidUpdate() {
    // prevents infinite incident fetching
    if (this.state.cached !== this.props.routes) {
      this.props.fetchIncidents();
      this.setState({ cached: this.props.routes });
    }
  }

  renderIncidents = () => {
    const panes = _.map(this.props.incidents, (route, routeNum) => {
      const paneData = route.map((incident, key) => {
        const { shortDesc, type, severity, impacting } = incident;
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
        return { menuItem: `Route ${Number(routeNum)+1}`, render: () => <Tab.Pane attached={false}><Item.Group divided>{paneData}</Item.Group></Tab.Pane>};
      else
        return { menuItem: `Route ${Number(routeNum)+1}`, render: () => <Tab.Pane attached={false}>No incidents to look out for!</Tab.Pane> };
    });

    return <Tab menu={{ pointing: true }} panes={panes} />
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