import React, { useEffect, useState } from "react";
import axios from "axios";

const AgencyTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("/agency").then(res => {
      if(res.data.status) setData(res.data.data);
    });
  }, []);

  return (
    <div className="card">
      <div className="card-header"><h3>Agencies</h3></div>
      <div className="card-body">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Owner</th>
              <th>Hosts</th>
              <th>Commission</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i}>
                <td>{item.name}</td>
                <td>{item.ownerId?.name}</td>
                <td>{item.hostCount}</td>
                <td>{item.totalCommission}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgencyTable;
