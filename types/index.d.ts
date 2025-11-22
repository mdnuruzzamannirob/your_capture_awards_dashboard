export interface SideMenu {
  name: string;
  href: string;
  icon: React.JSX.Element;
  children?: SideMenu[]; // recursive
}
