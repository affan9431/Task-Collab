import { useEffect, useState } from 'react';
import client from '../api/client';
import Navbar from '../components/Navbar';
import BoardCard from '../components/BoardCard';

const BoardsPage = () => {
  const [boards, setBoards] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const fetchBoards = async () => {
    const { data } = await client.get('/api/boards');
    setBoards(data);
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const createBoard = async (event) => {
    event.preventDefault();
    setError('');
    if (!name.trim()) return;
    try {
      await client.post('/api/boards', { name });
      setName('');
      fetchBoards();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create board');
    }
  };

  const deleteBoard = async (boardId) => {
    await client.delete(`/api/boards/${boardId}`);
    setBoards((prev) => prev.filter((board) => board._id !== boardId));
  };

  return (
    <div className="min-h-screen bg-grid px-6 py-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Navbar />
        <div className="glass-panel rounded-3xl p-6">
          <form onSubmit={createBoard} className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <h2 className="text-xl font-semibold">Your boards</h2>
              <p className="text-sm text-ink-700">Create or jump into your workspaces.</p>
            </div>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="New board name"
              className="flex-1 rounded-full border border-ink-900/20 px-4 py-3"
            />
            <button
              type="submit"
              className="rounded-full bg-ink-900 px-5 py-3 text-sm font-semibold text-white"
            >
              Create board
            </button>
          </form>
          {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {boards.map((board) => (
            <BoardCard key={board._id} board={board} onDelete={deleteBoard} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BoardsPage;
