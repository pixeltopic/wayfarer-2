import React, { Component } from "react";
import { connect } from "react-redux";
import { Icon, Item, Tab } from "semantic-ui-react";

class DirectionSteps extends Component {

  renderSteps = () => {
    const routeSteps = this.props.routes.map((route) => {
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
      return stepArray;
    });

    return routeSteps;
  }

  renderTabs = () => {
    const routesSteps = this.renderSteps();

    const panes = routesSteps.map((routeContents, routeNum) => {
      return { menuItem: `Route ${routeNum+1}`, render: () => <Tab.Pane attached={false}><Item.Group divided>{routeContents}</Item.Group></Tab.Pane>}
    })

    return <Tab menu={{ pointing: true }} panes={panes} />
  }

  render() {
    if (!this.props.routes) {
      return null;
    }
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