const SearchFilter = ({ filters, onFilterChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="search-filter">
      <div className="search-box">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Search tasks by title..."
          className="search-input"
        />
        {filters.search && (
          <button
            className="search-clear"
            onClick={() => onFilterChange((prev) => ({ ...prev, search: '' }))}
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      <div className="filter-controls">
        <div className="filter-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={filters.status}
            onChange={handleChange}
          >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sortBy">Sort By</label>
          <select
            id="sortBy"
            name="sortBy"
            value={filters.sortBy}
            onChange={handleChange}
          >
            <option value="">Newest First</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>
        </div>

        {filters.sortBy && (
          <div className="filter-group">
            <label htmlFor="order">Order</label>
            <select
              id="order"
              name="order"
              value={filters.order}
              onChange={handleChange}
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;
