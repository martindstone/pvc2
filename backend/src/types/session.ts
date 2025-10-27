import 'express-session';

// Define the User interface
export interface User {
  id: string;
  name: string;
  email?: string;
  // Add other user properties as needed
}

// Extend the express-session module
declare module 'express-session' {
  interface SessionData {
    user?: User;
    authorized?: boolean;
  }
}

// Export a custom session type for convenience
import { Session } from 'express-session';

export interface CustomSession extends Session {
  user?: User;
}