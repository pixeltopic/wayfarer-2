import React, { Component } from "react";
import { Table, Icon, Popup } from "semantic-ui-react";

class Legend extends Component {

  generateLegend() {
    const rows = this.props.rowData.map((rowContent, key) => {
      return (
        <Table.Row key={key}>
          <Table.Cell textAlign="center">
            <Icon name={rowContent.name} color={rowContent.color || null} circular inverted />
          </Table.Cell>
          <Table.Cell>{rowContent.text}</Table.Cell>
        </Table.Row>
      );
    });

    return (
      <Table compact="very" basic="very" size="small" celled collapsing>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Symbol</Table.HeaderCell>
            <Table.HeaderCell>Meaning</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows}
        </Table.Body>
      </Table>
    );
  }

  render() {
    return (
      <Popup 
        trigger={<Icon size="large" color="teal" name="question circle outline" />}
        on="click"
        content={this.generateLegend()}
        position="bottom right"
      />
    );
  }
}

Legend.defaultProps = {
  rowData: [{ name: "question circle outline", color: "teal", text: "describe icon" }, { name: "question circle outline", text: "no color" }]
}

export default Legend;