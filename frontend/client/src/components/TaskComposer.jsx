import { useState } from 'react';

const TaskComposer = ({ onCreate }) => {
  const [title, setTitle] = useState('');

  const submit = (event) => {
    event.preventDefault();
    if (!title.trim()) return;
    onCreate(title.trim());
    setTitle('');
  };

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Add a task"
        className="flex-1 rounded-full border border-ink-900/20 px-3 py-2 text-sm"
      />
      <button
        type="submit"
        className="rounded-full bg-ink-900 px-3 py-2 text-xs font-semibold text-white"
      >
        Add
      </button>
    </form>
  );
};

export default TaskComposer;
