import React from "react";
import { withPageAuthRequired, UserProfile } from "@auth0/nextjs-auth0";
import { Button, Card, Icon, Table, Loader, Dimmer } from "semantic-ui-react";

interface HomeProps {
  user: UserProfile;
}

export default function Home({ user }: HomeProps) {
  const [actions, setActions] = React.useState<Array<any>>([]);
  const [schedules, setSchedules] = React.useState<Array<any>>([]);

  React.useEffect(() => {
    if (user) {
      fetch("/api/bot/actions").then(async (res) => {
        const body = await res.json();
        setActions(body.data);
      });
      fetch("/api/bot/schedules").then(async (res) => {
        const body = await res.json();
        setSchedules(body.data);
      });
    }
  }, [user]);

  if (
    !actions ||
    actions.length === 0 ||
    !schedules ||
    schedules.length === 0
  ) {
    return (
      <Dimmer active>
        <Loader />
      </Dimmer>
    );
  }

  return (
    <>
      <Card fluid>
        <Card.Content>
          <Card.Header>Actions</Card.Header>
        </Card.Content>
        <Card.Content>
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
            <Table.Footer fullWidth>
              <Table.Row>
                <Table.HeaderCell />
                <Table.HeaderCell colSpan="4">
                  <Button
                    floated="right"
                    icon
                    labelPosition="left"
                    primary
                    size="small"
                  >
                    <Icon name="plus" /> Add Action
                  </Button>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        </Card.Content>
      </Card>
      <Card fluid>
        <Card.Content>
          <Card.Header>Schedules</Card.Header>
        </Card.Content>
        <Card.Content>
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
            <Table.Footer fullWidth>
              <Table.Row>
                <Table.HeaderCell />
                <Table.HeaderCell colSpan="4">
                  <Button
                    floated="right"
                    icon
                    labelPosition="left"
                    primary
                    size="small"
                  >
                    <Icon name="plus" /> Add Schedule
                  </Button>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        </Card.Content>
      </Card>
    </>
  );
}

export const getServerSideProps = withPageAuthRequired();
