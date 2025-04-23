declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

export interface DecodedToken {
  id: number;
  email: string;
  username: string;
  role: string;
}

export {};