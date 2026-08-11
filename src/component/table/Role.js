import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { permissionError } from "../../util/Alert";

const RoleTable = () => {
  const [data, setData] = useState([]);
  const hasPermission = useSelector((state) => state.admin.admin.flag);

  useEffect(() => {
    // Fetch users with roles
    axios.get("/getUsers").then(res => {
        if(res.data.status) {
            setData(res.data.user.filter(u => u.role !== 'user'));
        }
    });
  }, []);

  return (
    <>
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3 className="mb-3 text-light">Role Management</h3>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <table className="table table-striped text-center">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((user, i) => (
                    <tr key={i}>
                      <td>{user.username}</td>
                      <td><span className="badge badge-info">{user.role}</span></td>
                      <td>{user.roleStatus}</td>
                      <td>
                        <button className="btn btn-sm btn-danger">Suspend</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoleTable;
