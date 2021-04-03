import React from "react";
import {
  Button,
  Card,
  Icon,
  Table,
  Loader,
  Segment,
  Dimmer,
} from "semantic-ui-react";
import api from "../../lib/api";

const List: React.FC = () => {
  const [actions, setActions] = React.useState<Array<any>>([]);

  React.useEffect(() => {
    api.listSystemActions().then((data) => {
      setActions(data.data);
    });
  }, []);

  return (
    <>
      <Card fluid>
        <Card.Content>
          <Card.Header>System Actions</Card.Header>
        </Card.Content>
        <Card.Content>
          {(!actions || actions.length === 0) && (
            <Segment padded="very">
              <Dimmer active>
                <Loader content="Loading" />
              </Dimmer>
            </Segment>
          )}
          {actions && actions.length !== 0 && (
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Command</Table.HeaderCell>
                  <Table.HeaderCell>Requires Mention</Table.HeaderCell>
                  <Table.HeaderCell>Response</Table.HeaderCell>
                  <Table.HeaderCell>Edit</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {actions.map((data, idx) => {
                  return (
                    <Table.Row key={idx}>
                      <Table.Cell>{data.command}</Table.Cell>
                      <Table.Cell>
                        {data.requireMention ? (
                          <Icon name="check" color="green" />
                        ) : (
                          <Icon name="ban" color="red" />
                        )}
                      </Table.Cell>
                      <Table.Cell>{data.response}</Table.Cell>
                      <Table.Cell>
                        {data.editable ? (
                          <Icon name="edit" />
                        ) : (
                          <Icon name="ban" color="red" />
                        )}
                      </Table.Cell>
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
