export interface DashboardLayoutProps {
  selectedId: string;
  onSelect: (id: string) => void;
  memberAreaHref?: string;
  memberAreaLabel?: string;
}
