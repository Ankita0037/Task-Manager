import React from 'react';

const TaskCard = ({ task, onEdit, onDelete }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Pending':
        return { 
          bg: 'bg-amber-50', 
          text: 'text-amber-700', 
          ring: 'ring-amber-200',
          icon: '🕐'
        };
      case 'In Progress':
        return { 
          bg: 'bg-blue-50', 
          text: 'text-blue-700', 
          ring: 'ring-blue-200',
          icon: '⚡'
        };
      case 'Completed':
        return { 
          bg: 'bg-emerald-50', 
          text: 'text-emerald-700', 
          ring: 'ring-emerald-200',
          icon: '✓'
        };
      default:
        return { 
          bg: 'bg-gray-50', 
          text: 'text-gray-700', 
          ring: 'ring-gray-200',
          icon: '•'
        };
    }
  };

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'High':
        return { 
          bg: 'bg-red-50', 
          text: 'text-red-700', 
          ring: 'ring-red-200',
          icon: '🔥'
        };
      case 'Medium':
        return { 
          bg: 'bg-orange-50', 
          text: 'text-orange-700', 
          ring: 'ring-orange-200',
          icon: '⚠️'
        };
      case 'Low':
        return { 
          bg: 'bg-slate-50', 
          text: 'text-slate-600', 
          ring: 'ring-slate-200',
          icon: '📝'
        };
      default:
        return { 
          bg: 'bg-gray-50', 
          text: 'text-gray-700', 
          ring: 'ring-gray-200',
          icon: '•'
        };
    }
  };

  const statusConfig = getStatusConfig(task.status);
  const priorityConfig = getPriorityConfig(task.priority);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-2 h-2 rounded-full ${
              task.status === 'Completed' ? 'bg-emerald-500' :
              task.status === 'In Progress' ? 'bg-blue-500' : 'bg-amber-500'
            }`} />
            <h3 className="text-lg font-semibold text-gray-900 truncate">{task.title}</h3>
          </div>
          {task.description && (
            <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">{task.description}</p>
          )}
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold ring-1 ${statusConfig.bg} ${statusConfig.text} ${statusConfig.ring}`}>
          <span>{statusConfig.icon}</span>
          {task.status}
        </span>
        <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold ring-1 ${priorityConfig.bg} ${priorityConfig.text} ${priorityConfig.ring}`}>
          <span>{priorityConfig.icon}</span>
          {task.priority}
        </span>
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs">{formatDate(task.createdAt)}</span>
        </div>
        
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
            title="Edit task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
            title="Delete task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
