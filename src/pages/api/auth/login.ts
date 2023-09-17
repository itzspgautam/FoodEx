import DbConnect from "@/config/databse";
import { NextApiRequest, NextApiResponse } from "next";
import { generateToken } from "@/utils/TokenUtils";
import admin from "@/config/firebaseAdmin";
import { UserModel } from "@/modals/UserModel";

const register = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      await DbConnect();

      //Token from client validation
      const { authorization } = req.headers;

      if (!authorization) {
        return res.status(401).json({
          success: false,
          message: "Token not received.",
        });
      }

      const firebaseToken = authorization.split(" ")[1];
      if (!firebaseToken) {
        return res.status(401).json({
          success: false,
          message: "Token not received.",
        });
      }

      //decoding firebase token received from client
      const decodedFirebaseToken = await admin
        .auth()
        .verifyIdToken(firebaseToken);

      console.log("Logged user", decodedFirebaseToken);
      let loggedUser = null;

      const isAlreadyRegistered = await UserModel.findOne({
        firebaseId: decodedFirebaseToken.uid,
      });
      //if user not exist save the user else procedd further
      if (!isAlreadyRegistered) {
        const newUser = new UserModel({
          firebaseId: decodedFirebaseToken.uid,
          email: decodedFirebaseToken.email,
          phone_number: decodedFirebaseToken.phone_number,
          name: decodedFirebaseToken.name,
          photoURL: decodedFirebaseToken.picture,
        });
        await newUser.save();
        loggedUser = newUser;
      } else {
        loggedUser = isAlreadyRegistered;
      }

      // generating jwt token from decoded firebase token data
      const token = generateToken({
        userId: loggedUser._id,
      });

      //send final status
      res.status(200).json({
        success: true,
        message: "Logged in successfully!",
        user: loggedUser,
        token,
      });
    } catch (error) {
      res.status(400).json({
        error,
        success: false,
        message: "Something went wrong!",
      });
    }
  }
};
export default register;
