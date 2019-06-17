import React, { Component } from "react";
import { connect } from "react-redux";
import { Item, Tab, Message, Icon, Menu, Card, Divider, Header, Dimmer, Loader } from "semantic-ui-react";
import _ from "lodash";

import { fetchIncidents } from "../../actions";
import { ImpactingLabel, IncidentLabel } from "../helpers/IncidentLabels";
import PolylineMap from "../common/GoogleMap/PolylineMap";
import Marker from "../common/GoogleMap/Marker";

class Incidents extends Component {
  // note: this component should only be rendered after this.props.maps.routes is not null/empty

  state = { cached: null, loading: false, activeIndex: 0, showConstruction: true, showEvents: true, showCongestion: true, showIncidents: true };

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
    // ensures user is always on a valid active tab (eg disabling alt routes and searching)
    if (this.state.activeIndex !== 0 && this.state.activeIndex > this.props.routes.length-1) {
      this.setState({ activeIndex: 0 });
    }
  }

  handleTabChange = (e, { activeIndex }) => this.setState({ activeIndex });

  noIncidentMessage = () => (
    <Message info>
      <Message.Header>No incidents were found on this route.</Message.Header>
    </Message>
  );

  renderIncidentMapMarkers = (incident, key) => {
    const { type, severity, lat, lng } = incident;
    if (type === 1 && !this.state.showConstruction) {
      return null;
    } else if (type === 2 && !this.state.showEvents) {
      return null;
    } else if (type === 3 && !this.state.showCongestion) {
      return null;
    } else if (type === 4 && !this.state.showIncidents) {
      return null;
    } else {
      return (<Marker key={key} incidentData={incident} popup type="incident" incidentType={type} incidentSeverity={severity} lat={lat} lng={lng}/>);
    }
  }

  toggleMarkerViews = () => {
    return (
      <Menu style={{ boxShadow: "none" }}>
        <Menu.Item 
          active={this.state.showConstruction} 
          onClick={() => this.setState({ showConstruction: !this.state.showConstruction })}>
          <Icon name="cog" />
        </Menu.Item>
        <Menu.Item
          active={this.state.showEvents}
          onClick={() => this.setState({ showEvents: !this.state.showEvents })}
        >
          <Icon name="map pin" />
        </Menu.Item>
        <Menu.Item
          active={this.state.showCongestion}
          onClick={() => this.setState({ showCongestion: !this.state.showCongestion })}
        >
          <Icon name="clock" />
        </Menu.Item>
        <Menu.Item
          active={this.state.showIncidents}
          onClick={() => this.setState({ showIncidents: !this.state.showIncidents })}
        >
          <Icon name="exclamation circle" />
        </Menu.Item>
      </Menu>
    );
  }

  generateIncidentItems = (incident, key) => {
    const { shortDesc, type, severity, impacting } = incident;
    return (
      <Item key={key}>
        <Item.Content>
          <Item.Header as="h4">{shortDesc}
          </Item.Header>
          <Item.Extra>
            <IncidentLabel typeNum={type} severityNum={severity}/><ImpactingLabel bool={impacting} />
          </Item.Extra>
        </Item.Content>
      </Item>
    );
  }

  renderIncidents = () => {
    const panes = _.map(this.props.incidents, (route, routeNum) => {
      const paneData = route.map(this.generateIncidentItems);
      const incidentMapMarkers = route.map(this.renderIncidentMapMarkers);
      const selectedRouteData = this.props.routes[routeNum];

      const polyline = selectedRouteData ? selectedRouteData["overview_polyline"]["points"] : null;
      const center = selectedRouteData ? selectedRouteData["bounds"] : null;

      if (paneData.length !== 0)
        return { 
          menuItem: `Route ${Number(routeNum)+1}`, 
          render: () => (
            <Tab.Pane  
              as={Card}
              fluid
            >
              <Dimmer active={this.state.loading} inverted>
                <Loader size="medium"></Loader>
              </Dimmer>
              <PolylineMap
                key={routeNum} 
                polyline={polyline} 
                center={center}
              >
                {incidentMapMarkers}
              </PolylineMap>
              <Card.Content>
                <Divider horizontal>
                  <Header as="h4">
                    <Icon name="filter" />
                    Filter
                  </Header>
                </Divider>
                {this.toggleMarkerViews()}
                <Divider horizontal>
                  <Header as="h4">
                    <Icon name="search" />
                    All Incidents
                  </Header>
                </Divider>
                <Card.Description as={Item.Group} divided>
                  {paneData}
                </Card.Description>
              </Card.Content>
            </Tab.Pane>
          )
        };
      else
        return { 
          menuItem: `Route ${Number(routeNum)+1}`, 
          render: () => (
            <Tab.Pane as={Card} fluid>
              <Dimmer active={this.state.loading} inverted>
                <Loader size="medium"></Loader>
              </Dimmer>
              <PolylineMap key={routeNum} polyline={polyline} center={center} />
              <Card.Content>
                {this.noIncidentMessage()}
              </Card.Content>
            </Tab.Pane>
          )
        };
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
    // console.log(this.props.incidents);
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