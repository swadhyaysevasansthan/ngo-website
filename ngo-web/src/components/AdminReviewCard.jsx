import { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  Edit3,
  Sparkles,
  MapPin,
  Trash2,
  Loader2,
} from 'lucide-react';
import {
  approveReview,
  rejectReview,
  refineReview,
  featureReview,
  pinReview,
  deleteReview,
} from '../utils/api';
import { useMutation } from '@tanstack/react-query';

const AdminReviewCard = ({ review, onRefresh }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [refinedText, setRefinedText] = useState(
    review.refined_review_text || review.original_review_text
  );

  const approveMutation = useMutation({
    mutationFn: (id) => approveReview(id),
    onSuccess: () => onRefresh && onRefresh(),
  });

  const rejectMutation = useMutation({
    mutationFn: (id) => rejectReview(id),
    onSuccess: () => onRefresh && onRefresh(),
  });

  const refineMutation = useMutation({
    mutationFn: ({ id, refined_review_text }) =>
      refineReview(id, refined_review_text),
    onSuccess: () => {
      setIsEditing(false);
      onRefresh && onRefresh();
    },
  });

  const featureMutation = useMutation({
    mutationFn: ({ id, is_featured }) => featureReview(id, is_featured),
    onSuccess: () => onRefresh && onRefresh(),
  });

  const pinMutation = useMutation({
    mutationFn: ({ id, is_pinned }) => pinReview(id, is_pinned),
    onSuccess: () => onRefresh && onRefresh(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteReview(id),
    onSuccess: () => onRefresh && onRefresh(),
  });

  const handleSaveRefined = async () => {
    await refineMutation.mutateAsync({
      id: review.id,
      refined_review_text: refinedText,
    });
  };

  const handleApprove = () => {
    approveMutation.mutate(review.id);
  };

  const handleReject = () => {
    rejectMutation.mutate(review.id);
  };

  const handleFeatureToggle = (value) => {
    featureMutation.mutate({ id: review.id, is_featured: value });
  };

  const handlePinToggle = (value) => {
    pinMutation.mutate({ id: review.id, is_pinned: value });
  };

  const handleDelete = () => {
    if (!window.confirm('Delete this review permanently?')) return;
    deleteMutation.mutate(review.id);
  };

  return (
    <div className="group bg-white border border-gray-200 rounded-2xl p-6 md:p-8 hover:shadow-xl hover:border-gray-300 transition-all duration-300 flex flex-col justify-between">
      {/* Top row: name + status */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h4 className="font-semibold text-lg text-gray-900">{review.name}</h4>
          {review.designation && (
            <p className="text-sm text-gray-500">{review.designation}</p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            {new Date(review.created_at).toLocaleDateString()}
          </p>

          {/* Pinned / Featured badges */}
          <div className="flex flex-wrap gap-1 mt-2">
            {review.is_pinned && (
              <span className="inline-flex items-center gap-1 px-2 py-[2px] rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                📌 <span>Pinned</span>
              </span>
            )}
            {review.is_featured && (
              <span className="inline-flex items-center gap-1 px-2 py-[2px] rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-100">
                ⭐ <span>Featured</span>
              </span>
            )}
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${
            review.status === 'approved'
              ? 'bg-green-100 text-green-800'
              : review.status === 'rejected'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {review.status.toUpperCase()}
        </span>
      </div>

      {/* Review text */}
      <div className="mb-4">
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={refinedText}
              onChange={(e) => setRefinedText(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-vertical min-h-[120px]"
              placeholder="Enter refined review text..."
            />
            <div className="flex space-x-3 pt-2">
              <button
                onClick={handleSaveRefined}
                disabled={
                  refineMutation.isPending || refinedText.trim().length < 20
                }
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {refineMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save refined</span>
                )}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setRefinedText(
                    review.refined_review_text || review.original_review_text
                  );
                }}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div
            className={`p-5 bg-gray-50 rounded-2xl border-l-4 ${
              review.status === 'approved'
                ? 'border-green-400'
                : review.status === 'rejected'
                ? 'border-red-400'
                : 'border-yellow-400'
            }`}
          >
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
              {review.refined_review_text || review.original_review_text}
            </p>
          </div>
        )}
      </div>

      {/* Bottom actions bar */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
        {/* Approve / Reject when pending */}
        <div className="flex items-center gap-2">
          {review.status === 'pending' && (
            <>
              <button
                onClick={handleApprove}
                disabled={approveMutation.isPending}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 transition-colors"
              >
                {approveMutation.isPending ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <CheckCircle className="w-3 h-3" />
                )}
                <span>Approve</span>
              </button>
              <button
                onClick={handleReject}
                disabled={rejectMutation.isPending}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
              >
                {rejectMutation.isPending ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <XCircle className="w-3 h-3" />
                )}
                <span>Reject</span>
              </button>
            </>
          )}
        </div>

        {/* Pin / Feature / Edit / Delete */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handlePinToggle(!review.is_pinned)}
            disabled={pinMutation.isPending}
            className={`p-2 rounded-lg transition-colors ${
              review.is_pinned
                ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
            }`}
            title={review.is_pinned ? 'Unpin from top' : 'Pin to top'}
          >
            {pinMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <MapPin className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={() => handleFeatureToggle(!review.is_featured)}
            disabled={featureMutation.isPending}
            className={`p-2 rounded-lg transition-colors ${
              review.is_featured
                ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
            }`}
            title={
              review.is_featured ? 'Remove featured' : 'Mark as featured review'
            }
          >
            {featureMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            title="Edit refined text"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
            title="Delete review"
          >
            {deleteMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminReviewCard;