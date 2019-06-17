import React, { Component } from "react";
import { connect } from "react-redux";
import { Icon, Item, Tab, Header, Divider, Card, Label } from "semantic-ui-react";

import PolylineMap from "../common/GoogleMap/PolylineMap";

class DirectionSteps extends Component {

  state = { activeIndex: 0 };

  componentDidUpdate() {
    if (this.state.activeIndex !== 0 && this.state.activeIndex > this.props.routes.length-1) {
      // console.log(`activeIndex: ${this.state.activeIndex}`)
      this.setState({ activeIndex: 0 });
    }
  }

  renderSteps = () => {
    const labelStyle = { border: "none", margin: "0 0 0 0", padding: "0 3px 0 3px" };
    const routeSteps = this.props.routes.map((route, key) => {
      const stepArray = route["legs"]["0"]["steps"].map((step, key) => {
        return (
          <Item key={key}>
            <Item.Content>
              <Item.Header as="h4">{step.html_instructions.replace(
                /<\/?b>/g, "").replace(
                /<\/?div>/g, ""
                ).replace(/&nbsp;/g, "").replace(/<div style="font-size:0\.9em">/g, ", ").replace(/&amp;/g, "&")}
              </Item.Header>
              <Item.Extra>
                <Label content={step.duration.text} icon="time" basic color="teal" style={labelStyle}/>
                <Label content={step.distance.text} icon="road" basic color="teal" style={labelStyle}/>
              </Item.Extra>
            </Item.Content>
          </Item>
        );
      });
      const polyline = route["overview_polyline"]["points"];
      return (
        <React.Fragment>
          <PolylineMap key={key} polyline={polyline} center={route["bounds"]} />
          <Card.Content>
            <Divider horizontal>
              <Header as="h4">
                <Icon name="bar chart" />
                Stats
              </Header>
            </Divider>
            <Card.Description textAlign="center">
              <Label content={route["legs"]["0"]["distance"]["text"]} icon="road" basic style={labelStyle}/>
              <Label content={route["legs"]["0"]["duration"]["text"]} icon="clock outline" basic style={labelStyle}/>
            </Card.Description>
            <Divider horizontal>
              <Header as="h4">
                <Icon name="map outline" />
                Steps
              </Header>
            </Divider>
            <Card.Description as={Item.Group} divided>
              {stepArray}
            </Card.Description>
          
          </Card.Content>
        </React.Fragment>
      );
    });

    return routeSteps;
  }

  handleTabChange = (e, { activeIndex }) => this.setState({ activeIndex });

  renderTabs = () => {
    const routeContents = this.renderSteps();

    const panes = routeContents.map((content, routeNum) => {
      return { menuItem: `Route ${routeNum+1}`, render: () => <Tab.Pane as={Card} fluid>{content}</Tab.Pane>};
    })

    return (
      <Tab 
        menu={{ pointing: true }} 
        activeIndex={this.state.activeIndex}
        onTabChange={this.handleTabChange} 
        panes={panes} 
      />
    );
  }

  render() {
    if (!this.props.routes) {
      return null;
    }
    console.log("Component re-rendered");
    return (
      <div>
        
          {this.renderTabs()}
        
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { routes: state.maps.routes };
}

export default connect(mapStateToProps)(DirectionSteps);