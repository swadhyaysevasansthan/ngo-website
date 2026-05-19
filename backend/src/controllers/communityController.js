import pool from '../config/database.js';
import cloudinary from '../config/cloudinary.js';

const generateSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-\$)/g, '');

export const getPublicTopics = async (req, res) => {
  try {
    const result = await pool.query(`SELECT id, slug, title, description, hero_image_url, display_order FROM community_topics WHERE is_active = true ORDER BY display_order ASC, created_at ASC`);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Get public topics error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch communities.' });
  }
};

export const getPublicTopicBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const topicResult = await pool.query(`SELECT * FROM community_topics WHERE slug = \$1 AND is_active = true`, [slug]);
    if (topicResult.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found.' });
    const topic = topicResult.rows[0];
    const [sectionsRes, imagesRes, eventsRes, statsRes] = await Promise.all([
      pool.query(`SELECT * FROM community_sections WHERE topic_id = \$1 ORDER BY display_order`, [topic.id]),
      pool.query(`SELECT * FROM community_images WHERE topic_id = \$1 ORDER BY display_order`, [topic.id]),
      pool.query(`SELECT * FROM community_events WHERE topic_id = \$1 ORDER BY display_order`, [topic.id]),
      pool.query(`SELECT * FROM community_stats WHERE topic_id = \$1 ORDER BY display_order`, [topic.id]),
    ]);
    res.json({ success: true, data: { ...topic, sections: sectionsRes.rows, images: imagesRes.rows, events: eventsRes.rows, stats: statsRes.rows } });
  } catch (error) {
    console.error('Get topic by slug error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch topic.' });
  }
};

export const getAdminTopics = async (req, res) => {
  try {
    const result = await pool.query(`SELECT t.*, (SELECT COUNT(*) FROM community_images WHERE topic_id = t.id) AS image_count, (SELECT COUNT(*) FROM community_events WHERE topic_id = t.id) AS event_count FROM community_topics t ORDER BY display_order ASC, created_at ASC`);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch topics.' });
  }
};

export const getAdminTopicById = async (req, res) => {
  const { id } = req.params;
  try {
    const topicResult = await pool.query(`SELECT * FROM community_topics WHERE id = \$1`, [id]);
    if (topicResult.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found.' });
    const topic = topicResult.rows[0];
    const [sectionsRes, imagesRes, eventsRes, statsRes] = await Promise.all([
      pool.query(`SELECT * FROM community_sections WHERE topic_id = \$1 ORDER BY display_order`, [id]),
      pool.query(`SELECT * FROM community_images WHERE topic_id = \$1 ORDER BY display_order`, [id]),
      pool.query(`SELECT * FROM community_events WHERE topic_id = \$1 ORDER BY display_order`, [id]),
      pool.query(`SELECT * FROM community_stats WHERE topic_id = \$1 ORDER BY display_order`, [id]),
    ]);
    res.json({ success: true, data: { ...topic, sections: sectionsRes.rows, images: imagesRes.rows, events: eventsRes.rows, stats: statsRes.rows } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch topic.' });
  }
};

export const createTopic = async (req, res) => {
  const { title, description, is_active, display_order } = req.body;
  try {
    const slug = generateSlug(title);
    const existing = await pool.query(`SELECT id FROM community_topics WHERE slug = \$1`, [slug]);
    if (existing.rows.length > 0) return res.status(400).json({ success: false, message: 'Topic with similar name exists.' });
    const result = await pool.query(`INSERT INTO community_topics (slug, title, description, is_active, display_order) VALUES (\$1, \$2, \$3, \$4, \$5) RETURNING *`, [slug, title.trim(), description || null, is_active !== false, display_order || 0]);
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create topic.' });
  }
};

export const updateTopic = async (req, res) => {
  const { id } = req.params;
  const { title, description, is_active, display_order } = req.body;
  try {
    const result = await pool.query(`UPDATE community_topics SET title=\$1, description=\$2, is_active=\$3, display_order=\$4, updated_at=NOW() WHERE id=\$5 RETURNING *`, [title.trim(), description || null, is_active !== false, display_order || 0, id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found.' });
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update topic.' });
  }
};

export const deleteTopic = async (req, res) => {
  const { id } = req.params;
  try {
    const imgs = await pool.query(`SELECT public_id FROM community_images WHERE topic_id = \$1`, [id]);
    const topic = await pool.query(`SELECT hero_image_public_id FROM community_topics WHERE id = \$1`, [id]);
    const ids = imgs.rows.map(i => i.public_id).filter(Boolean);
    if (topic.rows[0] && topic.rows[0].hero_image_public_id) ids.push(topic.rows[0].hero_image_public_id);
    if (ids.length > 0) { try { await cloudinary.api.delete_resources(ids); } catch(e) { console.error('Cloudinary cleanup:', e); } }
    const del = await pool.query(`DELETE FROM community_topics WHERE id = \$1 RETURNING id`, [id]);
    if (del.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found.' });
    res.json({ success: true, message: 'Topic deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete topic.' });
  }
};

export const uploadImages = async (req, res) => {
  const { id } = req.params;
  try {
    const topicCheck = await pool.query(`SELECT id, slug FROM community_topics WHERE id = \$1`, [id]);
    if (topicCheck.rows.length === 0) return res.status(404).json({ success: false, message: 'Topic not found.' });
    if (!req.files || req.files.length === 0) return res.status(400).json({ success: false, message: 'No images.' });
    const slug = topicCheck.rows[0].slug;
    const uploaded = [];
    const fs = (await import('fs')).default;
    const sharp = (await import('sharp')).default;
    for (const file of req.files) {
      let uploadPath = file.path;
      const ext = file.originalname.toLowerCase().slice(file.originalname.lastIndexOf('.'));
      const isHeic = ext === '.heic' || ext === '.heif';

      // Reject HEIC files — ask admin to convert to JPG first
      if (isHeic) {
        fs.unlinkSync(file.path);
        return res.status(400).json({ success: false, message: 'HEIC files are not supported. Please convert to JPG before uploading (iPhone: Settings → Camera → Formats → Most Compatible).' });
      }

      // Compress if over 9MB
      const stats = fs.statSync(uploadPath);
      if (stats.size > 9 * 1024 * 1024) {
        const compressedPath = uploadPath + '_compressed.jpg';
        await sharp(uploadPath).resize(2000, 2000, { fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 90 }).toFile(compressedPath);
        fs.unlinkSync(uploadPath);
        uploadPath = compressedPath;
      }

      const r = await cloudinary.uploader.upload(uploadPath, {
        folder: `communities/${slug}`,
        resource_type: 'image',
      });
      const db = await pool.query(`INSERT INTO community_images (topic_id, image_url, public_id, caption, display_order) VALUES (\$1,\$2,\$3,\$4,\$5) RETURNING *`, [id, r.secure_url, r.public_id, req.body.caption || null, req.body.display_order || 0]);
      uploaded.push(db.rows[0]);
      if (fs.existsSync(uploadPath)) fs.unlinkSync(uploadPath);
    }
    res.status(201).json({ success: true, data: uploaded });
  } catch (error) {
    console.error('Upload images error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload images.', error: error.message || String(error) });
  }
};

export const uploadHeroImage = async (req, res) => {
  const { id } = req.params;
  try {
    const t = await pool.query(`SELECT id, slug, hero_image_public_id FROM community_topics WHERE id = \$1`, [id]);
    if (t.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found.' });
    if (!req.file) return res.status(400).json({ success: false, message: 'No image.' });
    const topic = t.rows[0];
    if (topic.hero_image_public_id) { try { await cloudinary.uploader.destroy(topic.hero_image_public_id); } catch(e) {} }
    const r = await cloudinary.uploader.upload(req.file.path, { folder: `communities/${topic.slug}`, transformation: [{ width: 1920, height: 800, crop: 'fill', quality: 'auto' }] });
    await pool.query(`UPDATE community_topics SET hero_image_url=\$1, hero_image_public_id=\$2, updated_at=NOW() WHERE id=\$3`, [r.secure_url, r.public_id, id]);
    const fs = (await import('fs')).default;
    fs.unlinkSync(req.file.path);
    res.json({ success: true, data: { url: r.secure_url, public_id: r.public_id } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to upload hero image.' });
  }
};

export const deleteHeroImage = async (req, res) => {
  const { id } = req.params;
  try {
    const t = await pool.query(`SELECT id, hero_image_public_id FROM community_topics WHERE id = $1`, [id]);
    if (t.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found.' });
    const topic = t.rows[0];
    if (topic.hero_image_public_id) { try { await cloudinary.uploader.destroy(topic.hero_image_public_id); } catch(e) {} }
    await pool.query(`UPDATE community_topics SET hero_image_url = NULL, hero_image_public_id = NULL, updated_at = NOW() WHERE id = $1`, [id]);
    res.json({ success: true, message: 'Hero image removed.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to remove hero image.' });
  }
};

export const deleteImage = async (req, res) => {
  const { imageId } = req.params;
  try {
    const img = await pool.query(`SELECT id, public_id FROM community_images WHERE id = \$1`, [imageId]);
    if (img.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found.' });
    if (img.rows[0].public_id) { try { await cloudinary.uploader.destroy(img.rows[0].public_id); } catch(e) {} }
    await pool.query(`DELETE FROM community_images WHERE id = \$1`, [imageId]);
    res.json({ success: true, message: 'Deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete image.' });
  }
};

export const updateImage = async (req, res) => {
  const { imageId } = req.params;
  const { caption, display_order } = req.body;
  try {
    const result = await pool.query(`UPDATE community_images SET caption=COALESCE(\$1,caption), display_order=COALESCE(\$2,display_order) WHERE id=\$3 RETURNING *`, [caption, display_order, imageId]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found.' });
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update image.' });
  }
};

export const createEvent = async (req, res) => {
  const { id } = req.params;
  const { title, description, event_date, event_type, display_order } = req.body;
  try {
    const result = await pool.query(`INSERT INTO community_events (topic_id, title, description, event_date, event_type, display_order) VALUES (\$1,\$2,\$3,\$4,\$5,\$6) RETURNING *`, [id, title.trim(), description || null, event_date || null, event_type || 'past', display_order || 0]);
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create event.' });
  }
};

export const updateEvent = async (req, res) => {
  const { eventId } = req.params;
  const { title, description, event_date, event_type, display_order } = req.body;
  try {
    const result = await pool.query(`UPDATE community_events SET title=\$1, description=\$2, event_date=\$3, event_type=\$4, display_order=\$5, updated_at=NOW() WHERE id=\$6 RETURNING *`, [title.trim(), description || null, event_date || null, event_type || 'past', display_order || 0, eventId]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found.' });
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update event.' });
  }
};

export const deleteEvent = async (req, res) => {
  const { eventId } = req.params;
  try {
    const result = await pool.query(`DELETE FROM community_events WHERE id = \$1 RETURNING id`, [eventId]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found.' });
    res.json({ success: true, message: 'Deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete event.' });
  }
};

export const createSection = async (req, res) => {
  const { id } = req.params;
  const { heading, content, section_type, display_order } = req.body;
  try {
    const result = await pool.query(`INSERT INTO community_sections (topic_id, heading, content, section_type, display_order) VALUES (\$1,\$2,\$3,\$4,\$5) RETURNING *`, [id, heading.trim(), content || null, section_type || 'general', display_order || 0]);
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create section.' });
  }
};

export const updateSection = async (req, res) => {
  const { sectionId } = req.params;
  const { heading, content, section_type, display_order } = req.body;
  try {
    const result = await pool.query(`UPDATE community_sections SET heading=\$1, content=\$2, section_type=\$3, display_order=\$4, updated_at=NOW() WHERE id=\$5 RETURNING *`, [heading.trim(), content || null, section_type || 'general', display_order || 0, sectionId]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found.' });
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update section.' });
  }
};

export const deleteSection = async (req, res) => {
  const { sectionId } = req.params;
  try {
    const result = await pool.query(`DELETE FROM community_sections WHERE id = \$1 RETURNING id`, [sectionId]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found.' });
    res.json({ success: true, message: 'Deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete section.' });
  }
};

export const createStat = async (req, res) => {
  const { id } = req.params;
  const { label, value, icon, display_order } = req.body;
  try {
    const result = await pool.query(`INSERT INTO community_stats (topic_id, label, value, icon, display_order) VALUES (\$1,\$2,\$3,\$4,\$5) RETURNING *`, [id, label.trim(), value.trim(), icon || null, display_order || 0]);
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create stat.' });
  }
};

export const updateStat = async (req, res) => {
  const { statId } = req.params;
  const { label, value, icon, display_order } = req.body;
  try {
    const result = await pool.query(`UPDATE community_stats SET label=\$1, value=\$2, icon=\$3, display_order=\$4 WHERE id=\$5 RETURNING *`, [label.trim(), value.trim(), icon || null, display_order || 0, statId]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found.' });
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update stat.' });
  }
};

export const deleteStat = async (req, res) => {
  const { statId } = req.params;
  try {
    const result = await pool.query(`DELETE FROM community_stats WHERE id = \$1 RETURNING id`, [statId]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found.' });
    res.json({ success: true, message: 'Deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete stat.' });
  }
};
