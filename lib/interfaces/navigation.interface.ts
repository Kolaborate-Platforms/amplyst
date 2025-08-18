export interface NavItem {
    label: string;
    href: string;
    icon: React.ComponentType<any>;
    tabValue?: string;
    description: string;
    comingSoon?: boolean;
  }