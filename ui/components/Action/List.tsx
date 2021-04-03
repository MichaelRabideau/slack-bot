import React from "react";
import {
  Button,
  Card,
  Icon,
  Table,
  Loader,
  Segment,
  Dimmer,
  Pagination,
} from "semantic-ui-react";
import CreateModal from "./CreateModal";
import api from "../../lib/api";

const List: React.FC = () => {
  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  const [actions, setActions] = React.useState<Array<any>>([]);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [totalItems, setTotalItems] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);
  const [hasNext, setHasNext] = React.useState(false);
  const [hasPrevious, setHasPrevious] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    api.listActions({ page, pageSize }).then((data) => {
      setActions(data.items);
      setTotalItems(data.total);
      setTotalPages(data.pages);
      setHasNext(data.has_next);
      setHasPrevious(data.has_previous);
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
                      {data.mention ? (
                        <Icon name="check" color="green" />
                      ) : (
                        <Icon name="ban" color="red" />
                      )}
                    </Table.Cell>
                    <Table.Cell>{data.response}</Table.Cell>
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
