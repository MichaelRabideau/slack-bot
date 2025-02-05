import React from "react";
import { Card, Table, Loader, Segment, Dimmer } from "semantic-ui-react";

interface ListProps {
  schedules: Array<any>;
}

const List: React.FC<ListProps> = ({ schedules }) => {
  return (
    <>
      <Card fluid>
        <Card.Content>
          <Card.Header>System Schedules</Card.Header>
        </Card.Content>
        <Card.Content>
          {(!schedules || schedules.length === 0) && (
            <Segment padded="very">
              <Dimmer active>
                <Loader content="Loading" />
              </Dimmer>
            </Segment>
          )}
          {schedules && schedules.length !== 0 && (
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Channel</Table.HeaderCell>
                  <Table.HeaderCell>Action</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {schedules.map((data, idx) => {
                  return (
                    <Table.Row key={idx}>
                      <Table.Cell>{data.name}</Table.Cell>
                      <Table.Cell>{data.channel}</Table.Cell>
                      <Table.Cell>{data.action}</Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          )}
        </Card.Content>
      </Card>
    </>
  );
};

export default List;
