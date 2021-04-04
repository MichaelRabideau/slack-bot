import React from "react";
import { UserProvider } from "@auth0/nextjs-auth0";
import "semantic-ui-css/semantic.min.css";
import { Button, Container, Dropdown, Menu, Image } from "semantic-ui-react";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Menu fixed="top" inverted>
        <Container>
          <Menu.Item as="a" href="/" header>
            <Image
              size="mini"
              src="https://www.streamscheme.com/wp-content/uploads/2020/10/ayaya-emote.png"
              style={{ marginRight: "1.5em" }}
            />
            Ayaya
          </Menu.Item>
          <Dropdown item simple text="Actions">
            <Dropdown.Menu>
              <Dropdown.Item as="a" href="/actions">
                Browse
              </Dropdown.Item>
              <Dropdown.Item as="a" href="/system/actions">
                System
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown item simple text="Schedules">
            <Dropdown.Menu>
              <Dropdown.Item as="a" href="/system/schedules">
                System
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Menu.Menu position="right">
            <Menu.Item>
              <Button as="a" href="/api/auth/logout">
                Logout
              </Button>
            </Menu.Item>
          </Menu.Menu>
        </Container>
      </Menu>
      <Container style={{ marginTop: "7em" }}>
        <UserProvider>
          <Component {...pageProps} />
        </UserProvider>
      </Container>
    </>
  );
}
