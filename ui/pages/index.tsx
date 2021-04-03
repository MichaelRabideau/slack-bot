import React from "react";
import { withPageAuthRequired, UserProfile } from "@auth0/nextjs-auth0";
import { Message } from "semantic-ui-react";

interface HomeProps {
  user: UserProfile;
}

export const getServerSideProps = withPageAuthRequired();

export default function Home({ user }: HomeProps) {
  return (
    <>
      <Message
        icon="shipping fast"
        header="Hi there!"
        content="Ayaya is still under construction <3"
      />
    </>
  );
}
