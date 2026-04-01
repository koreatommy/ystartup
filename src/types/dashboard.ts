import type { Role } from "@/constants/member";

/** 워크북 헤더·모바일 네비에 표시할 최소 프로필 슬라이스 */
export interface WorkbookHeaderUser {
  name: string;
  role: Role;
  email: string;
}

export interface DashboardLayoutProps {
  selectedId: string;
  onSelect: (id: string) => void;
  memberAreaHref?: string;
  memberAreaLabel?: string;
  headerUser?: WorkbookHeaderUser;
}
