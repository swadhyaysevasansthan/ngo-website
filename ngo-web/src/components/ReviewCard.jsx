import { Star, MapPin } from 'lucide-react';

const ReviewCard = ({ review }) => {
  const isFeatured = review.is_featured;
  const isPinned = review.is_pinned;

  return (
    <div
      className={[
        'relative rounded-3xl bg-white shadow-lg transition-all duration-300',
        'hover:shadow-2xl hover:-translate-y-1',
        isFeatured
          ? 'border border-transparent bg-gradient-to-br from-amber-300/40 via-white to-indigo-200/40 p-[2px]'
          : 'border border-gray-100',
      ].join(' ')}
    >
      {/* Inner container so gradient border shows */}
      <div className="h-full rounded-[1.4rem] bg-white p-6 flex flex-col">
        {/* Top labels */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-indigo-500 text-white flex items-center justify-center font-semibold">
              {review.name?.[0] || 'S'}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                {review.name}
              </h3>
              {review.designation && (
                <p className="text-xs text-gray-500">{review.designation}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            {isPinned && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-[2px] text-[11px] font-medium text-blue-700">
                <MapPin className="w-3 h-3" />
                <span>Pinned</span>
              </span>
            )}
            {isFeatured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-[2px] text-[11px] font-semibold text-amber-700">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>Featured story</span>
              </span>
            )}
          </div>
        </div>

        {/* Review text */}
        <div className="flex-1">
          <p className="text-sm md:text-base text-gray-700 leading-relaxed">
            “{review.review_text || review.refined_review_text || review.original_review_text}”
          </p>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <span>
            Featured {new Date(review.created_at).toLocaleDateString()}
          </span>
          {isFeatured && (
            <span className="inline-flex items-center gap-1 text-amber-600">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>Top pick</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;