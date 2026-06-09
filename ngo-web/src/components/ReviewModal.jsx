import { X } from 'lucide-react';

const ReviewModal = ({ review, onClose }) => {
  if (!review) return null;

  const reviewText =
    review.review_text ||
    review.refined_review_text ||
    review.original_review_text ||
    '';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {review.name}
            </h3>

            {review.designation && (
              <p className="text-sm text-gray-500">
                {review.designation}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-700 leading-8 whitespace-pre-wrap">
            “{reviewText}”
          </p>

          <div className="mt-8 text-sm text-gray-500">
            Featured{' '}
            {new Date(review.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;