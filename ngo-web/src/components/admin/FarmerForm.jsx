import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { farmerAPI } from '../../utils/api';

const generateSlug = (text = '') => {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
};

const FarmerForm = ({
  farmer,
  onSave,
  onDelete,
}) => {
  const [form, setForm] = useState(farmer);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    setForm(farmer);
  }, [farmer]);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProfileUpload = async (e) => {
    if (!form.id) {
      toast.error(
        'Please save farmer first before uploading images'
      );
      return;
    }

    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append('image', file);

      const res =
        await farmerAPI.uploadProfileImage(
          form.id,
          formData
        );

      updateField(
        'profile_image',
        res.data.url
      );

      toast.success(
        'Profile image uploaded'
      );
    } catch (error) {
      toast.error(
        'Failed to upload profile image'
      );
    } finally {
      setUploading(false);
    }
  };

  const handleCoverUpload = async (e) => {
    if (!form.id) {
      toast.error(
        'Please save farmer first before uploading images'
      );
      return;
    }

    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append('image', file);

      const res =
        await farmerAPI.uploadCoverImage(
          form.id,
          formData
        );

      updateField(
        'cover_image',
        res.data.url
      );

      toast.success(
        'Cover image uploaded'
      );
    } catch (error) {
      toast.error(
        'Failed to upload cover image'
      );
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryUpload = async (e) => {
    if (!form.id) {
      toast.error(
        'Please save farmer first before uploading images'
      );
      return;
    }

    const files = Array.from(
      e.target.files || []
    );

    if (!files.length) return;

    try {
      setUploading(true);

      const formData = new FormData();

      files.forEach((file) => {
        formData.append(
          'images',
          file
        );
      });

      const res =
        await farmerAPI.uploadGallery(
          form.id,
          formData
        );

      updateField('gallery', [
        ...(form.gallery || []),
        ...res.data.urls,
      ]);

      toast.success(
        'Gallery images uploaded'
      );
    } catch (error) {
      toast.error(
        'Gallery upload failed'
      );
    } finally {
      setUploading(false);
    }
  };

  const addArrayItem = (field) => {
    updateField(field, [...(form[field] || []), '']);
  };

  const updateArrayItem = (
    field,
    index,
    value
  ) => {
    const updated = [...form[field]];
    updated[index] = value;

    updateField(field, updated);
  };

  const removeArrayItem = (
    field,
    index
  ) => {
    const updated = [...form[field]];

    updated.splice(index, 1);

    updateField(field, updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave(form);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">

      <h2 className="text-2xl font-bold mb-6">
        Farmer Details
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* BASIC INFO */}

        <div className="grid md:grid-cols-2 gap-4">

        <input
        type="text"
        placeholder="Name"
        value={form.name || ''}
        onChange={(e) => {
            const value = e.target.value;

            updateField('name', value);

            if (!form.id) {
            updateField(
                'slug',
                generateSlug(value)
            );
            }
        }}
        />

          <input
            type="text"
            placeholder="Slug"
            value={form.slug || ''}
            onChange={(e) =>
              updateField(
                'slug',
                e.target.value
              )
            }
            className="border rounded-lg px-4 py-3"
          />

          <input
            type="text"
            placeholder="Designation"
            value={
              form.designation || ''
            }
            onChange={(e) =>
              updateField(
                'designation',
                e.target.value
              )
            }
            className="border rounded-lg px-4 py-3"
          />

          <input
            type="text"
            placeholder="Location"
            value={form.location || ''}
            onChange={(e) =>
              updateField(
                'location',
                e.target.value
              )
            }
            className="border rounded-lg px-4 py-3"
          />
        </div>

        {/* SHORT BIO */}

        <textarea
          placeholder="Short Bio"
          value={form.short_bio || ''}
          onChange={(e) =>
            updateField(
              'short_bio',
              e.target.value
            )
          }
          rows={3}
          className="w-full border rounded-lg px-4 py-3"
        />

        {/* DETAILED BIO */}

        <textarea
          placeholder="Detailed Bio"
          value={
            form.detailed_bio || ''
          }
          onChange={(e) =>
            updateField(
              'detailed_bio',
              e.target.value
            )
          }
          rows={8}
          className="w-full border rounded-lg px-4 py-3"
        />

        {/* IMAGES */}

        <div className="space-y-4">

          <div>
            <label className="block font-semibold mb-2">
              Profile Image
            </label>  

            <input
              type="file"
              accept="image/*"
              onChange={handleProfileUpload}
            />

            {form.profile_image && (
              <div className="mt-3 space-y-3">

                <img
                  src={form.profile_image}
                  alt=""
                  onClick={() =>
                    setPreviewImage(
                      form.profile_image
                    )
                  }
                  className="w-32 h-32 object-cover rounded-xl cursor-pointer hover:opacity-90"
                />

                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await farmerAPI.deleteProfileImage(
                        form.id
                      );

                      updateField(
                        'profile_image',
                        ''
                      );

                      toast.success(
                        'Profile image removed'
                      );
                    } catch {
                      toast.error(
                        'Failed to remove image'
                      );
                    }
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Remove Image
                </button>

              </div>
            )}
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Cover Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
            />

            {form.cover_image && (
              <div className="mt-3 space-y-3">

                <img
                  src={form.cover_image}
                  alt=""
                  onClick={() =>
                    setPreviewImage(
                      form.cover_image
                    )
                  }
                  className="w-full h-48 object-cover rounded-xl cursor-pointer hover:opacity-90"
                />

                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await farmerAPI.deleteCoverImage(
                        form.id
                      );

                      updateField(
                        'cover_image',
                        ''
                      );

                      toast.success(
                        'Cover image removed'
                      );
                    } catch {
                      toast.error(
                        'Failed to remove image'
                      );
                    }
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Remove Cover
                </button>

              </div>
            )}
          </div>

        </div>

        {/* CONTACT */}

        <div className="grid md:grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Phone"
            value={form.phone || ''}
            onChange={(e) =>
              updateField(
                'phone',
                e.target.value
              )
            }
            className="border rounded-lg px-4 py-3"
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email || ''}
            onChange={(e) =>
              updateField(
                'email',
                e.target.value
              )
            }
            className="border rounded-lg px-4 py-3"
          />

          <input
            type="text"
            placeholder="Website"
            value={form.website || ''}
            onChange={(e) =>
              updateField(
                'website',
                e.target.value
              )
            }
            className="border rounded-lg px-4 py-3"
          />

          <input
            type="text"
            placeholder="Instagram"
            value={
              form.instagram || ''
            }
            onChange={(e) =>
              updateField(
                'instagram',
                e.target.value
              )
            }
            className="border rounded-lg px-4 py-3"
          />

          <input
            type="text"
            placeholder="Facebook"
            value={
              form.facebook || ''
            }
            onChange={(e) =>
              updateField(
                'facebook',
                e.target.value
              )
            }
            className="border rounded-lg px-4 py-3"
          />
        </div>

        <textarea
          placeholder="Address"
          value={form.address || ''}
          onChange={(e) =>
            updateField(
              'address',
              e.target.value
            )
          }
          rows={3}
          className="w-full border rounded-lg px-4 py-3"
        />

        {/* CATEGORIES */}

        <CategorySelector
          form={form}
          updateField={updateField}
        />

        {/* PRODUCTS */}

        <DynamicArrayField
          title="Products & Services"
          field="products"
          form={form}
          addArrayItem={addArrayItem}
          updateArrayItem={
            updateArrayItem
          }
          removeArrayItem={
            removeArrayItem
          }
        />

        {/* ACHIEVEMENTS */}

        <DynamicArrayField
          title="Achievements"
          field="achievements"
          form={form}
          addArrayItem={addArrayItem}
          updateArrayItem={
            updateArrayItem
          }
          removeArrayItem={
            removeArrayItem
          }
        />

        {/* GALLERY */}

        <div>

          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold">
              Gallery
            </h3>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleGalleryUpload}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">

            {(form.gallery || []).map(
              (image, index) => (
                <div
                  key={index}
                  className="relative"
                >

                  <img
                    src={image.url}
                    alt=""
                    onClick={() =>
                      setPreviewImage(image.url)
                    }
                    className="w-full h-32 object-cover rounded-xl cursor-pointer"
                  />

                  <button
                    type="button"
                    onClick={async () => {
                      try {

                        await farmerAPI.deleteGalleryImage(
                          form.id,
                          image.url
                        );

                        updateField(
                          'gallery',
                          form.gallery.filter(
                            (g) =>
                              g.url !== image.url
                          )
                        );

                        toast.success(
                          'Gallery image removed'
                        );

                      } catch {
                        toast.error(
                          'Failed to remove image'
                        );
                      }
                    }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center"
                  >
                    ×
                  </button>

                </div>
              )
            )}

          </div>

        </div>

        {/* TOGGLES */}

        <div className="flex gap-8">

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={
                form.is_featured ||
                false
              }
              onChange={(e) =>
                updateField(
                  'is_featured',
                  e.target.checked
                )
              }
            />

            Featured
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={
                form.is_active ?? true
              }
              onChange={(e) =>
                updateField(
                  'is_active',
                  e.target.checked
                )
              }
            />

            Active
          </label>
        </div>

        {/* ACTIONS */}

        <div className="flex gap-4">

          <button
            type="submit"
            className="bg-primary text-white px-6 py-3 rounded-lg"
          >
            Save Farmer
          </button>

          {form.id && (
            <button
              type="button"
              onClick={() =>
                onDelete(form.id)
              }
              className="bg-red-500 text-white px-6 py-3 rounded-lg"
            >
              Delete Farmer
            </button>
          )}
        </div>
      </form>
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-6"
          onClick={() =>
            setPreviewImage(null)
          }
        >
          <img
            src={previewImage}
            alt=""
            className="max-w-[95vw] max-h-[95vh] rounded-xl shadow-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          />

          <button
            className="absolute top-5 right-5 text-white text-5xl"
            onClick={() =>
              setPreviewImage(null)
            }
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

const CategorySelector = ({
  form,
  updateField,
}) => {
  const [categories, setCategories] =
    useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res =
        await farmerAPI.getCategories();

      setCategories(
        res.data.data || []
      );
    } catch {}
  };

  return (
    <div>

      <h3 className="font-bold mb-3">
        Categories
      </h3>

      <div className="grid md:grid-cols-2 gap-2">

        {categories.map((category) => (
          <label
            key={category.id}
            className="flex items-center gap-2"
          >
            <input
              type="checkbox"
              checked={
                form.categories?.includes(
                  category.name
                ) || false
              }
              onChange={(e) => {
                const current =
                  form.categories || [];

                if (
                  e.target.checked
                ) {
                  updateField(
                    'categories',
                    [
                      ...current,
                      category.name,
                    ]
                  );
                } else {
                  updateField(
                    'categories',
                    current.filter(
                      (c) =>
                        c !==
                        category.name
                    )
                  );
                }
              }}
            />

            {category.name}
          </label>
        ))}

      </div>
    </div>
  );
};

const DynamicArrayField = ({
  title,
  field,
  form,
  addArrayItem,
  updateArrayItem,
  removeArrayItem,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold">
          {title}
        </h3>

        <button
          type="button"
          onClick={() =>
            addArrayItem(field)
          }
          className="text-primary"
        >
          + Add
        </button>
      </div>

      <div className="space-y-2">
        {(form[field] || []).map(
          (item, index) => (
            <div
              key={index}
              className="flex gap-2"
            >
              <input
                value={item}
                onChange={(e) =>
                  updateArrayItem(
                    field,
                    index,
                    e.target.value
                  )
                }
                className="flex-1 border rounded-lg px-3 py-2"
              />

              <button
                type="button"
                onClick={() =>
                  removeArrayItem(
                    field,
                    index
                  )
                }
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          )
        )}
        
      </div>
      
    </div>
    
  );
};

export default FarmerForm;