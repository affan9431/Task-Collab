import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';

const TaskCard = ({ task, onUpdate, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task._id,
    data: { type: 'task', listId: task.list }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: 'none'
  };

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({
    title: task.title,
    priority: task.priority,
    status: task.status
  });

  const save = () => {
    onUpdate(task._id, draft);
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`rounded-2xl border border-ink-900/10 bg-white px-4 py-3 shadow-sm transition cursor-grab ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="select-none">
          <span className="text-xs uppercase tracking-widest text-ink-700">Drag</span>
        </div>
        <button
          type="button"
          onClick={() => onDelete(task._id)}
          className="text-xs text-rose-600 font-semibold"
        >
          Delete
        </button>
      </div>
      {isEditing ? (
        <div className="mt-3 space-y-2">
          <input
            value={draft.title}
            onChange={(event) => setDraft({ ...draft, title: event.target.value })}
            className="w-full rounded-xl border border-ink-900/20 px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            <select
              value={draft.priority}
              onChange={(event) => setDraft({ ...draft, priority: event.target.value })}
              className="w-full rounded-xl border border-ink-900/20 px-3 py-2 text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <select
              value={draft.status}
              onChange={(event) => setDraft({ ...draft, status: event.target.value })}
              className="w-full rounded-xl border border-ink-900/20 px-3 py-2 text-sm"
            >
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={save}
              className="rounded-full bg-ink-900 px-3 py-2 text-xs font-semibold text-white"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-full border border-ink-900 px-3 py-2 text-xs font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-2" onDoubleClick={() => setIsEditing(true)}>
          <h4 className="text-sm font-semibold">{task.title}</h4>
          <div className="mt-2 flex gap-2 text-xs text-ink-700">
            <span className="rounded-full bg-amber-100 px-2 py-1 text-amber-700">
              {task.priority}
            </span>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">
              {task.status}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
