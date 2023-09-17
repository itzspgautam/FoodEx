import jwt from "jsonwebtoken";

interface generateTokenProps {
  userId: string;
}

export interface verifyTokenProps {
  token: string;
}

const SECRET: any = process.env.JWT_SECRET || null;

const generateToken = (generate: generateTokenProps) => {
  const expiresIn = "60d";
  const token = jwt.sign(generate, SECRET, { expiresIn });
  return token;
};

const verifyToken = async (verify: verifyTokenProps) => {
  try {
    const decodedToken = await jwt.verify(verify.token, SECRET);
    return decodedToken;
  } catch (error) {
    console.log(error);
  }
};

export { generateToken, verifyToken };
