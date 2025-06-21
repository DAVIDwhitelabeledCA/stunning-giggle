import {
  users,
  notifications,
  news,
  events,
  eventAttendees,
  departments,
  chatRooms,
  chatMessages,
  chatRoomMembers,
  type User,
  type InsertUser,
  type Notification,
  type InsertNotification,
  type News,
  type InsertNews,
  type Event,
  type InsertEvent,
  type EventAttendee,
  type InsertEventAttendee,
  type Department,
  type InsertDepartment,
  type ChatRoom,
  type InsertChatRoom,
  type ChatMessage,
  type InsertChatMessage,
  type ChatRoomMember,
  type InsertChatRoomMember,
} from "../shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export interface IStorage {
  // User authentication methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;
  validateUserCredentials(email: string, password: string): Promise<User | null>;
  
  // Notification methods
  getNotifications(userId: string): Promise<Notification[]>;
  getUnreadNotifications(userId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<boolean>;
  
  // News methods
  getNews(): Promise<News[]>;
  getNewsById(id: number): Promise<News | undefined>;
  createNews(news: InsertNews): Promise<News>;
  
  // Event methods
  getEvents(): Promise<Event[]>;
  getUpcomingEvents(): Promise<Event[]>;
  getEventById(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  rsvpToEvent(eventId: number, userId: string, status: string): Promise<EventAttendee>;
  getEventAttendees(eventId: number): Promise<EventAttendee[]>;
  
  // Department methods
  getDepartments(): Promise<Department[]>;
  getDepartmentById(id: number): Promise<Department | undefined>;
  createDepartment(department: InsertDepartment): Promise<Department>;
  getUsersByDepartment(departmentName: string): Promise<User[]>;
  
  // Chat methods
  getChatRooms(userId: string): Promise<ChatRoom[]>;
  getChatRoomById(id: number): Promise<ChatRoom | undefined>;
  createChatRoom(room: InsertChatRoom): Promise<ChatRoom>;
  getChatMessages(roomId: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  addUserToChatRoom(roomId: number, userId: string): Promise<ChatRoomMember>;
  getChatRoomMembers(roomId: number): Promise<ChatRoomMember[]>;
}

export class DatabaseStorage implements IStorage {
  private initialized = false;

  async initializeSampleData() {
    if (this.initialized) return;
    
    try {
      // Check if sample data already exists
      const existingNews = await db.select().from(news).limit(1);
      if (existingNews.length > 0) {
        this.initialized = true;
        return;
      }

      // Create sample news
      const sampleNews = [
        {
          title: "Company Quarterly Results Exceed Expectations",
          content: "Our Q4 results show remarkable growth with 35% increase in revenue and successful expansion into new markets. This achievement reflects our team's dedication and strategic planning.",
          summary: "Q4 results show 35% revenue growth and successful market expansion.",
          authorId: "admin-1",
          imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
          category: "company"
        },
        {
          title: "New Employee Wellness Program Launch",
          content: "Introducing comprehensive wellness benefits including gym memberships, mental health support, and flexible work arrangements to support work-life balance.",
          summary: "New wellness program includes gym memberships and mental health support.",
          authorId: "admin-1", 
          imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
          category: "hr"
        },
        {
          title: "Tech Innovation Day - March 15th",
          content: "Join us for presentations on AI integration, cloud infrastructure improvements, and upcoming product launches. All departments welcome.",
          summary: "Tech presentations on AI integration and product launches on March 15th.",
          authorId: "admin-1",
          imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400", 
          category: "tech"
        }
      ];

      for (const newsItem of sampleNews) {
        await db.insert(news).values(newsItem);
      }

      // Create sample events
      const sampleEvents = [
        {
          title: "All-Hands Company Meeting",
          description: "Monthly company update covering quarterly results, upcoming projects, and team recognitions. Refreshments provided.",
          startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
          location: "Main Conference Room / Virtual",
          organizerId: "admin-1",
          maxAttendees: 200
        },
        {
          title: "Team Building Workshop",
          description: "Interactive team building activities designed to strengthen collaboration and communication across departments.",
          startTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          endTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
          location: "Recreation Center", 
          organizerId: "admin-1",
          maxAttendees: 50
        },
        {
          title: "Lunch & Learn: Innovation Trends",
          description: "Guest speaker presentation on emerging technology trends and their impact on our industry. Lunch included.",
          startTime: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
          endTime: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000),
          location: "Auditorium",
          organizerId: "admin-1",
          maxAttendees: 100
        }
      ];

      for (const event of sampleEvents) {
        await db.insert(events).values(event);
      }

      // Create sample chat rooms
      const sampleChatRooms = [
        {
          name: "General Discussion",
          description: "Open chat for general company discussions and announcements",
          createdById: "admin-1",
          isPrivate: false
        },
        {
          name: "Engineering Team",
          description: "Technical discussions and project coordination",
          createdById: "admin-1", 
          isPrivate: false
        },
        {
          name: "Marketing & Sales",
          description: "Marketing campaigns and sales strategy discussions",
          createdById: "admin-1",
          isPrivate: false
        }
      ];

      for (const room of sampleChatRooms) {
        await db.insert(chatRooms).values(room);
      }

      // Create sample chat messages
      const chatRoomsList = await db.select().from(chatRooms);
      const sampleMessages = [
        {
          roomId: chatRoomsList[0]?.id || 1,
          senderId: "admin-1",
          message: "Welcome everyone! Feel free to share updates and ask questions here.",
          messageType: "text" as const
        },
        {
          roomId: chatRoomsList[1]?.id || 2,
          senderId: "admin-1",
          message: "Great work on the latest deployment! The new features are performing well.",
          messageType: "text" as const
        },
        {
          roomId: chatRoomsList[2]?.id || 3,
          senderId: "admin-1",
          message: "Q1 marketing campaign results are in - exceeded targets by 25%!",
          messageType: "text" as const
        }
      ];

      for (const message of sampleMessages) {
        await db.insert(chatMessages).values(message);
      }

      this.initialized = true;
    } catch (error) {
      console.error('Error initializing sample data:', error);
    }
  }
  // Initialize sample data on first access
  async getUser(id: string): Promise<User | undefined> {
    await this.initializeSampleData();
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    // Generate a unique ID for the user
    const userId = `user-${Date.now()}-${Math.random().toString(36).substring(2)}`;
    
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        id: userId,
      })
      .returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updated_at: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async validateUserCredentials(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.getUserByEmail(email);
      if (!user) return null;
      
      const isValid = await bcrypt.compare(password, user.password);
      
      if (isValid) {
        return user;
      }
      
      return null;
    } catch (error) {
      console.error('Error validating user credentials:', error);
      return null;
    }
  }

  // Notification methods
  async getNotifications(userId: string): Promise<Notification[]> {
    return await db.select().from(notifications).where(eq(notifications.userId, userId));
  }

  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    return await db.select().from(notifications)
      .where(eq(notifications.userId, userId) && eq(notifications.isRead, false));
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db
      .insert(notifications)
      .values(notification)
      .returning();
    return newNotification;
  }

  async markNotificationAsRead(id: number): Promise<boolean> {
    const result = await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id));
    return result.rowCount > 0;
  }

  // News methods
  async getNews(): Promise<News[]> {
    return await db.select().from(news);
  }

  async getNewsById(id: number): Promise<News | undefined> {
    const [newsItem] = await db.select().from(news).where(eq(news.id, id));
    return newsItem;
  }

  async createNews(newsData: InsertNews): Promise<News> {
    const [newNews] = await db
      .insert(news)
      .values(newsData)
      .returning();
    return newNews;
  }

  // Event methods
  async getEvents(): Promise<Event[]> {
    return await db.select().from(events);
  }

  async getUpcomingEvents(): Promise<Event[]> {
    const now = new Date();
    return await db.select().from(events)
      .where(eq(events.startTime, now));
  }

  async getEventById(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async createEvent(eventData: InsertEvent): Promise<Event> {
    const [newEvent] = await db
      .insert(events)
      .values(eventData)
      .returning();
    return newEvent;
  }

  async rsvpToEvent(eventId: number, userId: string, status: string): Promise<EventAttendee> {
    const [attendee] = await db
      .insert(eventAttendees)
      .values({ eventId, userId, status })
      .returning();
    return attendee;
  }

  async getEventAttendees(eventId: number): Promise<EventAttendee[]> {
    return await db.select().from(eventAttendees).where(eq(eventAttendees.eventId, eventId));
  }

  // Department methods
  async getDepartments(): Promise<Department[]> {
    return await db.select().from(departments);
  }

  async getDepartmentById(id: number): Promise<Department | undefined> {
    const [department] = await db.select().from(departments).where(eq(departments.id, id));
    return department;
  }

  async createDepartment(departmentData: InsertDepartment): Promise<Department> {
    const [newDepartment] = await db
      .insert(departments)
      .values(departmentData)
      .returning();
    return newDepartment;
  }

  async getUsersByDepartment(departmentName: string): Promise<User[]> {
    return await db.select().from(users).where(eq(users.department, departmentName));
  }

  // Chat methods
  async getChatRooms(userId: string): Promise<ChatRoom[]> {
    return await db.select().from(chatRooms)
      .innerJoin(chatRoomMembers, eq(chatRooms.id, chatRoomMembers.roomId))
      .where(eq(chatRoomMembers.userId, userId));
  }

  async getChatRoomById(id: number): Promise<ChatRoom | undefined> {
    const [room] = await db.select().from(chatRooms).where(eq(chatRooms.id, id));
    return room;
  }

  async createChatRoom(roomData: InsertChatRoom): Promise<ChatRoom> {
    const [newRoom] = await db
      .insert(chatRooms)
      .values(roomData)
      .returning();
    return newRoom;
  }

  async getChatMessages(roomId: number): Promise<ChatMessage[]> {
    return await db.select().from(chatMessages).where(eq(chatMessages.roomId, roomId));
  }

  async createChatMessage(messageData: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = await db
      .insert(chatMessages)
      .values(messageData)
      .returning();
    return newMessage;
  }

  async addUserToChatRoom(roomId: number, userId: string): Promise<ChatRoomMember> {
    const [member] = await db
      .insert(chatRoomMembers)
      .values({ roomId, userId })
      .returning();
    return member;
  }

  async getChatRoomMembers(roomId: number): Promise<ChatRoomMember[]> {
    return await db.select().from(chatRoomMembers).where(eq(chatRoomMembers.roomId, roomId));
  }
}

export const storage = new DatabaseStorage();