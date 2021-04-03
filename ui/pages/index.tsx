import React from "react";
import { withPageAuthRequired, UserProfile } from "@auth0/nextjs-auth0";
import api from "../lib/api";
import Action from "../components/Action";
import Schedule from "../components/Schedule";

interface HomeProps {
  user: UserProfile;
}

export const getServerSideProps = withPageAuthRequired();

export default function Home({ user }: HomeProps) {
  const [schedules, setSchedules] = React.useState<Array<any>>([]);

  React.useEffect(() => {
    if (user) {
      api.listSchedules().then((data) => {
        setSchedules(data.data);
      });
    }
  }, [user]);

  return (
    <>
      <Action.List />
      <Schedule.List schedules={schedules} />
    </>
  );
}
