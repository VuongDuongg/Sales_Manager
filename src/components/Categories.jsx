// ===== COMPONENT CATEGORIES =====
// Component quản lý danh sách categories
import '../styles/Categories.css'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

const Categories = ({ categories, onCategoriesUpdate, socket }) => {
  const { token } = useAuth()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: ''
  })
  const [editingId, setEditingId] = useState(null)
  const [editingType, setEditingType] = useState(null)

  // API base URL
  const API_BASE_URL = 'http://localhost:3001/api'

  // Helper function for authenticated API calls
  const authenticatedFetch = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    return fetch(url, {
      ...options,
      headers
    })
  }

  // Add or update category
  const addCategory = async (e) => {
    e.preventDefault()

    if (!newCategory.name) {
      alert('Please enter a category name')
      return
    }

    try {
      const url = editingId
        ? `${API_BASE_URL}/categories/${editingId}`
        : `${API_BASE_URL}/categories`

      const method = editingId ? 'PUT' : 'POST'

      const response = await authenticatedFetch(url, {
        method,
        body: JSON.stringify({
          name: newCategory.name,
          description: newCategory.description
        })
      })

      if (response.ok) {
        setNewCategory({
          name: '',
          description: ''
        })
        setShowAddForm(false)
        setEditingId(null)
        setEditingType(null)
        onCategoriesUpdate() // Refresh categories list
      } else {
        const error = await response.json()
        alert(`Error: ${error.error || 'Failed to save category'}`)
      }
    } catch (error) {
      console.error('Error saving category:', error)
      alert('Failed to save category')
    }
  }

  // Delete category
  const deleteCategory = async (id) => {
    if (!confirm('Are you sure you want to delete this category? This may affect products using this category.')) return

    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        onCategoriesUpdate() // Refresh categories list
      } else {
        const error = await response.json()
        alert(`Error: ${error.error || 'Failed to delete category'}`)
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Failed to delete category')
    }
  }

  // Start editing category
  const startEditCategory = (category) => {
    setNewCategory({
      name: category.name,
      description: category.description || ''
    })
    setEditingId(category.id)
    setEditingType('category')
    setShowAddForm(true)
  }

  // Cancel editing
  const cancelEdit = () => {
    setNewCategory({
      name: '',
      description: ''
    })
    setEditingId(null)
    setEditingType(null)
    setShowAddForm(false)
  }
  return (
    <div className="content">
      {/* Header với tiêu đề và nút thêm */}
      <div className="content-header">
        <h2>🏷️ Categories</h2>
        <div className="content-actions">
          <button
            onClick={() => {
              if (showAddForm) {
                cancelEdit()
              } else {
                setShowAddForm(true)
              }
            }}
            className="add-btn"
          >
            {showAddForm ? 'Cancel' : '+ Add Category'}
          </button>
        </div>
      </div>

      {/* Form thêm/chỉnh sửa category */}
      {showAddForm && (
        <form onSubmit={addCategory} className="add-form">
          <h3>{editingId && editingType === 'category' ? 'Edit Category' : 'Add New Category'}</h3>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              value={newCategory.description}
              onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn">
              {editingId && editingType === 'category' ? 'Update Category' : 'Add Category'}
            </button>
            {editingId && editingType === 'category' && (
              <button type="button" onClick={cancelEdit} className="cancel-btn">
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      )}

      {/* Grid hiển thị danh sách categories */}
      <div className="categories-grid">
        {categories.length > 0 ? (
          categories.map(category => (
            <div key={category.id} className="category-card">
              <h3>{category.name}</h3>
              {category.description && <p className="description">{category.description}</p>}
              <div className="card-actions">
                <button
                  onClick={() => startEditCategory(category)}
                  className="edit-btn"
                >
                  ✎ Edit
                </button>
                <button
                  onClick={() => deleteCategory(category.id)}
                  className="delete-btn"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>No categories found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Categories