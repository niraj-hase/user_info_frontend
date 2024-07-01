import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditUserModal from './EditUserModal';
import '../public/styles/userList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    password: '',
    dob: '',
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const userData = JSON.parse(localStorage.getItem('userData')) || JSON.parse(sessionStorage.getItem('userData'));

        if (!token || !userData) {
          setError('No token found in storage.');
          setLoading(false);
          return;
        }

        setCurrentUser(userData);

        const response = await axios.get('http://localhost:8000/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const updatedUsers = response.data.data.map(user => ({
          ...user,
          dob: user.dob.split('T')[0],
        }));

        setUsers(updatedUsers);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name,
      password: '',
      dob: user.dob,
    });
    setModalIsOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleFormSubmit = async () => {
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      await axios.put(`http://localhost:8000/user/update/${selectedUser._id}`, editFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      window.location.reload();
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleDelete = async (userId) => {
    console.log('handle delete button clicked');
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      await axios.delete(`http://localhost:8000/user/delete/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="user-list-container">
      <h2>User List</h2>
      <table className="user-list-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Date of Birth</th>
            <th>Password</th>
            {currentUser.isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.isAdmin ? 'Admin' : 'User'}</td>
              <td>{user.dob}</td>
              <td>
                {currentUser.isAdmin || user._id === currentUser.id ? user.password : '********'}
              </td>
              {(currentUser.isAdmin || user._id === currentUser.id) && (
                <td>
                  <button className="edit-button" onClick={() => handleEdit(user)}>Edit</button>
                  {currentUser.isAdmin && (
                    <button className="delete-button" onClick={() => handleDelete(user._id)}>Delete</button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {modalIsOpen && (
        <EditUserModal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          onSubmit={handleFormSubmit}
          formData={editFormData}
          handleInputChange={handleInputChange}
        />
      )}
    </div>
  );
};

export default UserList;
