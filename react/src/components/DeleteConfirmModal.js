import React from 'react';
import './DeleteConfirmModal.css';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title = 'Подтверждение удаления' }) => {
  if (!isOpen) return null;

  return (
    <div data-easytag="id1-react/src/components/DeleteConfirmModal.js" className="modal-overlay" onClick={onClose}>
      <div data-easytag="id2-react/src/components/DeleteConfirmModal.js" className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 data-easytag="id3-react/src/components/DeleteConfirmModal.js">{title}</h3>
        <p data-easytag="id4-react/src/components/DeleteConfirmModal.js">
          Вы уверены, что хотите удалить это объявление? Это действие нельзя отменить.
        </p>
        <div data-easytag="id5-react/src/components/DeleteConfirmModal.js" className="modal-actions">
          <button
            data-easytag="id6-react/src/components/DeleteConfirmModal.js"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Отмена
          </button>
          <button
            data-easytag="id7-react/src/components/DeleteConfirmModal.js"
            className="btn btn-danger"
            onClick={onConfirm}
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;