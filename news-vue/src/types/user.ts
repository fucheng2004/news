// 用户类型定义
export interface User {
  id: number;
  username: string;
  email: string;
  avatar: string;
  role: 'admin' | 'user' | 'guest';
  status: 'active' | 'blocked' | 'new';
  lastLogin: Date;
  createdAt: Date;
  comment?: string;
}

// 用户表单类型
export interface UserForm {
  username: string;
  email: string;
  avatar: string;
  role: User['role'];
  status: User['status'];
}

// 用户处理表单类型
export interface HandleUserForm {
  status: User['status'];
  comment: string;
}

// 用户统计类型
export interface UserStats {
  total: number;
  active: number;
  new: number;
  blocked: number;
}

// 用户分页类型
export interface UserPagination {
  currentPage: number;
  pageSize: number;
  total: number;
}

// 用户对话框状态类型
export interface UserDialogs {
  addUser: boolean;
  editUser: boolean;
}

// 用户加载状态类型
export interface UserLoading {
  users: boolean;
  addUser: boolean;
  editUser: boolean;
} 