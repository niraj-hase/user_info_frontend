import React from 'react';
import Modal from 'react-modal';
import '../public/styles/EditUserModal.css';

const EditUserModal = ({ isOpen, onRequestClose, onSubmit, formData, handleInputChange }) => {
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(); 
      onRequestClose(); 
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} ariaHideApp={false} className="modal">
      <h2>Edit User</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit">Save</button>
          <button type="button" onClick={onRequestClose}>Cancel</button>
        </div>
      </form>
    </Modal>
  );
};

export default EditUserModal;
