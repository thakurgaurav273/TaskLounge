import { Clock, GitBranch, AlertTriangle, Package, Play, Circle, Pause, Loader2, CheckCircle, Bug, Code, Server, icons } from "lucide-react";

export interface TeamItem {
  id: string;
  title: string;
  icon: React.FC<any>; // Lucide React icon component
}

export const Teams: TeamItem[] = [
  { id: 'ENG', title: 'Engineering', icon: Code, },
  { id: 'PRO', title: 'Product', icon: Package },
  { id: 'DEVOPS', title: 'DevOps', icon: Server },
  { id: 'BUG', title: 'Product(Bugs)', icon: Bug }
];

export interface StatusItem {
  id: number;
  title: string;
  icon: React.FC<any>;
}

export const Status: StatusItem[] = [
  { id: 1, title: 'Pending', icon: Clock },
  { id: 2, title: 'Backlog', icon: GitBranch },
  { id: 3, title: 'Under Dev Review', icon: AlertTriangle },
  { id: 4, title: 'Ready for release', icon: Package },
  { id: 5, title: 'In Progress', icon: Play },
  { id: 6, title: 'Todo', icon: Circle },
  { id: 7, title: 'On Hold', icon: Pause },
  { id: 8, title: 'In QA', icon: Loader2 },
  { id: 9, title: 'Released', icon: CheckCircle },
  { id: 10, title: 'Done', icon: CheckCircle }
];

export interface ProjectItem {
  id: number;
  title: string;
  icon: React.FC<any>;
}

export const Project: ProjectItem[] = [
  { id: 1, title: 'No Project', icon: Clock },
  { id: 2, title: 'Bug Squash', icon: Clock },
  { id: 3, title: 'UIKit', icon: Clock },
  { id: 4, title: 'SDK', icon: Clock },
]

export interface LabelItem {
  id: number;
  title: string;
  icon: React.FC<any>;
}

export const Labels: LabelItem[] = [
  { id: 1, title: 'Platform', icon: Clock },
  { id: 2, title: 'Customer Priority', icon: Clock },
  { id: 3, title: 'Type', icon: Clock },
  { id: 4, title: 'Technology', icon: Clock },
]