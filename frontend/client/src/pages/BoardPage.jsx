import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DndContext, closestCorners } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import client from '../api/client';
import { createSocket } from '../socket/socket';
import Navbar from '../components/Navbar';
import ListColumn from '../components/ListColumn';
import ActivityFeed from '../components/ActivityFeed';
import useAuthContext from '../hooks/useAuth';

const BoardPage = () => {
  const { boardId } = useParams();
  const { token } = useAuthContext();
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [memberEmail, setMemberEmail] = useState('');
  const [listTitle, setListTitle] = useState('');
  const [search, setSearch] = useState('');
  const [pages, setPages] = useState({});

  const tasksByList = useMemo(() => {
    const map = {};
    lists.forEach((list) => {
      map[list._id] = tasks
        .filter((task) => task.list === list._id)
        .sort((a, b) => a.position - b.position);
    });
    return map;
  }, [lists, tasks]);

  useEffect(() => {
    const loadBoard = async () => {
      const { data } = await client.get(`/api/boards/${boardId}`);
      setBoard(data.board);
      setLists(data.lists);
      setTasks(data.tasks);
    };

    const loadActivities = async () => {
      const { data } = await client.get(`/api/activities?boardId=${boardId}&limit=20`);
      setActivities(data.items);
    };

    loadBoard();
    loadActivities();
  }, [boardId]);

  useEffect(() => {
    const socket = createSocket(token);
    socket.emit('join-board', boardId);

    socket.on('task-created', (task) => {
      setTasks((prev) => [...prev, task]);
    });

    socket.on('task-updated', (task) => {
      setTasks((prev) => prev.map((item) => (item._id === task._id ? task : item)));
    });

    socket.on('task-moved', (task) => {
      setTasks((prev) => prev.map((item) => (item._id === task._id ? task : item)));
    });

    socket.on('task-deleted', (payload) => {
      setTasks((prev) => prev.filter((item) => item._id !== payload._id));
    });

    socket.on('list-created', (list) => {
      setLists((prev) => [...prev, list]);
    });

    socket.on('activity-added', (activity) => {
      setActivities((prev) => [activity, ...prev]);
    });

    return () => {
      socket.emit('leave-board', boardId);
      socket.disconnect();
    };
  }, [boardId, token]);

  const createList = async (event) => {
    event.preventDefault();
    if (!listTitle.trim()) return;
    await client.post('/api/lists', { boardId, title: listTitle });
    setListTitle('');
  };

  const addMember = async (event) => {
    event.preventDefault();
    if (!memberEmail.trim()) return;
    await client.put(`/api/boards/${boardId}/members`, { email: memberEmail });
    setMemberEmail('');
  };

  const createTask = async (listId, title) => {
    await client.post('/api/tasks', { boardId, listId, title });
  };

  const updateTask = async (taskId, payload) => {
    await client.put(`/api/tasks/${taskId}`, payload);
  };

  const deleteTask = async (taskId) => {
    await client.delete(`/api/tasks/${taskId}`);
  };

  const loadMore = async (listId) => {
    const nextPage = (pages[listId] || 1) + 1;
    const { data } = await client.get(
      `/api/tasks?boardId=${boardId}&listId=${listId}&page=${nextPage}&limit=10`
    );

    setPages((prev) => ({ ...prev, [listId]: nextPage }));
    setTasks((prev) => [...prev, ...data.items]);
  };

  const runSearch = async () => {
    if (!search.trim()) return;
    const { data } = await client.get(`/api/tasks?boardId=${boardId}&search=${search}&limit=50`);
    setTasks(data.items);
  };

  const clearSearch = async () => {
    setSearch('');
    const { data } = await client.get(`/api/boards/${boardId}`);
    setTasks(data.tasks);
  };

  const onDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    const activeListId = active.data.current?.listId;
    const overListId = over.data.current?.type === 'task' ? over.data.current.listId : overId;

    if (!activeListId || !overListId) return;

    if (activeListId === overListId && activeId === overId) return;

    const currentTasks = tasksByList[activeListId] || [];
    const targetTasks = tasksByList[overListId] || [];

    const activeIndex = currentTasks.findIndex((task) => task._id === activeId);
    const overIndex = targetTasks.findIndex((task) => task._id === overId);

    let newPosition = targetTasks.length;
    if (overIndex >= 0) {
      newPosition = overIndex;
    }

    setTasks((prev) =>
      prev.map((task) => {
        if (task._id === activeId) {
          return { ...task, list: overListId, position: newPosition };
        }
        return task;
      })
    );

    if (activeListId === overListId) {
      const ordered = arrayMove(currentTasks, activeIndex, overIndex);
      setTasks((prev) =>
        prev.map((task) => {
          const updatedIndex = ordered.findIndex((item) => item._id === task._id);
          if (updatedIndex === -1) return task;
          return { ...task, position: updatedIndex };
        })
      );
    }

    await client.put(`/api/tasks/${activeId}/move`, {
      listId: overListId,
      position: newPosition
    });
  };

  if (!board) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grid px-6 py-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Navbar />
        <div className="glass-panel rounded-3xl p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">{board.name}</h2>
              <p className="text-sm text-ink-700">
                {board.members?.length || 0} members · Live updates enabled
              </p>
            </div>
            <form onSubmit={addMember} className="flex gap-2">
              <input
                value={memberEmail}
                onChange={(event) => setMemberEmail(event.target.value)}
                placeholder="Invite by email"
                className="rounded-full border border-ink-900/20 px-4 py-2 text-sm"
              />
              <button
                type="submit"
                className="rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-white"
              >
                Add
              </button>
            </form>
          </div>
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <form onSubmit={createList} className="flex flex-1 gap-2">
              <input
                value={listTitle}
                onChange={(event) => setListTitle(event.target.value)}
                placeholder="New list title"
                className="flex-1 rounded-full border border-ink-900/20 px-4 py-2 text-sm"
              />
              <button
                type="submit"
                className="rounded-full border border-ink-900 px-4 py-2 text-sm font-semibold"
              >
                Add list
              </button>
            </form>
            <div className="flex gap-2">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search tasks"
                className="rounded-full border border-ink-900/20 px-4 py-2 text-sm"
              />
              <button
                type="button"
                onClick={runSearch}
                className="rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-white"
              >
                Search
              </button>
              <button
                type="button"
                onClick={clearSearch}
                className="rounded-full border border-ink-900 px-4 py-2 text-sm font-semibold"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <DndContext collisionDetection={closestCorners} onDragEnd={onDragEnd}>
            <div className="flex gap-6 overflow-x-auto pb-4">
              {lists.map((list) => (
                <ListColumn
                  key={list._id}
                  list={list}
                  tasks={tasksByList[list._id] || []}
                  onCreateTask={createTask}
                  onUpdateTask={updateTask}
                  onDeleteTask={deleteTask}
                  onLoadMore={loadMore}
                />
              ))}
            </div>
          </DndContext>
          <ActivityFeed activities={activities} />
        </div>
      </div>
    </div>
  );
};

export default BoardPage;
