import ReactModal from "react-modal";
import "../styles/modal.css";

ReactModal.setAppElement("#root");

export default function Modal({ titulo, onClose, children, isOpen }) {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal-card"
      overlayClassName="modal-overlay"
      closeTimeoutMS={150}
    >
      <div className="modal-header">
        <span className="modal-title">{titulo}</span>
        <button className="modal-close" onClick={onClose}>
          <i className="ti ti-x" aria-hidden="true" />
        </button>
      </div>
      <div className="modal-body">
        {children}
      </div>
    </ReactModal>
  );
}
