import axios from "axios";

const listSystemActions = async () => {
  const res = await axios.get("/api/bot/system/actions");
  return res.data;
};

interface ListActionsParam {
  page?: number;
  pageSize?: number;
}

const listActions = async (param: ListActionsParam) => {
  const res = await axios.get("/api/bot/actions", {
    params: {
      page: param.page ?? 1,
      page_size: param.pageSize ?? 25,
    },
  });
  return res.data;
};

interface CreateActionData {
  command: string;
  response: string;
  mention: boolean;
}

const createAction = async (data: CreateActionData) => {
  const res = await axios.post("/api/bot/actions", data);
  return res.data;
};

const listSchedules = async () => {
  const res = await axios.get("/api/bot/schedules");
  return res.data;
};

export default {
  listSystemActions,
  listActions,
  createAction,
  listSchedules,
};
