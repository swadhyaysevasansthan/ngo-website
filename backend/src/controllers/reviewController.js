import { Review } from '../models/reviewModel.js';
import { verifyRecaptcha } from '../services/recaptchaService.js';

// Simple pagination helper
const paginate = (query) => ({
  page: Math.max(1, parseInt(query.page, 10) || 1),
  limit: Math.min(50, Math.max(1, parseInt(query.limit, 10) || 10)),
});

// POST /api/reviews
export const submitReview = async (req, res, next) => {
  try {
    const { name, email, phone, designation, review_text, recaptchaToken } = req.body;

    // Verify reCAPTCHA (v2 checkbox)
    const captchaOk = await verifyRecaptcha(recaptchaToken);
    if (!captchaOk) {
      return res.status(400).json({
        success: false,
        message: 'reCAPTCHA verification failed.',
      });
    }

    // Create review (pending by default in DB schema)
    const review = await Review.create({
      name,
      email,
      phone,
      designation,
      original_review_text: review_text,
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your review is pending moderation.',
      data: { id: review.id },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/reviews  (public, approved reviews with pagination)
export const getPublicReviews = async (req, res, next) => {
  try {
    const { page, limit } = paginate(req.query);
    const offset = (page - 1) * limit;

    const result = await Review.findPublic(limit, offset);

    return res.json({
      success: true,
      data: result.items,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/reviews/featured
export const getFeaturedReviews = async (req, res, next) => {
  try {
    const limit = Math.min(20, parseInt(req.query.limit, 10) || 5);
    const result = await Review.findPublic(limit, 0);
    const featured = result.items.filter((r) => r.is_featured);
    return res.json({ success: true, data: featured });
  } catch (err) {
    next(err);
  }
};

// ADMIN: GET /api/admin/reviews
export const getAdminReviews = async (req, res, next) => {
  try {
    const status = ['pending', 'approved', 'rejected'].includes(req.query.status)
      ? req.query.status
      : 'pending';

    const { page, limit } = paginate(req.query);
    const offset = (page - 1) * limit;

    // You currently have Review.findAdmin(status) that returns all rows.
    // For now, ignore pagination and just return everything, or adjust
    // the model later to accept limit/offset if needed.
    const reviews = await Review.findAdmin(status);

    return res.json({
      success: true,
      data: reviews,
      pagination: {
        page,
        limit,
        total: reviews.length,
        totalPages: 1,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ADMIN: POST /api/admin/reviews/:id/approve
export const approveReview = async (req, res, next) => {
  try {
    const review = await Review.updateStatus(req.params.id, 'approved');
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }
    return res.json({ success: true, message: 'Review approved.', data: review });
  } catch (err) {
    next(err);
  }
};

// ADMIN: POST /api/admin/reviews/:id/reject
export const rejectReview = async (req, res, next) => {
  try {
    const review = await Review.updateStatus(req.params.id, 'rejected');
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }
    return res.json({ success: true, message: 'Review rejected.', data: review });
  } catch (err) {
    next(err);
  }
};

// ADMIN: PUT /api/admin/reviews/:id/refine
export const refineReview = async (req, res, next) => {
  try {
    const { refined_review_text, admin_name } = req.body;
    const review = await Review.refine(req.params.id, refined_review_text, admin_name || 'Admin');
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }
    return res.json({ success: true, message: 'Review refined.', data: review });
  } catch (err) {
    next(err);
  }
};

// ADMIN: PUT /api/admin/reviews/:id/feature
export const featureReview = async (req, res, next) => {
  try {
    const review = await Review.toggleFeatured(req.params.id, req.body.is_featured);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }
    return res.json({
      success: true,
      message: `Review ${req.body.is_featured ? 'featured' : 'unfeatured'}.`,
      data: review,
    });
  } catch (err) {
    next(err);
  }
};

// ADMIN: PUT /api/admin/reviews/:id/pin
export const pinReview = async (req, res, next) => {
  try {
    const review = await Review.togglePinned(req.params.id, req.body.is_pinned);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }
    return res.json({
      success: true,
      message: `Review ${req.body.is_pinned ? 'pinned' : 'unpinned'}.`,
      data: review,
    });
  } catch (err) {
    next(err);
  }
};

// ADMIN: DELETE /api/admin/reviews/:id
export const deleteReview = async (req, res, next) => {
  try {
    const deleted = await Review.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }
    return res.json({ success: true, message: 'Review deleted.' });
  } catch (err) {
    next(err);
  }
};

// ADMIN: GET /api/admin/reviews/:id/versions
export const getReviewVersions = async (req, res, next) => {
  try {
    const versions = await Review.getVersions(req.params.id);
    return res.json({ success: true, data: versions });
  } catch (err) {
    next(err);
  }
};