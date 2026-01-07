'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'zh' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations using proper crypto industry terminology
const translations = {
  zh: {
    // Navigation
    'nav.home': '首页',
    'nav.tools': '工具导航',
    'nav.airdrops': '空投任务',
    'nav.academy': '知识库',
    'nav.admin': '后台管理',
    'nav.search': '搜索',

    // Hero Section
    'hero.title': '您的Web3世界入口',
    'hero.subtitle': '一站式Web3工具导航平台，助您轻松探索区块链世界',
    'hero.cta.primary': '开始探索',
    'hero.cta.secondary': '了解更多',

    // Airdrops Section (Homepage)
    'airdrops.title': '热门空投任务',
    'airdrops.subtitle': '发现最新空投机会，获取代币奖励',
    'airdrops.viewAll': '查看全部',
    'airdrops.status.active': '进行中',
    'airdrops.status.upcoming': '即将开始',
    'airdrops.status.ended': '已结束',
    'airdrops.participate': '立即参与',

    // Chains Section
    'chains.title': '支持的区块链',
    'chains.subtitle': '跨多链探索无限可能',

    // Tools Page
    'tools.title': 'Web3工具导航',
    'tools.subtitle': '精选优质工具，助力Web3之旅',
    'tools.all': '全部工具',
    'tools.favorites': '我的收藏',
    'tools.search': '搜索工具...',
    'tools.visit': '访问网站',
    'tools.favorite': '收藏',
    'tools unfavorited': '取消收藏',

    // Categories
    'cat.hot': '热门',
    'cat.ai-agent': 'AI Agent',
    'cat.meme': 'Meme工具',
    'cat.explorer': '区块浏览器',
    'cat.data': '综合数据',
    'cat.dat': 'DAT数据看板',
    'cat.cefi': 'CeFi',
    'cat.defi': 'DeFi',
    'cat.nft': 'NFT',
    'cat.dao': 'DAO',
    'cat.dapp': 'DApp',
    'cat.airdrop': '空投',
    'cat.mining': '矿业',
    'cat.wallet': '钱包工具',
    'cat.btc': 'BTC生态',
    'cat.other': '其他',

    // Airdrops Page
    'airdrops.page.title': '空投任务',
    'airdrops.page.subtitle': '参与空投活动，获取代币奖励',
    'airdrops.filter.allChains': '全部链',
    'airdrops.filter.allStatus': '全部',
    'airdrops.filter.status.active': '进行中',
    'airdrops.filter.status.upcoming': '即将开始',
    'airdrops.filter.status.ended': '已结束',
    'airdrops.filter.allTypes': '全部',
    'airdrops.filter.type.token': 'Token',
    'airdrops.filter.type.nft': 'NFT',
    'airdrops.filter.type.whitelist': '白名单',
    'airdrops.filter.type.points': '积分',
    'airdrops.filter.type.other': '其他',
    'airdrops.results': '找到 {count} 个任务',
    'airdrops.noResults': '没有找到相关任务',
    'airdrops.tryOther': '请尝试选择其他筛选条件',
    'airdrops.tips.title': '参与提示',
    'airdrops.tips.1': '仔细阅读项目官方公告，了解参与规则',
    'airdrops.tips.2': '保护个人资产安全，谨慎授权合约',
    'airdrops.tips.3': '关注项目截止时间，及时完成任务',
    'airdrops.tips.4': '谨防诈骗，只通过官方渠道参与',

    // Academy Page
    'academy.title': 'Web3知识库',
    'academy.subtitle': '系统性学习Web3知识',
    'academy.comingSoon': '内容筹备中，敬请期待...',

    // Footer
    'footer.tagline': '一站式Web3工具导航平台',
    'footer.about': '关于我们',
    'footer.contact': '联系我们',
    'footer.terms': '使用条款',
    'footer.privacy': '隐私政策',
    'footer.rights': '版权所有',

    // CTA Section
    'cta.title': '开启您的Web3之旅',
    'cta.subtitle': '加入我们，探索去中心化世界的无限可能',
    'cta.button': '立即加入',

    // Common
    'common.loading': '加载中...',
    'common.error': '出错了',
    'common.retry': '重试',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.tools': 'Tools',
    'nav.airdrops': 'Airdrops',
    'nav.academy': 'Academy',
    'nav.admin': 'Admin',
    'nav.search': 'Search',

    // Hero Section
    'hero.title': 'Your Gateway to Web3',
    'hero.subtitle': 'One-stop Web3 tools navigation platform to explore the blockchain world',
    'hero.cta.primary': 'Start Exploring',
    'hero.cta.secondary': 'Learn More',

    // Airdrops Section (Homepage)
    'airdrops.title': 'Hot Airdrops',
    'airdrops.subtitle': 'Discover the latest airdrop opportunities and get token rewards',
    'airdrops.viewAll': 'View All',
    'airdrops.status.active': 'Active',
    'airdrops.status.upcoming': 'Upcoming',
    'airdrops.status.ended': 'Ended',
    'airdrops.participate': 'Participate Now',

    // Chains Section
    'chains.title': 'Supported Blockchains',
    'chains.subtitle': 'Explore unlimited possibilities across multiple chains',

    // Tools Page
    'tools.title': 'Web3 Tools Navigation',
    'tools.subtitle': 'Curated quality tools to power your Web3 journey',
    'tools.all': 'All Tools',
    'tools.favorites': 'Favorites',
    'tools.search': 'Search tools...',
    'tools.visit': 'Visit Site',
    'tools.favorite': 'Favorite',
    'tools unfavorited': 'Unfavorite',

    // Categories
    'cat.hot': 'Hot',
    'cat.ai-agent': 'AI Agent',
    'cat.meme': 'Meme Tools',
    'cat.explorer': 'Explorers',
    'cat.data': 'Data Analytics',
    'cat.dat': 'DAT Dashboard',
    'cat.cefi': 'CeFi',
    'cat.defi': 'DeFi',
    'cat.nft': 'NFT',
    'cat.dao': 'DAO',
    'cat.dapp': 'DApps',
    'cat.airdrop': 'Airdrops',
    'cat.mining': 'Mining',
    'cat.wallet': 'Wallets',
    'cat.btc': 'BTC Ecosystem',
    'cat.other': 'Others',

    // Airdrops Page
    'airdrops.page.title': 'Airdrop Tasks',
    'airdrops.page.subtitle': 'Participate in airdrop campaigns and earn token rewards',
    'airdrops.filter.allChains': 'All Chains',
    'airdrops.filter.allStatus': 'All',
    'airdrops.filter.status.active': 'Active',
    'airdrops.filter.status.upcoming': 'Upcoming',
    'airdrops.filter.status.ended': 'Ended',
    'airdrops.filter.allTypes': 'All',
    'airdrops.filter.type.token': 'Token',
    'airdrops.filter.type.nft': 'NFT',
    'airdrops.filter.type.whitelist': 'Whitelist',
    'airdrops.filter.type.points': 'Points',
    'airdrops.filter.type.other': 'Other',
    'airdrops.results': 'Found {count} tasks',
    'airdrops.noResults': 'No tasks found',
    'airdrops.tryOther': 'Please try other filter options',
    'airdrops.tips.title': 'Participation Tips',
    'airdrops.tips.1': 'Read project announcements carefully to understand participation rules',
    'airdrops.tips.2': 'Protect your assets, authorize contracts with caution',
    'airdrops.tips.3': 'Pay attention to deadlines and complete tasks on time',
    'airdrops.tips.4': 'Beware of scams, only participate through official channels',

    // Academy Page
    'academy.title': 'Web3 Academy',
    'academy.subtitle': 'Systematically learn Web3 knowledge',
    'academy.comingSoon': 'Content coming soon, stay tuned...',

    // Footer
    'footer.tagline': 'One-stop Web3 tools navigation platform',
    'footer.about': 'About Us',
    'footer.contact': 'Contact',
    'footer.terms': 'Terms of Service',
    'footer.privacy': 'Privacy Policy',
    'footer.rights': 'All rights reserved',

    // CTA Section
    'cta.title': 'Start Your Web3 Journey',
    'cta.subtitle': 'Join us and explore the unlimited possibilities of the decentralized world',
    'cta.button': 'Join Now',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error occurred',
    'common.retry': 'Retry',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('zh');

  useEffect(() => {
    // Load language preference from localStorage
    const saved = localStorage.getItem('language') as Language;
    if (saved && (saved === 'zh' || saved === 'en')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      value = value?.[k];
    }

    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
