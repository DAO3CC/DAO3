// 工具分类
export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  logo?: string; // 分类logo
  description?: string;
  order: number;
  visible?: boolean; // 是否在导航中显示
}

// 知识库文章
export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: string; // 文章分类
  tags?: string[];
  author?: string;
  publishedAt: string;
  updatedAt: string;
  order: number;
  featured?: boolean; // 是否精选
}

// 工具项目
export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  url: string;
  category: string; // category id
  tags?: string[];
  hot?: boolean;
  featured?: boolean;
  chain?: string; // 区块链
  order: number;
  createdAt: string;
  updatedAt: string;
}

// 区块链信息
export interface Chain {
  id: string;
  name: string;
  icon: string;
  color: string; // 渐变色 class
}

// 空投任务
export interface Airdrop {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  status: 'active' | 'ended' | 'upcoming';
  deadline?: string;
  chain?: string; // 所属区块链
  rewardType?: 'token' | 'nft' | 'whitelist' | 'points' | 'other'; // 奖励类型
  reward?: string; // 奖励描述
  participants?: string; // 参与人数
  order: number;
  createdAt: string;
  updatedAt: string;
}

// 用户收藏
export interface Favorite {
  id: string;
  userId: string;
  toolId: string;
  createdAt: string;
}

// API 响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// 搜索和筛选参数
export interface ToolFilters {
  category?: string;
  search?: string;
  tags?: string[];
  hot?: boolean;
  featured?: boolean;
  chain?: string; // 区块链筛选
}
