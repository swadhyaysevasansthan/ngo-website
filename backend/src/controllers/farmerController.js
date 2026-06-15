import pool from '../config/database.js';

export const getAllFarmers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        slug,
        designation,
        location,
        short_bio,
        profile_image,
        categories,
        is_featured
      FROM farmers
      WHERE is_active = true
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch farmers',
    });
  }
};

export const getFarmerBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT *
      FROM farmers
      WHERE slug = $1
      AND is_active = true
    `,
      [slug]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch farmer',
    });
  }
};

export const adminGetFarmers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM farmers
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch farmers',
    });
  }
};

export const createFarmer = async (req, res) => {
  try {
    const {
      name,
      slug,
      designation,
      location,
      short_bio,
      detailed_bio,
      profile_image,
      cover_image,
      phone,
      email,
      website,
      instagram,
      facebook,
      address,
      categories,
      achievements,
      products,
      gallery,
      is_featured,
      is_active,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO farmers (
        name,
        slug,
        designation,
        location,
        short_bio,
        detailed_bio,
        profile_image,
        cover_image,
        phone,
        email,
        website,
        instagram,
        facebook,
        address,
        categories,
        achievements,
        products,
        gallery,
        is_featured,
        is_active
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
        $11,$12,$13,$14,$15,$16,$17,$18,$19,$20
      )
      RETURNING *
      `,
      [
        name,
        slug,
        designation,
        location,
        short_bio,
        detailed_bio,
        profile_image,
        cover_image,
        phone,
        email,
        website,
        instagram,
        facebook,
        address,
        JSON.stringify(categories || []),
        JSON.stringify(achievements || []),
        JSON.stringify(products || []),
        JSON.stringify(gallery || []),
        is_featured || false,
        is_active ?? true,
      ]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Failed to create farmer',
    });
  }
};

export const updateFarmer = async (req, res) => {
  const { id } = req.params;

  try {
    const {
      name,
      slug,
      designation,
      location,
      short_bio,
      detailed_bio,
      profile_image,
      cover_image,
      phone,
      email,
      website,
      instagram,
      facebook,
      address,
      categories,
      achievements,
      products,
      gallery,
      is_featured,
      is_active,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE farmers
      SET
        name = $1,
        slug = $2,
        designation = $3,
        location = $4,
        short_bio = $5,
        detailed_bio = $6,
        profile_image = $7,
        cover_image = $8,
        phone = $9,
        email = $10,
        website = $11,
        instagram = $12,
        facebook = $13,
        address = $14,
        categories = $15,
        achievements = $16,
        products = $17,
        gallery = $18,
        is_featured = $19,
        is_active = $20,
        updated_at = NOW()
      WHERE id = $21
      RETURNING *
      `,
      [
        name,
        slug,
        designation,
        location,
        short_bio,
        detailed_bio,
        profile_image,
        cover_image,
        phone,
        email,
        website,
        instagram,
        facebook,
        address,
        JSON.stringify(categories || []),
        JSON.stringify(achievements || []),
        JSON.stringify(products || []),
        JSON.stringify(gallery || []),
        is_featured,
        is_active,
        id,
      ]
    );

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Failed to update farmer',
    });
  }
};

export const deleteFarmer = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      `
      DELETE FROM farmers
      WHERE id = $1
      `,
      [id]
    );

    res.json({
      success: true,
      message: 'Farmer deleted',
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Failed to delete farmer',
    });
  }
};

export const getFarmerCategories = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM farmer_categories
      ORDER BY name ASC
    `);

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
    });
  }
};

export const createFarmerCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const result = await pool.query(
      `
      INSERT INTO farmer_categories(name)
      VALUES($1)
      RETURNING *
      `,
      [name]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Failed to create category',
    });
  }
};

export const updateFarmerCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const categoryResult = await pool.query(
      `
      SELECT *
      FROM farmer_categories
      WHERE id = $1
      `,
      [id]
    );

    if (!categoryResult.rows.length) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    const oldName =
      categoryResult.rows[0].name;

    await pool.query(
      `
      UPDATE farmer_categories
      SET name = $1
      WHERE id = $2
      `,
      [name, id]
    );

    const farmers =
      await pool.query(`
        SELECT id, categories
        FROM farmers
      `);

    for (const farmer of farmers.rows) {
      const updatedCategories =
        (farmer.categories || []).map(
          (category) =>
            category === oldName
              ? name
              : category
        );

      await pool.query(
        `
        UPDATE farmers
        SET categories = $1
        WHERE id = $2
        `,
        [
          JSON.stringify(
            updatedCategories
          ),
          farmer.id,
        ]
      );
    }

    res.json({
      success: true,
      message:
        'Category updated successfully',
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        'Failed to update category',
    });
  }
};

export const deleteFarmerCategory =
  async (req, res) => {
    const { id } = req.params;

    try {
      const categoryResult =
        await pool.query(
          `
          SELECT *
          FROM farmer_categories
          WHERE id = $1
        `,
          [id]
        );

      if (!categoryResult.rows.length) {
        return res.status(404).json({
          success: false,
        });
      }

      const categoryName =
        categoryResult.rows[0].name;

      const farmers =
        await pool.query(`
          SELECT id, categories
          FROM farmers
        `);

      for (const farmer of farmers.rows) {
        const updatedCategories =
          (farmer.categories || []).filter(
            (category) =>
              category !== categoryName
          );

        await pool.query(
          `
          UPDATE farmers
          SET categories = $1
          WHERE id = $2
          `,
          [
            JSON.stringify(
              updatedCategories
            ),
            farmer.id,
          ]
        );
      }

      await pool.query(
        `
        DELETE FROM farmer_categories
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