import { Link } from "wouter";
import { Newspaper, ChevronRight } from "lucide-react";

export default function NewsSection() {
  // Sample news data for mobile demonstration
  const sampleNews = [
    {
      id: 1,
      title: "Q4 Results Exceed Expectations",
      summary: "35% revenue growth and successful market expansion achieved this quarter.",
      category: "company",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: 2,
      title: "New Wellness Program Launch",
      summary: "Comprehensive benefits including gym memberships and mental health support.",
      category: "hr",
      imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'company':
        return 'bg-primary/20 text-primary border border-primary/20';
      case 'hr':
        return 'bg-blue-500/20 text-blue-700 border border-blue-500/20';
      case 'tech':
        return 'bg-purple-500/20 text-purple-700 border border-purple-500/20';
      default:
        return 'bg-gray-500/20 text-gray-700 border border-gray-500/20';
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Latest News</h3>
        <Link href="/news">
          <a className="flex items-center text-primary text-sm font-medium hover:text-primary-dark transition-colors">
            View All <ChevronRight size={16} className="ml-1" />
          </a>
        </Link>
      </div>
      
      <div className="space-y-3">
        {sampleNews.map((article) => (
          <article key={article.id} className="bg-white dark:bg-gray-800 rounded-2xl card-depth overflow-hidden hover:mobile-shadow-lg transition-shadow cursor-pointer">
            <div className="flex">
              <img 
                src={article.imageUrl} 
                alt={article.title}
                className="w-20 h-20 object-cover rounded-l-2xl"
              />
              <div className="flex-1 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs px-2 py-1 rounded-lg font-medium ${getCategoryColor(article.category)}`}>
                    {article.category}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {article.createdAt.toLocaleDateString()}
                  </span>
                </div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-1 text-sm leading-tight">{article.title}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{article.summary}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
