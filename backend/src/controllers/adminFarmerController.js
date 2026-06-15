import pool from '../config/database.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

export const uploadProfileImage =
  async (req, res) => {
    try {
      const { id } = req.params;

      const farmer =
        await pool.query(
          `
          SELECT slug
          FROM farmers
          WHERE id = $1
        `,
          [id]
        );

      if (!farmer.rows.length) {
        return res.status(404).json({
          success: false,
          message: 'Farmer not found',
        });
      }

      const result =
        await cloudinary.uploader.upload(
          req.file.path,
          {
            folder: `farmers/${farmer.rows[0].slug}`,
          }
        );

      fs.unlinkSync(req.file.path);

      await pool.query(
        `
        UPDATE farmers
        SET
          profile_image = $1,
          profile_image_public_id = $2
        WHERE id = $3
      `,
        [
          result.secure_url,
          result.public_id,
          id,
        ]
      );

      res.json({
        success: true,
        url: result.secure_url,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: 'Upload failed',
      });
    }
  };

export const uploadCoverImage =
  async (req, res) => {
    try {
      const { id } = req.params;

      const farmer =
        await pool.query(
          `
          SELECT slug
          FROM farmers
          WHERE id = $1
        `,
          [id]
        );

      if (!farmer.rows.length) {
        return res.status(404).json({
          success: false,
          message: 'Farmer not found',
        });
      }

      const result =
        await cloudinary.uploader.upload(
          req.file.path,
          {
            folder: `farmers/${farmer.rows[0].slug}`,
          }
        );

      fs.unlinkSync(req.file.path);

      await pool.query(
        `
        UPDATE farmers
        SET
          cover_image = $1,
          cover_image_public_id = $2
        WHERE id = $3
      `,
        [
          result.secure_url,
          result.public_id,
          id,
        ]
      );

      res.json({
        success: true,
        url: result.secure_url,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: 'Upload failed',
      });
    }
  };

export const uploadGalleryImages =
  async (req, res) => {
    try {
      const { id } = req.params;

      const farmer =
        await pool.query(
          `
          SELECT slug, gallery
          FROM farmers
          WHERE id = $1
        `,
          [id]
        );

      const existing =
        farmer.rows[0].gallery || [];

      const uploaded = [];

      for (const file of req.files) {
        const result =
          await cloudinary.uploader.upload(
            file.path,
            {
              folder: `farmers/${farmer.rows[0].slug}`,
            }
          );

        uploaded.push({
          url: result.secure_url,
          public_id: result.public_id,
        });

        fs.unlinkSync(file.path);
      }

      await pool.query(
        `
        UPDATE farmers
        SET gallery = $1
        WHERE id = $2
      `,
        [
          JSON.stringify([
            ...existing,
            ...uploaded,
          ]),
          id,
        ]
      );

      res.json({
        success: true,
        urls: uploaded,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
      });
    }
  };

export const deleteProfileImage = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const farmer =
      await pool.query(
        `
        SELECT profile_image_public_id
        FROM farmers
        WHERE id = $1
      `,
        [id]
      );

    const publicId =
      farmer.rows[0]
        ?.profile_image_public_id;

    if (publicId) {
      await cloudinary.uploader.destroy(
        publicId
      );
    }

    await pool.query(
      `
      UPDATE farmers
      SET
        profile_image = NULL,
        profile_image_public_id = NULL
      WHERE id = $1
    `,
      [id]
    );

    res.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
    });
  }
};

export const deleteCoverImage = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const farmer =
      await pool.query(
        `
        SELECT cover_image_public_id
        FROM farmers
        WHERE id = $1
      `,
        [id]
      );

    const publicId =
      farmer.rows[0]
        ?.cover_image_public_id;

    if (publicId) {
      await cloudinary.uploader.destroy(
        publicId
      );
    }

    await pool.query(
      `
      UPDATE farmers
      SET
        cover_image = NULL,
        cover_image_public_id = NULL
      WHERE id = $1
    `,
      [id]
    );

    res.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
    });
  }
};

export const deleteGalleryImage =
  async (req, res) => {
    try {
      const { id } = req.params;
      const { imageUrl } = req.body;

      const farmer =
        await pool.query(
          `
          SELECT gallery
          FROM farmers
          WHERE id = $1
        `,
          [id]
        );

      const gallery =
        farmer.rows[0].gallery || [];

      const image =
        gallery.find(
          (img) =>
            img.url === imageUrl
        );

      if (
        image?.public_id
      ) {
        await cloudinary.uploader.destroy(
          image.public_id
        );
      }

      const updatedGallery =
        gallery.filter(
          (img) =>
            img.url !== imageUrl
        );

      await pool.query(
        `
        UPDATE farmers
        SET gallery = $1
        WHERE id = $2
      `,
        [
          JSON.stringify(
            updatedGallery
          ),
          id,
        ]
      );

      res.json({
        success: true,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
      });
    }
  };