/**
 * PANews工具批量导入脚本
 * 将PANews的所有工具导入到Supabase数据库
 *
 * 使用方法：
 * 1. 确保 .env.local 文件已配置
 * 2. 运行：npx ts-node scripts/import-panews-tools.ts
 */

import { createClient } from '@supabase/supabase-js';
import { panewsTools } from './panews-tools';

// Supabase 配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 错误：缺少Supabase配置');
  console.log('请确保 .env.local 文件中包含以下变量：');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 分类映射：将PANews的分类名称映射到数据库中的分类ID
const categoryMap: Record<string, string> = {
  '热门': '1',
  'AI Agent': '2',
  'Meme工具': '3',
  '区块浏览器': '4',
  '综合数据': '5',
  'DAT数据看板': '6',
  'CeFi': '7',
  'DeFi': '8',
  'NFT': '9',
  'DAO': '10',
  'DApp': '11',
  '空投': '12',
  '矿业': '13',
  '钱包工具': '14',
  'BTC生态': '15',
};

/**
 * 格式化工具数据
 */
function formatTool(tool: any, index: number) {
  return {
    name: tool.name,
    description: tool.description,
    icon: tool.icon,
    url: tool.url,
    category: categoryMap[tool.category] || '1', // 默认分类为"热门"
    tags: tool.tags || [],
    hot: tool.hot || false,
    featured: tool.featured || false,
    chain: tool.chain || null,
    order_num: index,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

/**
 * 批量导入工具
 */
async function importTools() {
  console.log('🚀 开始导入PANews工具...\n');
  console.log(`📊 总计 ${panewsTools.length} 个工具\n`);

  let successCount = 0;
  let errorCount = 0;
  const errors: Array<{ tool: string; error: string }> = [];

  // 批量插入（每次50个，避免超过限制）
  const batchSize = 50;
  const batches = Math.ceil(panewsTools.length / batchSize);

  for (let i = 0; i < batches; i++) {
    const start = i * batchSize;
    const end = Math.min(start + batchSize, panewsTools.length);
    const batch = panewsTools.slice(start, end);

    console.log(`📦 处理批次 ${i + 1}/${batches} (${start + 1}-${end})...`);

    // 格式化工具数据
    const formattedTools = batch.map((tool, index) =>
      formatTool(tool, start + index)
    );

    try {
      // 批量插入到数据库
      const { data, error } = await supabase
        .from('tools')
        .insert(formattedTools)
        .select();

      if (error) {
        console.error(`❌ 批次 ${i + 1} 插入失败:`, error.message);
        errorCount += batch.length;
        batch.forEach(tool => {
          errors.push({ tool: tool.name, error: error.message });
        });
      } else {
        console.log(`✅ 批次 ${i + 1} 成功插入 ${data?.length || 0} 个工具`);
        successCount += data?.length || 0;
      }
    } catch (err: any) {
      console.error(`❌ 批次 ${i + 1} 发生异常:`, err.message);
      errorCount += batch.length;
      batch.forEach(tool => {
        errors.push({ tool: tool.name, error: err.message });
      });
    }

    // 等待一小段时间，避免速率限制
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // 打印统计结果
  console.log('\n' + '='.repeat(60));
  console.log('📊 导入完成统计');
  console.log('='.repeat(60));
  console.log(`✅ 成功: ${successCount} 个`);
  console.log(`❌ 失败: ${errorCount} 个`);
  console.log(`📈 总计: ${panewsTools.length} 个`);

  if (errors.length > 0) {
    console.log('\n❌ 失败详情：');
    errors.slice(0, 10).forEach(({ tool, error }) => {
      console.log(`  - ${tool}: ${error}`);
    });
    if (errors.length > 10) {
      console.log(`  ... 还有 ${errors.length - 10} 个错误`);
    }
  }

  console.log('\n✨ 导入完成！');
}

/**
 * 检查数据库连接
 */
async function checkConnection() {
  try {
    const { data, error } = await supabase
      .from('tools')
      .select('id')
      .limit(1);

    if (error) {
      console.error('❌ 数据库连接失败:', error.message);
      console.log('\n请检查：');
      console.log('1. Supabase 项目是否已创建');
    console.log('2. 是否已执行 supabase/schema.sql 初始化脚本');
      console.log('3. 环境变量是否正确配置');
      return false;
    }

    console.log('✅ 数据库连接成功\n');
    return true;
  } catch (err: any) {
    console.error('❌ 数据库连接异常:', err.message);
    return false;
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('='.repeat(60));
  console.log('🔧 DAO³ Labs - PANews工具导入工具');
  console.log('='.repeat(60) + '\n');

  // 检查数据库连接
  const connected = await checkConnection();
  if (!connected) {
    process.exit(1);
  }

  // 显示导入预览
  console.log('📋 导入预览：');
  console.log(`- 热门: ${panewsTools.filter(t => t.category === '热门').length} 个`);
  console.log(`- AI Agent: ${panewsTools.filter(t => t.category === 'AI Agent').length} 个`);
  console.log(`- Meme工具: ${panewsTools.filter(t => t.category === 'Meme工具').length} 个`);
  console.log(`- 区块浏览器: ${panewsTools.filter(t => t.category === '区块浏览器').length} 个`);
  console.log(`- 综合数据: ${panewsTools.filter(t => t.category === '综合数据').length} 个`);
  console.log(`- BTC生态: ${panewsTools.filter(t => t.category === 'BTC生态').length} 个`);
  console.log(`- 钱包工具: ${panewsTools.filter(t => t.category === '钱包工具').length} 个`);
  console.log(`- DeFi: ${panewsTools.filter(t => t.category === 'DeFi').length} 个`);
  console.log(`- NFT: ${panewsTools.filter(t => t.category === 'NFT').length} 个`);
  console.log(`- 其他: ${panewsTools.filter(t => ![
    '热门', 'AI Agent', 'Meme工具', '区块浏览器', '综合数据', 'BTC生态', '钱包工具', 'DeFi', 'NFT'
  ].includes(t.category)).length} 个\n`);

  // 确认导入
  console.log('⚠️  注意：这将向数据库插入大量数据！');
  console.log('如果数据库中已有工具，可能会产生重复。\n');

  // 开始导入
  await importTools();

  process.exit(0);
}

// 运行主函数
main().catch((err) => {
  console.error('💥 发生错误:', err);
  process.exit(1);
});
