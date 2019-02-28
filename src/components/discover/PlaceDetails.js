import React, { Component } from "react";
import { connect } from "react-redux";
import { Tab, Card, Icon, Button, Table, Item, Rating, Label, List, Divider, Grid } from "semantic-ui-react";

import BasicMap from "../common/GoogleMap/BasicMap";
import Marker from "../common/GoogleMap/Marker";

import { updateActiveDiscover } from "../../actions";

class PlaceDetails extends Component {

  pricingInfo = pricing => {
    switch(pricing) {
        case 0: return (<React.Fragment><Icon name="money"/>Free</React.Fragment>);
        case 1: return (<React.Fragment><Icon name="money" color="green"/>Inexpensive</React.Fragment>);
        case 2: return (<React.Fragment><Icon name="money" color="olive"/>Moderately Priced</React.Fragment>);
        case 3: return (<React.Fragment><Icon name="money" color="orange"/>Expensive</React.Fragment>);
        case 4: return (<React.Fragment><Icon name="money" color="red"/>Very Expensive</React.Fragment>);
        default: return (<React.Fragment><Icon name="money" />No Pricing Info Found</React.Fragment>);
    }
  }

  pricingColor = pricing => {
    switch(pricing) {
        case 1: return "green";
        case 2: return "olive";
        case 3: return "orange";
        case 4: return "red";
        default: return null;
    }
  }

  pricingText = pricing => {
    switch(pricing) {
        case 0: return "Free";
        case 1: return "Inexpensive";
        case 2: return "Moderately Priced";
        case 3: return "Expensive";
        case 4: return "Very Expensive";
        default: return "No Pricing Info Found";
    }
  }

  renderMapPane = () => {
    const { geometry, rating, name, formatted_address, formatted_phone_number, website, opening_hours, price_level } = this.props.placeDetails;

    return (
      <Tab.Pane as={Card} fluid>
        {geometry.location && <BasicMap center={geometry.location}>
          <Marker lat={geometry.location.lat} lng={geometry.location.lng} iconName="marker" iconColor="red"/>
        </BasicMap>}
        <Card.Content>
          <Card.Header>{name}</Card.Header>
          <Card.Meta>
            {formatted_address}
          </Card.Meta>
          {!opening_hours && <Card.Description>
            <p>
              <Icon name="calendar outline" color="olive" />
              {opening_hours ? (opening_hours.open_now ? "Open Now" : "Closed") : "No opening hour data found" }
            </p>
            <p>
              <Icon name="heart outline" color="pink" />Rating: {rating === 0 ? "0" : rating}/5
            </p>
            {(price_level || price_level === 0) && <p>
              {this.pricingInfo(price_level)}
            </p>}
            <p>
              <Icon name="phone" color="orange" />{formatted_phone_number}
            </p>
            {website && <p>
              <Icon name="linkify" color="green"/><a href={website} target="_blank" rel="noopener noreferrer">Official Website</a>
            </p>}
          </Card.Description>}
          {opening_hours && opening_hours.weekday_text && <Card.Description>
            <Grid columns={2} relaxed='very'>
              <Grid.Column as={List} relaxed>
                <List.Item>
                  <List.Icon name="calendar outline" color="olive" />
                  <List.Content>
                    <List.Description>
                      {opening_hours ? (opening_hours.open_now ? "Open Now" : "Closed") : "No opening hour data found" }
                    </List.Description>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Icon name="heart outline" color="pink" />
                  <List.Content>
                    <List.Description>
                      Rating: {rating === 0 ? "0" : rating}/5
                    </List.Description>
                  </List.Content>
                </List.Item>
                {(price_level || price_level === 0) && <List.Item>
                  <List.Icon name="money" color={this.pricingColor(price_level)} />
                  <List.Content>
                    <List.Description>
                      {this.pricingText(price_level)}
                    </List.Description>
                  </List.Content>
                </List.Item>}
                {formatted_phone_number && <List.Item>
                  <List.Icon name="phone" color="orange" />
                  <List.Content>
                    <List.Description>
                      {formatted_phone_number}
                    </List.Description>
                  </List.Content>
                </List.Item>}
                {website && <List.Item>
                  <List.Icon name="linkify" color="green"/>
                  <List.Content>
                    <List.Description>
                      <a href={website} target="_blank" rel="noopener noreferrer">Official Website</a>
                    </List.Description>
                  </List.Content>
                </List.Item>}
              </Grid.Column>
              <Grid.Column textAlign="right">
                <List relaxed floated="right">
                  {opening_hours.weekday_text.map((str, key) => (
                    <List.Item key={key}>
                      <List.Content>
                        <List.Description><b>{str.substr(0,str.indexOf(" ")-1)}</b>{" "}{str.substr(str.indexOf(" ")+1)}</List.Description>
                      </List.Content>
                    </List.Item>
                  ))}
                </List>
              </Grid.Column>
            </Grid>
            <Divider vertical hidden></Divider>
          </Card.Description>}
        </Card.Content>
        <Card.Content extra>
          <Button basic primary onClick={() => this.props.updateActiveDiscover("places")}>Back</Button>
        </Card.Content>
      </Tab.Pane>
    );
  }

  renderOpeningHoursPane = () => {
    const { opening_hours } = this.props.placeDetails;

    return (
      <Tab.Pane as={Card} fluid>
        <Card.Content>
          <Card.Header>Opening Hours</Card.Header>
          
          <Card.Description as={Table} basic='very' celled>
          
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Day</Table.HeaderCell>
                <Table.HeaderCell>Time</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {opening_hours.weekday_text.map((str, key) => (
                <Table.Row key={key}>
                  <Table.Cell>{str.substr(0,str.indexOf(" ")-1)}</Table.Cell>
                  <Table.Cell>{str.substr(str.indexOf(" ")+1)}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>            
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Button basic primary onClick={() => this.props.updateActiveDiscover("places")}>Back</Button>
        </Card.Content>
      </Tab.Pane>

    );
  }

  renderReviewsPane = () => {
    const { reviews } = this.props.placeDetails;

    return (
      <Tab.Pane as={Card} fluid>
        <Card.Content>
          <Card.Description as={Item.Group} divided>
            {reviews.map((review, key) => (
              <Item key={key}>
                <Item.Image size="tiny" alt="Profile_Pic" src={review.profile_photo_url} />
                <Item.Content>
                  <Item.Header as='a' href={review.author_url} target="_blank" rel="noopener noreferrer">
                    {review.author_name}{"  "}
                    <Label size="mini" basic pointing="left">
                      {review.relative_time_description}
                    </Label>
                  </Item.Header>
                  <Item.Meta>
                    <Rating icon="heart" disabled defaultRating={review.rating} maxRating={5} />
                  </Item.Meta>
                  <Item.Description>
                    {review.text}
                  </Item.Description>
                </Item.Content>
              </Item>
            ))}
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Button basic primary onClick={() => this.props.updateActiveDiscover("places")}>Back</Button>
        </Card.Content>
      </Tab.Pane>
    );
  }


  render() {
    if (!this.props.placeDetails) {
      return null;
    }
    let panes = [{ menuItem: "Info", render: () => this.renderMapPane() }];
    const { opening_hours, reviews } = this.props.placeDetails;
    if (opening_hours && opening_hours.weekday_text) {
      panes = panes.concat([{ menuItem: 'Opening Hours', render: () => this.renderOpeningHoursPane() }]);
    }
    if (reviews && reviews.length > 0) {
      panes = panes.concat([{ menuItem: 'Reviews', render: () => this.renderReviewsPane() }]);
    }
    return (
      <Tab menu={{ pointing: true }} panes={panes} />
    );
  }
}

const mapStateToProps = (state) => {
  return { placeDetails: state.places.placeDetails };
}

export default connect(mapStateToProps, { updateActiveDiscover })(PlaceDetails);