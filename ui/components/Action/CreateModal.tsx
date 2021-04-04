import React from "react";
import {
  Button,
  Divider,
  Input,
  Form,
  Message,
  Modal,
  Segment,
} from "semantic-ui-react";
import api from "../../lib/api";
import type { Reply, Command } from "../../lib/api";

interface CreateModalProps {
  open: boolean;
  setOpen: (boolean) => void;
}

const CreateModal: React.FC<CreateModalProps> = ({ open, setOpen }) => {
  const [commands, setCommands] = React.useState<string[]>([""]);
  const [replies, setReplies] = React.useState<string[]>([""]);
  const [mention, setMention] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const maxOrs = 5;

  const handleCreateAction = async () => {
    setError("");
    setLoading(true);
    const commandsData: Command[] = [];
    commands.forEach((v) => {
      commandsData.push({
        command: v,
        exact: true,
        mention,
      });
    });

    const repliesData: Reply[] = [];
    replies.forEach((v) => {
      repliesData.push({
        reply: v,
      });
    });

    try {
      const res = await api.createAction({
        commands: commandsData,
        replies: repliesData,
      });
      setOpen(false);
    } catch (err) {
      if (err?.response?.data?.message) {
        setError(err.response.data?.message);
      } else {
        setError("Unknown error");
      }
    }
    setLoading(false);
  };

  React.useEffect(() => {
    setError("");
    setCommands([""]);
    setReplies([""]);
  }, [open]);

  return (
    <Modal
      onClose={() => {
        setOpen(false);
      }}
      onOpen={() => {
        setOpen(true);
      }}
      open={open}
    >
      <Modal.Header>Create a New Action</Modal.Header>
      <Modal.Content>
        {error !== "" && (
          <Message negative>
            <Message.Header>{error}</Message.Header>
          </Message>
        )}
        <Form loading={loading}>
          <Form.Field>
            <Segment>
              <h3>Inputs</h3>
              {commands.map((v, idx) => {
                return (
                  <>
                    <Input type="text" action key={idx}>
                      <input
                        value={commands[idx]}
                        placeholder="hi there"
                        onChange={(e) => {
                          commands[idx] = e.target.value;
                          setCommands([...commands]);
                        }}
                      />

                      {idx !== commands.length - 1 && (
                        <Button
                          icon="trash"
                          color="orange"
                          onClick={() => {
                            const deleted = [...commands];
                            deleted.splice(idx, 1);
                            setCommands(deleted);
                          }}
                        />
                      )}
                      {idx === commands.length - 1 && (
                        <Button
                          icon="plus"
                          color="teal"
                          disabled={maxOrs === commands.length}
                          onClick={() => {
                            commands.push("");
                            setCommands([...commands]);
                          }}
                        />
                      )}
                    </Input>
                    {idx !== commands.length - 1 && commands.length > 1 && (
                      <Divider horizontal>Or</Divider>
                    )}
                  </>
                );
              })}
            </Segment>
          </Form.Field>
          <Form.Field>
            <Segment>
              <h3>Replies</h3>
              {replies.map((v, idx) => {
                return (
                  <>
                    <Input type="text" action key={idx}>
                      <input
                        value={replies[idx]}
                        placeholder="hi there"
                        onChange={(e) => {
                          replies[idx] = e.target.value;
                          setReplies([...replies]);
                        }}
                      />

                      {idx === replies.length - 1 && (
                        <Button
                          icon="plus"
                          color="teal"
                          disabled={maxOrs === replies.length}
                          onClick={() => {
                            replies.push("");
                            setReplies([...replies]);
                          }}
                        />
                      )}
                      {idx !== replies.length - 1 && (
                        <Button
                          icon="trash"
                          color="orange"
                          onClick={() => {
                            const deleted = [...replies];
                            deleted.splice(idx, 1);
                            setReplies(deleted);
                          }}
                        />
                      )}
                    </Input>
                    {idx !== replies.length - 1 && replies.length > 1 && (
                      <Divider horizontal>Or</Divider>
                    )}
                  </>
                );
              })}
            </Segment>
          </Form.Field>
          <Form.Field>
            <label>Require Bot Mention</label>
            <input
              type="checkbox"
              onChange={(e) => setMention(e.target.checked)}
            />
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button color="black" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button
          content="Create"
          labelPosition="right"
          icon="checkmark"
          onClick={() => handleCreateAction()}
          positive
        />
      </Modal.Actions>
    </Modal>
  );
};

export default CreateModal;
