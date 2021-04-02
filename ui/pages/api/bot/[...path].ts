import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import axios, { Method } from "axios";

const API_SERVER = process.env.API_SERVER;

export default withApiAuthRequired(
  async (req: NextApiRequest, res: NextApiResponse<any>) => {
    const { path } = req.query;
    const user = getSession(req, res);

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

    try {
      const response = await axios.request({
        method,
        url: Array.isArray(path) ? path.join("/") : path,
        baseURL: API_SERVER,
        headers: {
          authorization: `Bearer ${user.idToken}`,
        },
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
