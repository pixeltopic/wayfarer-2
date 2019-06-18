import React from "react";
import { Tab, Card } from "semantic-ui-react";

import steps from "./steps";

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
