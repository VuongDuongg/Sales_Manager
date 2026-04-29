// ===== COMPONENT CATEGORIES =====
// Component quản lý danh sách categories
import '../styles/Categories.css'

const Categories = ({
  categories,
  showAddForm,
  setShowAddForm,
  newCategory,
  setNewCategory,
  addCategory,
  deleteCategory,
  startEditCategory,
  editingId,
  editingType,
  cancelEdit
}) => {
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