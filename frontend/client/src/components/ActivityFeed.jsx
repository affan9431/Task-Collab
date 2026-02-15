const ActivityFeed = ({ activities }) => {
  return (
    <div className="glass-panel rounded-3xl p-4 space-y-3">
      <h3 className="text-sm font-semibold">Activity</h3>
      <div className="space-y-2 text-sm text-ink-700">
        {activities.length === 0 ? (
          <p>No activity yet.</p>
        ) : (
          activities.map((activity) => (
            <div key={activity._id} className="border-b border-ink-900/10 pb-2">
              <p className="font-medium text-ink-900">{activity.message}</p>
              <p className="text-xs">
                {new Date(activity.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
