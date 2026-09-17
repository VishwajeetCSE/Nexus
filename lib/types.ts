export type UserRoleTag = 'admin' | 'club' | 'student';

export type CategoryTag = 
  | 'All'
  | 'Official Alert' 
  | 'Fest/Events' 
  | 'Lost & Found' 
  | 'Exam Preparation' 
  | 'SOS Query';

export interface Campus {
  id: string;
  name: string;
  city: string;
  country: string;
  developer_github_handle: string;
  is_verified: boolean;
  created_at?: string;
  accent_color?: string;
}

export interface SOSAnswer {
  id: string;
  post_id: string;
  user_name: string;
  user_role_tag: UserRoleTag;
  content: string;
  upvotes_count: number;
  timestamp: string;
  is_accepted?: boolean;
}

export interface Post {
  id: string;
  campus_id: string;
  user_name: string;
  user_role_tag: UserRoleTag;
  title: string;
  content: string;
  category_tag: Exclude<CategoryTag, 'All'>;
  upvotes_count: number;
  timestamp: string;
  is_sos: boolean;
  is_anonymous: boolean;
  answers?: SOSAnswer[];
}

export interface NewCampusPayload {
  name: string;
  city: string;
  country: string;
  developer_name: string;
  developer_email: string;
  developer_github_handle: string;
}
