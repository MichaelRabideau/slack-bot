import { handleAuth, handleLogin } from "@auth0/nextjs-auth0";

export default handleAuth({
  async login(req, res) {
    console.log(process.env.AUTH0_SCOPE);
    console.log(process.env.AUTH0_AUDIENCE);
    try {
      await handleLogin(req, res, {
        authorizationParams: {
          audience: process.env.AUTH0_AUDIENCE,
          scope: process.env.AUTH0_SCOPE,
        },
      });
    } catch (error) {
      res.status(error.status || 500).send(error.message);
    }
  },
});
