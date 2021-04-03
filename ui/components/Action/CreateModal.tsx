import React from "react";
import { Button, Form, Message, Modal } from "semantic-ui-react";
import api from "../../lib/api";

interface CreateModalProps {
  open: boolean;
  setOpen: (boolean) => void;
}

const CreateModal: React.FC<CreateModalProps> = ({ open, setOpen }) => {
  const [command, setCommand] = React.useState<string>();
  const [response, setResponse] = React.useState<string>();
  const [mention, setMention] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleCreateAction = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await api.createAction({
        command,
        response,
        mention,
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

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
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
            <label>Command (no regex yet soz)</label>
            <input
              placeholder="hi there"
              onChange={(e) => setCommand(e.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <label>Response</label>
            <input
              placeholder="hi back to you my dude"
              onChange={(e) => setResponse(e.target.value)}
            />
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
