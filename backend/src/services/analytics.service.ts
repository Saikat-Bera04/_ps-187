import { prisma } from '../config/database';

export class AnalyticsService {
  static async getAlertAnalytics(startDate?: string, endDate?: string) {
    const where: any = {};
    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = new Date(startDate);
      if (endDate) where.timestamp.lte = new Date(endDate);
    }

    const alerts = await prisma.alert.findMany({ where, select: { severity: true, timestamp: true, status: true } });

    // Group by hour
    const hourMap: Record<string, number> = {};
    alerts.forEach((a) => {
      const hour = `${a.timestamp.getHours().toString().padStart(2, '0')}:00`;
      hourMap[hour] = (hourMap[hour] || 0) + 1;
    });

    const alertsByHour = Object.entries(hourMap)
      .map(([hour, count]) => ({ hour, count }))
      .sort((a, b) => a.hour.localeCompare(b.hour));

    return { alertsByHour, totalAlerts: alerts.length };
  }

  static async getEventAnalytics(startDate?: string, endDate?: string) {
    const where: any = {};
    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = new Date(startDate);
      if (endDate) where.timestamp.lte = new Date(endDate);
    }

    const events = await prisma.event.findMany({
      where,
      select: { eventType: true, objectType: true, timestamp: true, severity: true },
    });

    // Group by day
    const dayMap: Record<string, { persons: number; vehicles: number; intrusions: number; anpr: number }> = {};
    events.forEach((e) => {
      const date = e.timestamp.toISOString().split('T')[0];
      if (!dayMap[date]) dayMap[date] = { persons: 0, vehicles: 0, intrusions: 0, anpr: 0 };
      if (e.objectType === 'PERSON') dayMap[date].persons++;
      if (e.objectType === 'VEHICLE') dayMap[date].vehicles++;
      if (e.eventType === 'INTRUSION') dayMap[date].intrusions++;
      if (e.eventType === 'ANPR_MATCH') dayMap[date].anpr++;
    });

    const eventsByDay = Object.entries(dayMap)
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Threat distribution
    const threatDist: Record<string, number> = {};
    events.forEach((e) => {
      threatDist[e.severity] = (threatDist[e.severity] || 0) + 1;
    });

    const colorMap: Record<string, string> = { CRITICAL: '#FF5C67', HIGH: '#FF8A4C', MEDIUM: '#F4C95D', LOW: '#63A8FF' };
    const threatDistribution = Object.entries(threatDist).map(([name, value]) => ({
      name,
      value,
      color: colorMap[name] || '#37B9FF',
    }));

    return { eventsByDay, threatDistribution, totalEvents: events.length };
  }

  static async getIntrusionAnalytics(startDate?: string, endDate?: string) {
    const where: any = { eventType: 'INTRUSION' };
    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = new Date(startDate);
      if (endDate) where.timestamp.lte = new Date(endDate);
    }

    const intrusions = await prisma.event.findMany({
      where,
      include: { bop: { select: { code: true } }, camera: { select: { cameraCode: true } } },
      orderBy: { timestamp: 'desc' },
    });

    return {
      totalIntrusions: intrusions.length,
      intrusions: intrusions.map((i) => ({
        eventId: i.eventCode,
        bopId: i.bop.code,
        cameraId: i.camera.cameraCode,
        timestamp: i.timestamp.toISOString(),
        severity: i.severity,
        threatScore: i.threatScore,
      })),
    };
  }

  static async getCameraAnalytics() {
    const cameras = await prisma.camera.findMany({ select: { status: true, aiStatus: true } });
    const total = cameras.length;
    const online = cameras.filter((c) => c.status === 'ONLINE').length;
    const offline = cameras.filter((c) => c.status === 'OFFLINE').length;
    const degraded = cameras.filter((c) => c.status === 'DEGRADED').length;
    const aiActive = cameras.filter((c) => c.aiStatus === 'ACTIVE').length;

    return { total, online, offline, degraded, aiActive };
  }

  static async getBopAnalytics() {
    const bops = await prisma.bop.findMany({
      include: { _count: { select: { events: true, alerts: true } } },
    });

    return bops.map((b) => ({
      name: b.code,
      events: b._count.events,
      alerts: b._count.alerts,
    }));
  }

  static async getOverview() {
    const [alertAnalytics, eventAnalytics, cameraAnalytics, bopAnalytics] = await Promise.all([
      this.getAlertAnalytics(),
      this.getEventAnalytics(),
      this.getCameraAnalytics(),
      this.getBopAnalytics(),
    ]);

    return {
      alertsByHour: alertAnalytics.alertsByHour,
      eventsByDay: eventAnalytics.eventsByDay,
      threatDistribution: eventAnalytics.threatDistribution,
      bopEvents: bopAnalytics,
      totalAlerts: alertAnalytics.totalAlerts,
      totalEvents: eventAnalytics.totalEvents,
      cameras: cameraAnalytics,
    };
  }
}
