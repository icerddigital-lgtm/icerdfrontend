export default function Toast({ message, type = 'success' }) {
  return (
    <div className="toast-container">
      <div className={`toast toast--${type}`}>
        {type === 'success' && '✅ '}
        {type === 'error' && '❌ '}
        {type === 'warning' && '⚠️ '}
        {type === 'info' && 'ℹ️ '}
        {message}
      </div>
    </div>
  );
}