import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getTasks, getTaskStats, deleteTask, toggleTaskStatus } from '../services/api';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import SearchFilter from './SearchFilter';
import Pagination from './Pagination';
import Chart from './Chart';

const ITEMS_PER_PAGE = 6;

const Dashboard = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    sortBy: '',
    order: 'desc',
  });

  const fetchTasks = useCallback(async () => {
    try {
      const data = await getTasks({
        ...filters,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      });
      // Handle paginated response with metadata
      if (data.tasks) {
        setTasks(data.tasks);
        setTotalPages(data.totalPages || 1);
      } else {
        // Fallback if server doesn't support pagination
        setTasks(data);
        setTotalPages(1);
      }
    } catch (err) {
      toast.error('Failed to fetch tasks');
    }
  }, [filters, currentPage, toast]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await getTaskStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchTasks(), fetchStats()]);
    setLoading(false);
  }, [fetchTasks, fetchStats]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.search, filters.status, filters.sortBy, filters.order]);

  const handleTaskCreated = () => {
    setShowForm(false);
    setEditingTask(null);
    toast.success('Task saved successfully!');
    fetchData();
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
        toast.success('Task deleted successfully');
        fetchData();
      } catch (err) {
        toast.error('Failed to delete task');
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const task = tasks.find((t) => t._id === id);
      await toggleTaskStatus(id);
      toast.success(
        `Task marked as ${task?.status === 'Completed' ? 'Pending' : 'Completed'}`
      );
      fetchData();
    } catch (err) {
      toast.error('Failed to toggle task status');
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-welcome">
          <h2>
            Welcome, <span className="highlight">{user?.name}</span> 👋
          </h2>
          <p>Here's your task overview</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
          disabled={showForm}
        >
          + New Task
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-total">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>{stats.total}</h3>
            <p>Total Tasks</p>
          </div>
        </div>
        <div className="stat-card stat-completed">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{stats.completed}</h3>
            <p>Completed</p>
          </div>
        </div>
        <div className="stat-card stat-pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>{stats.pending}</h3>
            <p>Pending</p>
          </div>
        </div>
      </div>

      {/* Dashboard Chart */}
      <Chart completed={stats.completed} pending={stats.pending} />

      {/* Task Form Modal */}
      {showForm && (
        <TaskForm
          task={editingTask}
          onSuccess={handleTaskCreated}
          onCancel={handleCancelForm}
        />
      )}

      {/* Search & Filter */}
      <SearchFilter filters={filters} onFilterChange={setFilters} />

      {/* Task List */}
      <TaskList
        tasks={tasks}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Dashboard;
