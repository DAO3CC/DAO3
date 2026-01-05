import { notFound } from 'next/navigation';
import { mockArticles, articleCategories } from '@/data/mockArticles';
import Link from 'next/link';
import Image from 'next/image';

export async function generateStaticParams() {
  return mockArticles.map((article) => ({
    slug: article.slug,
  }));
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = mockArticles.find((a) => a.slug === params.slug);

  if (!article) {
    notFound();
  }

  const category = articleCategories.find((c) => c.id === article.category);
  const relatedArticles = mockArticles
    .filter((a) => a.category === article.category && a.id !== article.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/academy"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回知识库
          </Link>
        </div>
      </div>

      <article className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Article Header */}
        <header className="mb-8">
          {category && (
            <Link
              href={`/academy?category=${category.id}`}
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mb-4"
            >
              <span className="mr-1">{category.icon}</span>
              {category.name}
            </Link>
          )}

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{article.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
            {article.author && (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                {article.author}
              </div>
            )}
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {new Date(article.publishedAt).toLocaleDateString('zh-CN')}
            </div>
          </div>

          {article.coverImage && (
            <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {article.excerpt && (
            <p className="text-xl text-gray-600 leading-relaxed border-l-4 border-blue-600 pl-6">
              {article.excerpt}
            </p>
          )}
        </header>

        {/* Article Content */}
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 mb-8">
          <div className="prose prose-lg max-w-none">
            {article.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">相关标签</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">相关文章</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => {
                const relatedCategory = articleCategories.find((c) => c.id === relatedArticle.category);
                return (
                  <Link
                    key={relatedArticle.id}
                    href={`/academy/${relatedArticle.slug}`}
                    className="group"
                  >
                    {relatedArticle.coverImage && (
                      <div className="relative h-32 rounded-lg overflow-hidden mb-3">
                        <Image
                          src={relatedArticle.coverImage}
                          alt={relatedArticle.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {relatedCategory && (
                          <div className="absolute top-2 left-2">
                            <span className="text-xs px-2 py-1 bg-blue-600/90 text-white rounded">
                              {relatedCategory.icon} {relatedCategory.name}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {relatedArticle.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2">{relatedArticle.excerpt}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </article>

      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">想要了解更多加密知识？</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            探索我们的知识库，获取最新的行业洞察和深度分析
          </p>
          <Link
            href="/academy"
            className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            浏览更多文章
          </Link>
        </div>
      </div>
    </div>
  );
}
