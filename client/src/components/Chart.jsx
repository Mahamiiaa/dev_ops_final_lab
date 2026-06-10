const Chart = ({ completed, pending }) => {
  const total = completed + pending;
  const completedPercent = total > 0 ? (completed / total) * 100 : 0;
  const pendingPercent = total > 0 ? (pending / total) * 100 : 0;

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>📈 Task Progress</h3>
        <span className="chart-subtitle">Completed vs Pending</span>
      </div>

      {/* Progress Bar */}
      <div className="chart-progress-bar">
        <div className="progress-track">
          <div
            className="progress-fill progress-completed"
            style={{ width: `${completedPercent}%` }}
            title={`${completedPercent.toFixed(0)}% completed`}
          />
          <div
            className="progress-fill progress-pending"
            style={{
              width: `${pendingPercent}%`,
              marginLeft: `${completedPercent}%`,
            }}
            title={`${pendingPercent.toFixed(0)}% pending`}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="chart-legend">
        <div className="legend-item">
          <span className="legend-dot dot-completed"></span>
          <span className="legend-label">Completed</span>
          <span className="legend-value">
            {completed} ({completedPercent.toFixed(1)}%)
          </span>
        </div>
        <div className="legend-item">
          <span className="legend-dot dot-pending"></span>
          <span className="legend-label">Pending</span>
          <span className="legend-value">
            {pending} ({pendingPercent.toFixed(1)}%)
          </span>
        </div>
      </div>

      {/* Simple bar chart */}
      <div className="chart-bars">
        <div className="bar-group">
          <div className="bar-label">Completed</div>
          <div className="bar-track">
            <div
              className="bar-fill bar-completed"
              style={{ height: `${completedPercent}%` }}
            />
          </div>
          <div className="bar-count">{completed}</div>
        </div>
        <div className="bar-group">
          <div className="bar-label">Pending</div>
          <div className="bar-track">
            <div
              className="bar-fill bar-pending"
              style={{ height: `${pendingPercent}%` }}
            />
          </div>
          <div className="bar-count">{pending}</div>
        </div>
      </div>
    </div>
  );
};

export default Chart;
