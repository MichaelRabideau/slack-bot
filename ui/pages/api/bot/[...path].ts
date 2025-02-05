import {
  withApiAuthRequired,
  getSession,
  getAccessToken,
} from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import axios, { Method } from "axios";

const API_SERVER = process.env.API_SERVER;

export default withApiAuthRequired(
  async (req: NextApiRequest, res: NextApiResponse<any>) => {
    const { path } = req.query;
    delete req.query.path;
    try {
      const user = await getAccessToken(req, res);

      let method: Method;
      if (req.method.toLowerCase() === "get") {
        method = "get";
      } else if (req.method.toLowerCase() === "post") {
        method = "post";
      } else if (req.method.toLowerCase() === "put") {
        method = "put";
      } else {
        res.status(400).json({ message: "unexpected http verb" });
      }

      const response = await axios.request({
        method,
        url: Array.isArray(path) ? path.join("/") : path,
        baseURL: API_SERVER,
        headers: {
          authorization: `Bearer ${user.accessToken}`,
        },
        data: req.body,
        params: req.query,
      });
      res.status(response.status).json(response.data);
    } catch (err) {
      if (err.response) {
        res.status(err.response.status).json(err.response.data);
      } else {
        res.status(500).json({ message: "unknown error" });
      }
    }
  }
);
