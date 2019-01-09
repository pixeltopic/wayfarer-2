import React, { Component } from "react";
import { connect } from "react-redux";
import { Icon, Item, Tab } from "semantic-ui-react";

import RenderGoogleMap from "../common/GoogleMap/RenderGoogleMap";

class DirectionSteps extends Component {

  state = { activeIndex: 0 };

  componentDidUpdate() {
    if (this.state.activeIndex !== 0 && this.state.activeIndex > this.props.routes.length-1) {
      // console.log(`activeIndex: ${this.state.activeIndex}`)
      this.setState({ activeIndex: 0 });
    }
  }

  renderSteps = () => {
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
                <Icon color="teal" name="time" />{step.duration.text}{" "}
                <Icon color="teal" name="road" />{step.distance.text}
              </Item.Extra>
            </Item.Content>
          </Item>
        );
      });
      const polyline = route["overview_polyline"]["points"];
      return (
        <React.Fragment>
          <RenderGoogleMap key={key} markers={polyline} center={route["bounds"]} />
          <Item.Group divided>{stepArray}</Item.Group>


        </React.Fragment>
      );
    });

    return routeSteps;
  }

  handleTabChange = (e, { activeIndex }) => this.setState({ activeIndex });

  renderTabs = () => {
    const routeContents = this.renderSteps();

    const panes = routeContents.map((content, routeNum) => {
      return { menuItem: `Route ${routeNum+1}`, render: () => <Tab.Pane attached={false}>{content}</Tab.Pane>};
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