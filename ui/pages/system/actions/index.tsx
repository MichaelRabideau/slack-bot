import React from "react";
import { withPageAuthRequired, UserProfile } from "@auth0/nextjs-auth0";
import SystemAction from "../../../components/SystemAction";

interface SystemActionsProps {
  user: UserProfile;
}

export const getServerSideProps = withPageAuthRequired();

export default function SystemActions({ user }: SystemActionsProps) {
  return (
    <>
      <SystemAction.List />
    </>
  );
}
