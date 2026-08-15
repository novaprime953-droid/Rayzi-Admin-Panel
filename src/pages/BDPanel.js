import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Toast } from "../util/Toast";

const BDPanel = () => {
  const [invitations, setInvitations] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const bdId = useSelector((state) => state.admin.admin._id);

  useEffect(() => {
    fetchInvitations();
    fetchUsers();
  }, []);

  const fetchInvitations = async () => {
    try {
      const res = await axios.get(`invitation/bd?bdId=${bdId}`);
      if (res.data.status) setInvitations(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("user"); // Assuming there's a general user list endpoint
      if (res.data.status) {
        // Filter only users without roles
        const filtered = res.data.user.filter(u => u.role === 'user');
        setUsers(filtered);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleInvite = async () => {
    if (!selectedUser) return Toast("error", "Please select a user");
    setLoading(true);
    try {
      const res = await axios.post("invitation/inviteAgency", {
        bdId,
        userId: selectedUser,
        message
      });
      if (res.data.status) {
        Toast("success", "Invitation sent!");
        fetchInvitations();
        setSelectedUser("");
        setMessage("");
      } else {
        Toast("error", res.data.message);
      }
    } catch (err) {
      Toast("error", "Failed to send invitation");
    }
    setLoading(false);
  };

  return (
    <div className="container-fluid">
      <div className="page-title">
        <h3 className="text-white">BD Panel - Agency Invitations</h3>
      </div>

      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Invite New Agency</h5>
              <div className="mb-3">
                <label className="form-label text-white">Select User</label>
                <select
                  className="form-control"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                >
                  <option value="">Choose a User...</option>
                  {users.map(u => (
                    <option key={u._id} value={u._id}>{u.name} ({u.username})</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label text-white">Invitation Message</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Welcome to our platform..."
                ></textarea>
              </div>
              <button
                className="btn btn-danger w-100"
                onClick={handleInvite}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Invitation"}
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">My Invitations</h5>
              <table className="table table-dark">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {invitations.map(inv => (
                    <tr key={inv._id}>
                      <td>{inv.receiverId?.name || "N/A"}</td>
                      <td>
                        <span className={`badge bg-${inv.status === 'accepted' ? 'success' : inv.status === 'pending' ? 'warning' : 'danger'}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td>{new Date(inv.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BDPanel;
