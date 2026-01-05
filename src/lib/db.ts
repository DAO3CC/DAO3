import { supabase } from './supabase';
import { Tool, Category, Airdrop, Article } from '@/types';

// ==========================================
// 工具相关操作
// ==========================================

export async function getAllTools(): Promise<Tool[]> {
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .order('order_num', { ascending: true });

  if (error) {
    console.error('Error fetching tools:', error);
    return [];
  }

  return data?.map((tool) => ({
    ...tool,
    category: tool.category,
    tags: tool.tags || [],
    createdAt: tool.created_at,
    updatedAt: tool.updated_at,
  })) || [];
}

export async function getToolById(id: string): Promise<Tool | null> {
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching tool:', error);
    return null;
  }

  return {
    ...data!,
    category: data!.category,
    tags: data!.tags || [],
    createdAt: data!.created_at,
    updatedAt: data!.updated_at,
  };
}

export async function createTool(tool: Omit<Tool, 'id' | 'createdAt' | 'updatedAt'>): Promise<Tool | null> {
  const { data, error } = await supabase
    .from('tools')
    .insert({
      name: tool.name,
      description: tool.description,
      icon: tool.icon,
      url: tool.url,
      category: tool.category,
      tags: tool.tags || [],
      hot: tool.hot || false,
      featured: tool.featured || false,
      chain: tool.chain,
      order: tool.order,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating tool:', error);
    return null;
  }

  return {
    ...data!,
    category: data!.category,
    tags: data!.tags || [],
    createdAt: data!.created_at,
    updatedAt: data!.updated_at,
  };
}

export async function updateTool(id: string, tool: Partial<Tool>): Promise<Tool | null> {
  const { data, error } = await supabase
    .from('tools')
    .update({
      name: tool.name,
      description: tool.description,
      icon: tool.icon,
      url: tool.url,
      category: tool.category,
      tags: tool.tags,
      hot: tool.hot,
      featured: tool.featured,
      chain: tool.chain,
      order: tool.order,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating tool:', error);
    return null;
  }

  return {
    ...data!,
    category: data!.category,
    tags: data!.tags || [],
    createdAt: data!.created_at,
    updatedAt: data!.updated_at,
  };
}

export async function deleteTool(id: string): Promise<boolean> {
  const { error } = await supabase.from('tools').delete().eq('id', id);

  if (error) {
    console.error('Error deleting tool:', error);
    return false;
  }

  return true;
}

// ==========================================
// 分类相关操作
// ==========================================

export async function getAllCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('order_num', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data?.map((cat) => ({
    ...cat,
    order: cat.order_num,
  })) || [];
}

export async function createCategory(category: Omit<Category, 'id'>): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .insert({
      name: category.name,
      slug: category.slug,
      icon: category.icon,
      description: category.description,
      order_num: category.order,
      visible: category.visible,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating category:', error);
    return null;
  }

  return {
    ...data!,
    order: data!.order_num,
  };
}

export async function updateCategory(id: string, category: Partial<Category>): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .update({
      name: category.name,
      slug: category.slug,
      icon: category.icon,
      description: category.description,
      order_num: category.order,
      visible: category.visible,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating category:', error);
    return null;
  }

  return {
    ...data!,
    order: data!.order_num,
  };
}

export async function deleteCategory(id: string): Promise<boolean> {
  const { error } = await supabase.from('categories').delete().eq('id', id);

  if (error) {
    console.error('Error deleting category:', error);
    return false;
  }

  return true;
}

// ==========================================
// 空投相关操作
// ==========================================

export async function getAllAirdrops(): Promise<Airdrop[]> {
  const { data, error } = await supabase
    .from('airdrops')
    .select('*')
    .order('order_num', { ascending: true });

  if (error) {
    console.error('Error fetching airdrops:', error);
    return [];
  }

  return data?.map((airdrop) => ({
    ...airdrop,
    imageUrl: airdrop.image_url,
    rewardType: airdrop.reward_type,
    createdAt: airdrop.created_at,
    updatedAt: airdrop.updated_at,
  })) || [];
}

export async function createAirdrop(airdrop: Omit<Airdrop, 'id' | 'createdAt' | 'updatedAt'>): Promise<Airdrop | null> {
  const { data, error } = await supabase
    .from('airdrops')
    .insert({
      title: airdrop.title,
      description: airdrop.description,
      image_url: airdrop.imageUrl,
      link: airdrop.link,
      status: airdrop.status,
      deadline: airdrop.deadline,
      chain: airdrop.chain,
      reward_type: airdrop.rewardType,
      reward: airdrop.reward,
      participants: airdrop.participants,
      order: airdrop.order,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating airdrop:', error);
    return null;
  }

  return {
    ...data!,
    imageUrl: data!.image_url,
    rewardType: data!.reward_type,
    createdAt: data!.created_at,
    updatedAt: data!.updated_at,
  };
}

export async function updateAirdrop(id: string, airdrop: Partial<Airdrop>): Promise<Airdrop | null> {
  const { data, error } = await supabase
    .from('airdrops')
    .update({
      title: airdrop.title,
      description: airdrop.description,
      image_url: airdrop.imageUrl,
      link: airdrop.link,
      status: airdrop.status,
      deadline: airdrop.deadline,
      chain: airdrop.chain,
      reward_type: airdrop.rewardType,
      reward: airdrop.reward,
      participants: airdrop.participants,
      order: airdrop.order,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating airdrop:', error);
    return null;
  }

  return {
    ...data!,
    imageUrl: data!.image_url,
    rewardType: data!.reward_type,
    createdAt: data!.created_at,
    updatedAt: data!.updated_at,
  };
}

export async function deleteAirdrop(id: string): Promise<boolean> {
  const { error } = await supabase.from('airdrops').delete().eq('id', id);

  if (error) {
    console.error('Error deleting airdrop:', error);
    return false;
  }

  return true;
}

// ==========================================
// 文章相关操作
// ==========================================

export async function getAllArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('order_num', { ascending: true });

  if (error) {
    console.error('Error fetching articles:', error);
    return [];
  }

  return data?.map((article) => ({
    ...article,
    coverImage: article.cover_image,
    publishedAt: article.published_at,
    updatedAt: article.updated_at,
  })) || [];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching article:', error);
    return null;
  }

  return {
    ...data!,
    coverImage: data!.cover_image,
    publishedAt: data!.published_at,
    updatedAt: data!.updated_at,
  };
}

export async function createArticle(article: Omit<Article, 'id'>): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .insert({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      cover_image: article.coverImage,
      category: article.category,
      tags: article.tags || [],
      author: article.author,
      published_at: article.publishedAt,
      featured: article.featured || false,
      order: article.order,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating article:', error);
    return null;
  }

  return {
    ...data!,
    coverImage: data!.cover_image,
    publishedAt: data!.published_at,
    updatedAt: data!.updated_at,
  };
}

export async function updateArticle(id: string, article: Partial<Article>): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .update({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      cover_image: article.coverImage,
      category: article.category,
      tags: article.tags,
      author: article.author,
      featured: article.featured,
      order: article.order,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating article:', error);
    return null;
  }

  return {
    ...data!,
    coverImage: data!.cover_image,
    publishedAt: data!.published_at,
    updatedAt: data!.updated_at,
  };
}

export async function deleteArticle(id: string): Promise<boolean> {
  const { error } = await supabase.from('articles').delete().eq('id', id);

  if (error) {
    console.error('Error deleting article:', error);
    return false;
  }

  return true;
}

export async function getArticleCategories() {
  const { data, error } = await supabase
    .from('article_categories')
    .select('*')
    .order('order_num', { ascending: true });

  if (error) {
    console.error('Error fetching article categories:', error);
    return [];
  }

  return data?.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    icon: cat.icon,
    order: cat.order_num,
  })) || [];
}
