export interface SideMenu {
  name: string;
  href: string;
  icon: React.ReactNode;
  children?: {
    name: string;
    href: string;
    icon?: React.ReactNode;
  }[];
}

export type ContestDetailsTabKey = 'details' | 'winners' | 'rules' | 'prizes' | 'rank';
