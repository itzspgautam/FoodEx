import DbConnect from "@/config/databse";
import { UserModel } from "@/modals/UserModel";
import { verifyToken } from "@/utils/TokenUtils";
import { NextApiRequest, NextApiResponse } from "next";

declare module "next" {
  interface NextApiRequest {
    user?: any; // Replace YourUserModelType with the type of your user model
  }
}

// Middleware to verify the token
const authHandle = (
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      let token = "";

      // Check for token in headers for POST requests
      if (req.method === "POST") {
        token = req.headers.authorization?.replace("Bearer ", "") || "";
      }

      // Check for token in query parameters for GET requests
      if (req.method === "GET" || req.method === "PUT") {
        token = req.query.token as string;
      }

      if (!token) {
        res
          .status(401)
          .json({ uccess: false, message: "Unauthorized: Token not found" });
        return;
      }

      const decodedToekn: any = await verifyToken({ token });
      await DbConnect();
      const user = await UserModel.findById(decodedToekn?.userId);
      if (!user) {
        res.status(401).json({ success: false, message: "User not found!" });
        return;
      }
      req.user = user;
      return await handler(req, res);
    } catch (error) {
      console.log(error);
      res
        .status(401)
        .json({ success: false, message: "Unauthorized: Invalid token" });
    }
  };
};

export default authHandle;
