import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWaitlistSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Waitlist API endpoints
  app.post("/api/waitlist", async (req, res) => {
    try {
      const result = insertWaitlistSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ 
          success: false, 
          message: validationError.message 
        });
      }
      
      const entry = await storage.createWaitlistEntry(result.data);
      
      return res.status(201).json({ 
        success: true, 
        message: "Successfully joined the waitlist!",
        entry
      });
    } catch (error) {
      if (error instanceof Error && error.message === "Email already exists in waitlist") {
        return res.status(409).json({ 
          success: false,
          message: "This email is already on our waitlist." 
        });
      }
      
      console.error("Error adding to waitlist:", error);
      return res.status(500).json({ 
        success: false, 
        message: "An error occurred while joining the waitlist. Please try again." 
      });
    }
  });
  
  app.get("/api/waitlist/count", async (req, res) => {
    try {
      const count = await storage.getWaitlistCount();
      
      // Add some initial "fake" count to make the waitlist look more appealing
      const displayCount = count + 350;
      
      return res.status(200).json({ 
        success: true, 
        count: displayCount 
      });
    } catch (error) {
      console.error("Error getting waitlist count:", error);
      return res.status(500).json({ 
        success: false, 
        message: "An error occurred while getting the waitlist count." 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
