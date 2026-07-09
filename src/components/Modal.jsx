export default function Modal({ title, children, onClose, maxWidth = '580px' }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth }} onClick={e => e.stopPropagation()}>
        <div className="modal-box__header">
          <h2>{title}</h2>
          <button className="modal-box__close" onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}