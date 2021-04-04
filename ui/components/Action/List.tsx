import React from "react";
import {
  Button,
  Card,
  Icon,
  Table,
  Loader,
  Dimmer,
  Pagination,
} from "semantic-ui-react";
import CreateModal from "./CreateModal";
import api from "../../lib/api";

const List: React.FC = () => {
  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  const [actions, setActions] = React.useState<Array<any>>([]);
  const [page, setPage] = React.useState(1);
  const [totalItems, setTotalItems] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const pageSize = 10;

  React.useEffect(() => {
    if (openCreateModal) {
      return;
    }
    setLoading(true);
    api.listActions({ page, pageSize }).then((data) => {
      setActions(data.items);
      setTotalItems(data.total);
      setTotalPages(data.pages);
      setLoading(false);
    });
  }, [page, pageSize, openCreateModal]);

  return (
    <>
      <Card fluid>
        <Card.Content>
          <Card.Header>Actions</Card.Header>
        </Card.Content>
        <Card.Content>
          {loading && (
            <Dimmer active>
              <Loader content="Loading" />
            </Dimmer>
          )}
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Commands</Table.HeaderCell>
                <Table.HeaderCell>Replies</Table.HeaderCell>
                <Table.HeaderCell>Last Edited By</Table.HeaderCell>
                <Table.HeaderCell>Edit</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {actions.map((data, idx) => {
                return (
                  <Table.Row key={idx}>
                    <Table.Cell verticalAlign="top">
                      {data.commands.map((cmd, cidx) => {
                        {
                          return (
                            <p style={{ color: cidx !== 0 ? "grey" : "black" }}>
                              {cmd.command}
                            </p>
                          );
                        }
                      })}
                    </Table.Cell>
                    <Table.Cell verticalAlign="top">
                      {data.replies.map((reply, ridx) => {
                        {
                          return (
                            <p style={{ color: ridx !== 0 ? "grey" : "black" }}>
                              {reply.reply}
                            </p>
                          );
                        }
                      })}
                    </Table.Cell>
                    <Table.Cell>{data.edited_by}</Table.Cell>
                    <Table.Cell>
                      <Icon name="edit" />
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
            <Table.Footer fullWidth>
              <Table.Row>
                <Table.HeaderCell>
                  <Pagination
                    boundaryRange={0}
                    defaultActivePage={page}
                    ellipsisItem={null}
                    firstItem={null}
                    lastItem={null}
                    siblingRange={1}
                    totalPages={totalPages}
                    disabled={loading}
                    onPageChange={(_, data) => {
                      setPage(data.activePage as number);
                    }}
                  />
                </Table.HeaderCell>
                <Table.HeaderCell>Total: {totalItems}</Table.HeaderCell>
                <Table.HeaderCell colSpan="4">
                  <Button
                    floated="right"
                    icon
                    labelPosition="left"
                    primary
                    size="small"
                    onClick={() => {
                      setOpenCreateModal(true);
                    }}
                  >
                    <Icon name="plus" /> Add Action
                  </Button>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        </Card.Content>
      </Card>

      <CreateModal open={openCreateModal} setOpen={setOpenCreateModal} />
    </>
  );
};

export default List;
