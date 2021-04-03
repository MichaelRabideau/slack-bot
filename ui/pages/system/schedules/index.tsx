import React from "react";
import { withPageAuthRequired, UserProfile } from "@auth0/nextjs-auth0";
import SystemSchedule from "../../../components/SystemSchedule";
import api from "../../../lib/api";

interface SystemSchedulesProps {
  user: UserProfile;
}

export const getServerSideProps = withPageAuthRequired();

export default function SystemSchedules({ user }: SystemSchedulesProps) {
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
      <SystemSchedule.List schedules={schedules} />
    </>
  );
}
