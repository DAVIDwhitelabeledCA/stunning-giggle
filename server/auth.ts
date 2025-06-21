import express from "express";
import session from "express-session";
import bcrypt from "bcrypt";
import { storage } from "./storage";
import type { User, LoginUser, InsertUser } from "../shared/schema";

declare global {
  namespace Express {
    interface User {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
      department: string;
      userLevel: number;
    }
  }
}

export function setupAuth(app: express.Express) {
  // Setup session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-for-dev',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Login endpoint
  app.post('/api/login', async (req, res) => {
    try {
      const { email, password } = req.body as LoginUser;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const user = await storage.validateUserCredentials(email, password);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Store user in session (excluding password)
      (req.session as any).user = {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        department: user.department,
        userLevel: user.user_level
      };

      res.json({
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        department: user.department,
        userLevel: user.user_level,
        status: user.status
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Register endpoint
  app.post('/api/register', async (req, res) => {
    try {
      const { first_name, last_name, email, password, department } = req.body;
      
      if (!first_name || !last_name || !email || !password || !department) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await storage.createUser({
        first_name,
        last_name,
        email,
        password: hashedPassword,
        department,
        user_level: 6 // Default to unassigned
      });

      // Store user in session (excluding password)
      (req.session as any).user = {
        id: newUser.id,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        email: newUser.email,
        department: newUser.department,
        userLevel: newUser.user_level
      };

      res.status(201).json({
        id: newUser.id,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        email: newUser.email,
        department: newUser.department,
        userLevel: newUser.user_level,
        status: newUser.status
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Logout endpoint
  app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Get current user endpoint
  app.get('/api/user', (req, res) => {
    const user = (req.session as any)?.user;
    
    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    res.json(user);
  });

  // Alternative endpoint for compatibility
  app.get('/api/auth/user', (req, res) => {
    const user = (req.session as any)?.user;
    
    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    res.json(user);
  });
}

// Authentication middleware
export function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const user = (req.session as any)?.user;
  
  if (!user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  req.user = user;
  next();
}

// Authorization middleware
export function requireUserLevel(minLevel: number) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user = (req.session as any)?.user;
    
    if (!user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (user.userLevel > minLevel) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    req.user = user;
    next();
  };
}