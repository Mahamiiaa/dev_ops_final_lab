const priorityColors = {
  High: 'priority-high',
  Medium: 'priority-medium',
  Low: 'priority-low',
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'No due date';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const isOverdue = (dateStr) => {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date(new Date().toDateString());
};

const TaskCard = ({ task, onEdit, onDelete, onToggleStatus }) => {
  return (
    <div className={`task-card ${task.status === 'Completed' ? 'task-completed' : ''}`}>
      <div className="task-card-header">
        <div className="task-title-row">
          <input
            type="checkbox"
            checked={task.status === 'Completed'}
            onChange={() => onToggleStatus(task._id)}
            className="task-checkbox"
            title="Toggle status"
          />
          <h3 className="task-title">{task.title}</h3>
        </div>
        <span className={`task-priority ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-card-footer">
        <div className="task-meta">
          <span className="task-meta-item">
            🗓️ {formatDate(task.dueDate)}
            {isOverdue(task.dueDate) && task.status !== 'Completed' && (
              <span className="task-overdue"> (Overdue)</span>
            )}
          </span>
          <span className={`task-status-badge ${task.status === 'Completed' ? 'badge-completed' : 'badge-pending'}`}>
            {task.status}
          </span>
        </div>

        <div className="task-actions">
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => onEdit(task)}
            title="Edit task"
          >
            ✏️
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => onDelete(task._id)}
            title="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
