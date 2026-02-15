import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import TaskComposer from './TaskComposer';

const ListColumn = ({
  list,
  tasks,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  onLoadMore
}) => {
  const { setNodeRef } = useDroppable({ id: list._id, data: { type: 'list' } });

  return (
    <div className="glass-panel rounded-3xl p-4 w-80 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{list.title}</h3>
        <span className="text-xs text-ink-700">{tasks.length} tasks</span>
      </div>
      <TaskComposer onCreate={(title) => onCreateTask(list._id, title)} />
      <div ref={setNodeRef} className="flex flex-col gap-3 min-h-[120px]">
        <SortableContext items={tasks.map((task) => task._id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onUpdate={onUpdateTask}
              onDelete={onDeleteTask}
            />
          ))}
        </SortableContext>
      </div>
      <button
        type="button"
        onClick={() => onLoadMore(list._id)}
        className="text-xs font-semibold text-ink-700"
      >
        Load more
      </button>
    </div>
  );
};

export default ListColumn;
