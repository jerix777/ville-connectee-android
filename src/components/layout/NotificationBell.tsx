import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useMessageNotifications } from "@/hooks/useMessageNotifications";
import { cn } from "@/lib/utils";

export function NotificationBell() {
  const navigate = useNavigate();
  const { unreadCount, markAllAsRead } = useMessageNotifications();

  const handleClick = () => {
    navigate('/messages');
    if (unreadCount > 0) {
      markAllAsRead();
    }
  };

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleClick}
        className="text-current hover:bg-ville-hover"
      >
        <Bell size={20} />
      </Button>
      
      {unreadCount > 0 && (
        <Badge 
          variant="destructive"
          className={cn(
            "absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs p-0",
            "bg-red-500 text-white border-0 animate-pulse"
          )}
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </Badge>
      )}
    </div>
  );
}