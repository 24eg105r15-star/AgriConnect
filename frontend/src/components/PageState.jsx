export function LoadingState({ message = "Loading..." }) {
  return (
    <div className="page-state" role="status">
      <span className="loading-spinner" />
      <p>{message}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="page-state page-error" role="alert">
      <h3>Something went wrong</h3>
      <p>{message || "Please try again."}</p>
      {onRetry && (
        <button className="workspace-button" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, message }) {
  return (
    <div className="page-state">
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}