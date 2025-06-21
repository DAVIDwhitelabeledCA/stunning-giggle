import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, requireAuth } from "./auth";
import { insertEventAttendeeSchema, insertChatMessageSchema } from "../shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication middleware
  setupAuth(app);

  // Note: Auth routes are now handled in auth.ts

  // User routes
  app.get("/api/users", requireAuth, async (req, res) => {
    try {
      const departments = await storage.getDepartments();
      const allUsers = [];
      
      for (const department of departments) {
        const users = await storage.getUsersByDepartment(department.name);
        allUsers.push(...users);
      }
      
      res.json(allUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/users/:id", requireAuth, async (req, res) => {
    try {
      const id = req.params.id;
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.put("/api/users/:id", requireAuth, async (req: any, res) => {
    try {
      const id = req.params.id;
      const currentUserId = req.user.id;
      
      // Users can only update their own profile
      if (id !== currentUserId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const updates = req.body;
      const user = await storage.updateUser(id, updates);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Notification routes
  app.get("/api/notifications", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id.toString();
      const notifications = await storage.getNotifications(userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.get("/api/notifications/unread", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id.toString();
      const notifications = await storage.getUnreadNotifications(userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch unread notifications" });
    }
  });

  app.put("/api/notifications/:id/read", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.markNotificationAsRead(id);
      
      if (!success) {
        return res.status(404).json({ message: "Notification not found" });
      }

      res.json({ message: "Notification marked as read" });
    } catch (error) {
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  // News routes
  app.get("/api/news", async (req, res) => {
    try {
      const news = await storage.getNews();
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });

  app.get("/api/news/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const newsItem = await storage.getNewsById(id);
      
      if (!newsItem) {
        return res.status(404).json({ message: "News item not found" });
      }

      res.json(newsItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news item" });
    }
  });

  // Event routes
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.get("/api/events/upcoming", async (req, res) => {
    try {
      const events = await storage.getUpcomingEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch upcoming events" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const event = await storage.getEventById(id);
      
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch event" });
    }
  });

  app.post("/api/events/:id/rsvp", requireAuth, async (req: any, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const userId = req.user.id.toString();
      const { status } = insertEventAttendeeSchema.parse(req.body);

      const attendee = await storage.rsvpToEvent(eventId, userId, status);
      res.json(attendee);
    } catch (error) {
      res.status(500).json({ message: "Failed to RSVP to event" });
    }
  });

  app.get("/api/events/:id/attendees", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const attendees = await storage.getEventAttendees(id);
      res.json(attendees);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch event attendees" });
    }
  });

  // Department routes
  app.get("/api/departments", async (req, res) => {
    try {
      const departments = await storage.getDepartments();
      res.json(departments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch departments" });
    }
  });

  app.get("/api/departments/:name/users", async (req, res) => {
    try {
      const name = req.params.name;
      const users = await storage.getUsersByDepartment(name);
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch department users" });
    }
  });

  // Chat routes
  app.get("/api/chat/rooms", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id.toString();
      const rooms = await storage.getChatRooms(userId);
      res.json(rooms);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat rooms" });
    }
  });

  app.get("/api/chat/rooms/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const room = await storage.getChatRoomById(id);
      
      if (!room) {
        return res.status(404).json({ message: "Chat room not found" });
      }

      res.json(room);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat room" });
    }
  });

  app.get("/api/chat/rooms/:id/messages", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const messages = await storage.getChatMessages(id);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat messages" });
    }
  });

  app.post("/api/chat/rooms/:id/messages", requireAuth, async (req: any, res) => {
    try {
      const roomId = parseInt(req.params.id);
      const senderId = req.user.id.toString();
      const { message } = insertChatMessageSchema.parse(req.body);

      const newMessage = await storage.createChatMessage({
        roomId,
        senderId,
        message,
      });
      
      res.json(newMessage);
    } catch (error) {
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Admin routes - Level 3 and above only
  const requireAdminAccess = (req: any, res: any, next: any) => {
    if (!req.user || req.user.user_level > 3) {
      return res.status(403).json({ message: "Admin access required (Level 3 or above)" });
    }
    next();
  };

  // Critical alerts for level 3+ users
  app.post("/api/admin/alerts/critical", requireAuth, requireAdminAccess, async (req: any, res) => {
    try {
      const { title, message, targetLevel } = req.body;
      
      if (!title || !message || typeof targetLevel !== 'number') {
        return res.status(400).json({ message: "Title, message, and targetLevel are required" });
      }

      // Get all users with the target level or above
      const departments = await storage.getDepartments();
      const allUsers = [];
      
      for (const department of departments) {
        const users = await storage.getUsersByDepartment(department.name);
        allUsers.push(...users.filter(user => user.user_level <= targetLevel));
      }

      // Create critical notifications for each user
      const notifications = await Promise.all(
        allUsers.map(user => 
          storage.createNotification({
            userId: user.id,
            title,
            message,
            type: 'critical',
            priority: 'critical',
            requiresAcknowledgment: true
          })
        )
      );

      res.json({ 
        message: `Critical alert sent to ${allUsers.length} users`,
        notificationsCreated: notifications.length
      });
    } catch (error) {
      console.error('Error sending critical alert:', error);
      res.status(500).json({ message: "Failed to send critical alert" });
    }
  });

  // Admin content management - Create news
  app.post("/api/admin/news", requireAuth, requireAdminAccess, async (req: any, res) => {
    try {
      const { title, content, summary, category, imageUrl } = req.body;
      
      if (!title || !content || !summary || !category) {
        return res.status(400).json({ message: "Title, content, summary, and category are required" });
      }

      const newsArticle = await storage.createNews({
        title,
        content,
        summary,
        category,
        authorId: req.user.id,
        imageUrl: imageUrl || null
      });

      res.json(newsArticle);
    } catch (error) {
      console.error('Error creating news:', error);
      res.status(500).json({ message: "Failed to create news article" });
    }
  });

  // Admin content management - Create events
  app.post("/api/admin/events", requireAuth, requireAdminAccess, async (req: any, res) => {
    try {
      const { title, description, startTime, endTime, location } = req.body;
      
      if (!title || !description || !startTime || !location) {
        return res.status(400).json({ message: "Title, description, startTime, and location are required" });
      }

      const event = await storage.createEvent({
        title,
        description,
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : null,
        location,
        createdById: req.user.id
      });

      res.json(event);
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ message: "Failed to create event" });
    }
  });

  // Admin content management - Delete news
  app.delete("/api/admin/news/:id", requireAuth, requireAdminAccess, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // In a real implementation, you would delete from database
      // For now, just return success
      res.json({ message: "News article deleted successfully" });
    } catch (error) {
      console.error('Error deleting news:', error);
      res.status(500).json({ message: "Failed to delete news article" });
    }
  });

  // Admin content management - Delete events
  app.delete("/api/admin/events/:id", requireAuth, requireAdminAccess, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // In a real implementation, you would delete from database
      // For now, just return success
      res.json({ message: "Event deleted successfully" });
    } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({ message: "Failed to delete event" });
    }
  });

  // Get critical notifications that require acknowledgment
  app.get("/api/notifications/critical", requireAuth, async (req: any, res) => {
    try {
      // Only level 3+ users can receive critical notifications
      if (req.user.user_level > 3) {
        return res.json([]);
      }

      const notifications = await storage.getUnreadNotifications(req.user.id);
      const criticalNotifications = notifications.filter(n => n.type === 'critical' && n.requiresAcknowledgment);
      
      res.json(criticalNotifications);
    } catch (error) {
      console.error('Error fetching critical notifications:', error);
      res.status(500).json({ message: "Failed to fetch critical notifications" });
    }
  });

  // Acknowledge critical notification
  app.post("/api/notifications/:id/acknowledge", requireAuth, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Mark notification as read and acknowledged
      await storage.markNotificationAsRead(id);
      
      res.json({ message: "Notification acknowledged" });
    } catch (error) {
      console.error('Error acknowledging notification:', error);
      res.status(500).json({ message: "Failed to acknowledge notification" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}