import React from "react";
import { UserProvider } from "@auth0/nextjs-auth0";
import "semantic-ui-css/semantic.min.css";
import { Container, Menu, Image } from "semantic-ui-react";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Menu fixed="top" inverted>
        <Container>
          <Menu.Item as="a" header>
            <Image
              size="mini"
              src="https://www.streamscheme.com/wp-content/uploads/2020/10/ayaya-emote.png"
              style={{ marginRight: "1.5em" }}
            />
            Ayaya
          </Menu.Item>
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
