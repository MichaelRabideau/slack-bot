import React from "react";
import { withPageAuthRequired, UserProfile } from "@auth0/nextjs-auth0";
import Action from "../../components/Action";

interface ActionsProps {
  user: UserProfile;
}

export const getServerSideProps = withPageAuthRequired();

export default function Actions({ user }: ActionsProps) {
  return (
    <>
      <Action.List />
    </>
  );
}
