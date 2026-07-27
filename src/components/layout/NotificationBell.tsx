
'use client';

import { useState, useMemo } from 'react';
import { BellIcon, CheckCheck, Info, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { mockTasks } from '@/lib/mockData';
import { generateNotifications } from '@/lib/notifications';
import type { Notification } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

const iconMap = {
  alert: <TriangleAlert className="h-4 w-4 text-destructive" />,
  info: <Info className="h-4 w-4 text-blue-500" />,
  success: <CheckCheck className="h-4 w-4 text-green-500" />,
};

export default function NotificationBell() {
  const generatedNotifications = useMemo(() => generateNotifications(mockTasks), []);
  const [notifications, setNotifications] = useState<Notification[]>(generatedNotifications);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };
  
  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <BellIcon className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          <span className="sr-only">Toggle notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0">
          <CardHeader className="flex flex-row items-center justify-between border-b px-4 py-3">
            <CardTitle className="text-lg font-headline">Notifications</CardTitle>
            {unreadCount > 0 && (
              <Button variant="link" size="sm" className="p-0 h-auto" onClick={handleMarkAllAsRead}>
                Mark all as read
              </Button>
            )}
          </CardHeader>
          <CardContent className="p-0">
            {notifications.length > 0 ? (
              <div className="max-h-96 overflow-y-auto">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={cn(
                      "flex items-start gap-3 p-3 border-b last:border-b-0 hover:bg-secondary/50",
                      !notification.read && 'bg-secondary/30'
                    )}
                    onClick={() => handleMarkAsRead(notification.id)}
                    role="button"
                  >
                    <div className="mt-1">{iconMap[notification.type]}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(notification.date, { addSuffix: true })}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="p-4 text-center text-sm text-muted-foreground">No new notifications.</p>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
