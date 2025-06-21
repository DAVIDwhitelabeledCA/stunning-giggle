import { FrontendUser } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Share2, Newspaper } from "lucide-react";

interface NewsProps {
  user: FrontendUser;
}

export default function News({ user }: NewsProps) {
  const { data: news = [], isLoading } = useQuery({
    queryKey: ['/api/news'],
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl card-depth">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Company News</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Loading latest updates...</p>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="overflow-hidden animate-pulse card-depth">
              <div className="w-full h-32 bg-gray-200 dark:bg-gray-700"></div>
              <CardContent className="p-4">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'company':
        return 'bg-gradient-to-r from-primary/20 to-primary/10 text-primary border border-primary/20';
      case 'hr':
        return 'bg-gradient-to-r from-blue-500/20 to-blue-500/10 text-blue-700 border border-blue-500/20';
      case 'tech':
        return 'bg-gradient-to-r from-purple-500/20 to-purple-500/10 text-purple-700 border border-purple-500/20';
      default:
        return 'bg-gradient-to-r from-gray-500/20 to-gray-500/10 text-gray-700 border border-gray-500/20';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl card-depth">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Company News</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Latest updates and announcements
        </p>
      </div>

      {/* News Feed */}
      {news.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl card-depth text-center">
          <Newspaper className="mx-auto text-gray-400 w-12 h-12 mb-3" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">No News Available</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Check back later for updates.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {news.map((article) => (
            <article
              key={article.id}
              className="bg-white dark:bg-gray-800 rounded-2xl card-depth overflow-hidden hover:mobile-shadow-lg transition-shadow cursor-pointer"
            >
              {article.imageUrl && (
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${getCategoryColor(article.category)}`}>
                    {article.category}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(article.createdAt!)}</span>
                </div>
                
                <h3 className="font-bold text-gray-800 dark:text-white mb-2 text-lg leading-tight">{article.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{article.summary || article.content.substring(0, 120) + '...'}</p>
                
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                  <button className="text-primary text-sm font-semibold hover:text-primary-dark transition-colors bg-primary/10 px-3 py-1 rounded-lg">
                    Read More
                  </button>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors button-depth">
                      <Heart size={16} className="text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors button-depth">
                      <Share2 size={16} className="text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {news.length > 0 && (
        <div className="text-center pt-2">
          <button className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-2xl card-depth hover:mobile-shadow-lg transition-all button-depth">
            Load More Articles
          </button>
        </div>
      )}
    </div>
  );
}
