import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { farmerAPI } from '../../utils/api';

const FarmerCategoriesPanel = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState('');

  const loadCategories = async () => {
    try {
      const res = await farmerAPI.getCategories();

      setCategories(res.data.data || []);
    } catch {
      toast.error('Failed to load categories');
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const createCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      await farmerAPI.createCategory({
        name: newCategory,
      });

      toast.success('Category created');

      setNewCategory('');

      loadCategories();
    } catch {
      toast.error('Failed to create category');
    }
  };

  const saveCategory = async (id) => {
    try {
      await farmerAPI.updateCategory(id, {
        name: editingValue,
      });

      toast.success('Category updated');

      setEditingId(null);

      loadCategories();
    } catch {
      toast.error('Failed to update category');
    }
  };

  const deleteCategory = async (id) => {
    if (
      !window.confirm(
        'Delete this category?'
      )
    ) {
      return;
    }

    try {
      await farmerAPI.deleteCategory(id);

      toast.success('Category deleted');

      loadCategories();
    } catch {
      toast.error('Failed to delete category');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-5">

      <h2 className="text-xl font-bold mb-4">
        🏷️ Categories
      </h2>

      <input
        type="text"
        placeholder="Search categories..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="w-full border rounded-lg px-3 py-2 mb-4"
      />

      <div className="space-y-2 mb-5">

        {categories
          .filter((category) =>
            category.name
              .toLowerCase()
              .includes(
                search.toLowerCase()
              )
          )
          .map((category) => (
            <div
              key={category.id}
              className="border rounded-lg p-3"
            >
              {editingId === category.id ? (
                <div className="flex gap-2">
                  <input
                    value={editingValue}
                    onChange={(e) =>
                      setEditingValue(
                        e.target.value
                      )
                    }
                    className="flex-1 border rounded-lg px-3 py-2"
                  />

                  <button
                    onClick={() =>
                      saveCategory(
                        category.id
                      )
                    }
                    className="bg-green-500 text-white px-3 rounded"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center">

                  <span>
                    {category.name}
                  </span>

                  <div className="flex gap-2">

                    <button
                      onClick={() => {
                        setEditingId(
                          category.id
                        );

                        setEditingValue(
                          category.name
                        );
                      }}
                    >
                      ✏️
                    </button>

                    <button
                      onClick={() =>
                        deleteCategory(
                          category.id
                        )
                      }
                    >
                      🗑️
                    </button>

                  </div>
                </div>
              )}
            </div>
          ))}
      </div>

      <div className="flex gap-2">

        <input
          value={newCategory}
          onChange={(e) =>
            setNewCategory(
              e.target.value
            )
          }
          placeholder="New category"
          className="flex-1 border rounded-lg px-3 py-2"
        />

        <button
          onClick={createCategory}
          className="bg-primary text-white px-4 rounded-lg"
        >
          Add
        </button>

      </div>
    </div>
  );
};

export default FarmerCategoriesPanel;