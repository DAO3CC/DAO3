import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="text-2xl font-bold text-gray-900 mb-2">DAO3</div>
            <p className="text-sm text-gray-600">
              Web3 工具导航平台，帮助您发现最好的区块链工具和资源
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/tools" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  工具导航
                </Link>
              </li>
              <li>
                <Link href="/airdrops" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  空投任务
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  我的收藏
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">热门分类</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/tools?category=ai-agent" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  AI Agent
                </Link>
              </li>
              <li>
                <Link href="/tools?category=meme" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Meme 工具
                </Link>
              </li>
              <li>
                <Link href="/tools?category=defi" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  DeFi
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">联系我们</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:contact@dao3.io" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Email
                </a>
              </li>
              <li>
                <a href="https://twitter.com/dao3" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} DAO3. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
