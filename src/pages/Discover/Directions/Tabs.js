import React from "react";
import { Tab, Card, Icon, Item, Header, Divider, Label } from "semantic-ui-react";
import PolylineMap from "../../../components/GoogleMap/PolylineMap";

const steps = routes => {
  const labelStyle = { border: "none", margin: "0 0 0 0", padding: "0 3px 0 3px" };
    const routeSteps = routes.map((route, key) => {
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


const Tabs = ({ activeIndex, handleTabChange, tabContent }) => {
  const panes = steps(tabContent).map((content, routeNum) => {
    return {
      menuItem: `Route ${routeNum + 1}`,
      render: () => (
        <Tab.Pane as={Card} fluid>
          {content}
        </Tab.Pane>
      )
    };
  });

  return (
    <Tab
      menu={{ pointing: true }}
      activeIndex={activeIndex}
      onTabChange={handleTabChange}
      panes={panes}
    />
  );
};

export default Tabs;
