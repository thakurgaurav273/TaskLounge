// components/StatusIcon.tsx
import { CheckCircle2, Circle, Clock, XCircle, AlertCircle, PauseCircle } from 'lucide-react';

interface StatusIconProps {
  status: string;
  size?: number;
}

const StatusIcon: React.FC<StatusIconProps> = ({ status, size = 16 }) => {
  const statusLower = status.toLowerCase();
  
  const iconMap: Record<string, { Icon: any; color: string }> = {
    'done': { Icon: CheckCircle2, color: '#22c55e' },     
    'completed': { Icon: CheckCircle2, color: '#22c55e' },
    'in progress': { Icon: Clock, color: '#eab308' },     
    'todo': { Icon: Circle, color: '#64748b' },           
    'backlog': { Icon: Circle, color: '#94a3b8' },         
    'blocked': { Icon: XCircle, color: '#ef4444' },       
    'Cancelled': { Icon: XCircle, color: '#64748b' },
    'review': { Icon: AlertCircle, color: '#f59e0b' },  
    'paused': { Icon: PauseCircle, color: '#64748b' }
  };
  
  const config = iconMap[statusLower] || iconMap['backlog'];
  const { Icon, color } = config;
  
  return <Icon size={size} style={{ color }} />;
};

export default StatusIcon;