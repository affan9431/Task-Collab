import { Link } from 'react-router-dom';

const BoardCard = ({ board, onDelete }) => {
  return (
    <div className="glass-panel rounded-3xl p-6 flex flex-col gap-4">
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{board.name}</h3>
        <p className="text-sm text-ink-700">{board.members?.length || 0} members</p>
      </div>
      <div className="flex items-center justify-between">
        <Link
          to={`/boards/${board._id}`}
          className="text-sm font-semibold underline underline-offset-4"
        >
          Open board
        </Link>
        <button
          type="button"
          onClick={() => onDelete(board._id)}
          className="text-sm text-rose-600 font-semibold"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default BoardCard;
