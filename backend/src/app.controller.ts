import { AppService } from "./app.service";
import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";
import * as fs from 'fs';
import * as path from 'path';

@Controller()
export class AppController {
  constructor(private readonly dbService: AppService) { }

  @Get("health-check")
  healthCheck(): string {
    return this.dbService.healthCheck();
  }

  // Get the API routes dashboard HTML page
  @Get("app-dashboard")
  async getAppDashboard(@Res() res: Response) {
    try {
      const dashboardPath = path.join(process.cwd(), 'src/api-schema/docs/dashboard.html');

      if (fs.existsSync(dashboardPath)) {
        const htmlContent = fs.readFileSync(dashboardPath, 'utf8');
        res.setHeader('Content-Type', 'text/html');
        res.send(htmlContent);
      } else {
        res.status(404).json({
          error: 'Dashboard not found',
          message: 'Please run the route generation script first',
          path: dashboardPath
        });
      }
    } catch (error: any) {
      res.status(500).json({
        error: 'Failed to load dashboard',
        message: error.message
      });
    }
  }
}
