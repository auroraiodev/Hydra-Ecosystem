import { Controller, Get, Post, Delete, Query, Body, Req, UseGuards } from '@nestjs/common';
import { Public } from '../auth/guards/jwt-auth.guard.js';
import { PresenceService } from './presence.service.js';
import { Request } from 'express';

@Controller('presence')
export class PresenceController {
  constructor(private readonly presenceService: PresenceService) {}

  @Get('check-ip')
  @Public()
  async checkIp(@Req() req: Request, @Query('ip') ipParam?: string) {
    const forwarded = req.headers['x-forwarded-for'] as string | undefined;
    const ip = ipParam || forwarded?.split(',')[0]?.trim() || req.socket.remoteAddress || '';
    const blocked = await this.presenceService.isIpBlocked(ip);
    return { blocked };
  }

  // --- Admin REST endpoints ---
  // Used by hydra-admin's presence page (/dashboard/presence)

  @Get('admin/presence/online')
  async getOnline() {
    const cutoff = new Date(Date.now() - 2 * 60 * 1000);
    const sessions = await this.presenceService.getOnlineFromDb(cutoff);
    return { data: sessions };
  }

  @Get('admin/presence/history')
  async getHistory(
    @Query('userId') userId?: string,
    @Query('page') page?: string,
    @Query('ip') ip?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const take = limit ? parseInt(limit, 10) : 25;
    const skip = offset ? parseInt(offset, 10) : 0;
    const where: Record<string, unknown> = {};
    if (userId) where.user_id = userId;
    if (page) where.page = { contains: page, mode: 'insensitive' };
    if (ip) where.ip_address = ip;
    if (from || to) {
      where.visited_at = {};
      if (from) (where.visited_at as Record<string, unknown>).gte = new Date(from);
      if (to) (where.visited_at as Record<string, unknown>).lte = new Date(to + 'T23:59:59.999Z');
    }

    const [visits, total] = await Promise.all([
      this.presenceService.getHistoryFromDb(where, take, skip),
      this.presenceService.countHistory(where),
    ]);
    return { data: { visits, total } };
  }

  @Get('admin/presence/blocked-ips')
  async getBlockedIps() {
    const ips = await this.presenceService.getBlockedIpsFromDb();
    return { data: ips };
  }

  @Post('admin/presence/block-ip')
  async blockIp(@Body() body: { ip: string; reason?: string }) {
    const ip = await this.presenceService.blockIp(body.ip, body.reason ?? undefined);
    return { data: ip };
  }

  @Delete('admin/presence/block-ip/:ip')
  async unblockIp(@Req() req: Request) {
    const ip = decodeURIComponent(req.params.ip);
    await this.presenceService.unblockIp(ip);
    return { data: true };
  }

  @Get('admin/presence/blocked-users')
  async getBlockedUsers() {
    const users = await this.presenceService.getBlockedUsersFromDb();
    return { data: users };
  }

  @Post('admin/presence/block-user')
  async blockUser(@Body() body: { userId: string; reason?: string }) {
    const user = await this.presenceService.blockUser(body.userId, body.reason ?? undefined);
    return { data: user };
  }

  @Delete('admin/presence/block-user/:userId')
  async unblockUser(@Req() req: Request) {
    const userId = decodeURIComponent(req.params.userId);
    await this.presenceService.unblockUser(userId);
    return { data: true };
  }
}
