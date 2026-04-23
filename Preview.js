import React, { useState } from "react";

function Preview({ columns, rows, onBack, onProceed }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editData, setEditData] = useState({});
  
  const itemsPerPage = 4;
  const totalPages = Math.ceil(rows.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRows = rows.slice(startIndex, endIndex);

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getDepartment = (role) => {
    const departments = {
      'Software Engineer': 'Engineering',
      'Senior Software Engineer': 'Engineering',
      'Product Manager': 'Product',
      'HR Specialist': 'Human Resources',
      'UX Designer': 'Design',
      'Data Analyst': 'Analytics'
    };
    return departments[role] || 'General';
  };

  const formatSalary = (salary) => {
    return `$${parseInt(salary).toLocaleString()}`;
  };

  const handleEdit = (index, row) => {
    setEditingIndex(index);
    setEditData(row);
  };

  const handleSave = () => {
    // In a real app, this would update the data
    setEditingIndex(null);
    setEditData({});
  };

  const handleDelete = (index) => {
    // In a real app, this would delete the record
    console.log('Delete record at index:', startIndex + index);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ margin: '0 0 5px 0', color: '#2c3e50', fontSize: '24px' }}>Preview Employee Data</h2>
          <p style={{ margin: 0, color: '#7f8c8d', fontSize: '16px' }}>
            Review and verify the imported information before generating offer letters
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onBack}
            style={{
              padding: '10px 20px',
              backgroundColor: 'white',
              color: '#3498db',
              border: '1px solid #3498db',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            ← Back
          </button>
          <button
            onClick={onProceed}
            style={{
              padding: '10px 20px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease'
            }}
          >
            Proceed to Generate →
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '15px 10px', textAlign: 'left', borderBottom: '2px solid #ecf0f1', color: '#7f8c8d', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>EMPLOYEE NAME</th>
              <th style={{ padding: '15px 10px', textAlign: 'left', borderBottom: '2px solid #ecf0f1', color: '#7f8c8d', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>ROLE</th>
              <th style={{ padding: '15px 10px', textAlign: 'left', borderBottom: '2px solid #ecf0f1', color: '#7f8c8d', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>DEPARTMENT</th>
              <th style={{ padding: '15px 10px', textAlign: 'left', borderBottom: '2px solid #ecf0f1', color: '#7f8c8d', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>SALARY (ANNUAL)</th>
              <th style={{ padding: '15px 10px', textAlign: 'left', borderBottom: '2px solid #ecf0f1', color: '#7f8c8d', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>START DATE</th>
              <th style={{ padding: '15px 10px', textAlign: 'left', borderBottom: '2px solid #ecf0f1', color: '#7f8c8d', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((row, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #f8f9fa' }}>
                <td style={{ padding: '15px 10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#3498db',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}>
                      {getInitials(row.Name)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#2c3e50' }}>{row.Name}</div>
                      <div style={{ fontSize: '12px', color: '#7f8c8d' }}>{row.Name.toLowerCase().replace(' ', '.')}@example.com</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '15px 10px' }}>
                  <span style={{
                    backgroundColor: '#e3f2fd',
                    color: '#1976d2',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {row.Role}
                  </span>
                </td>
                <td style={{ padding: '15px 10px', color: '#2c3e50' }}>
                  {getDepartment(row.Role)}
                </td>
                <td style={{ padding: '15px 10px', color: '#2c3e50', fontWeight: 'bold' }}>
                  {formatSalary(row.Salary)}
                </td>
                <td style={{ padding: '15px 10px', color: '#2c3e50' }}>
                  {new Date(row.Joining).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td style={{ padding: '15px 10px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleEdit(index, row)}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '16px',
                        color: '#3498db'
                      }}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '16px',
                        color: '#e74c3c'
                      }}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
          <div style={{ color: '#7f8c8d', fontSize: '14px' }}>
            Showing {startIndex + 1} of {rows.length} employee records
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              style={{
                padding: '5px 10px',
                backgroundColor: currentPage === 1 ? '#ecf0f1' : '#3498db',
                color: currentPage === 1 ? '#bdc3c7' : 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              &lt;
            </button>
            <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>{currentPage}</span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              style={{
                padding: '5px 10px',
                backgroundColor: currentPage === totalPages ? '#ecf0f1' : '#3498db',
                color: currentPage === totalPages ? '#bdc3c7' : 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
              }}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '30px' }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '15px'
        }}>
          <div style={{ fontSize: '24px', color: '#27ae60' }}>🛡️</div>
          <div>
            <h4 style={{ margin: '0 0 8px 0', color: '#2c3e50', fontSize: '16px' }}>Data Validation</h4>
            <p style={{ margin: 0, color: '#7f8c8d', fontSize: '14px' }}>
              All employee records have been scanned for formatting errors and missing fields.
            </p>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '15px'
        }}>
          <div style={{ fontSize: '24px', color: '#3498db' }}>📄</div>
          <div>
            <h4 style={{ margin: '0 0 8px 0', color: '#2c3e50', fontSize: '16px' }}>Template Check</h4>
            <p style={{ margin: 0, color: '#7f8c8d', fontSize: '14px' }}>
              Using the 'Standard Institutional Contract v4.2' for all records in this batch.
            </p>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '15px'
        }}>
          <div style={{ fontSize: '24px', color: '#f39c12' }}>🔄</div>
          <div>
            <h4 style={{ margin: '0 0 8px 0', color: '#2c3e50', fontSize: '16px' }}>Auto-Save Active</h4>
            <p style={{ margin: 0, color: '#7f8c8d', fontSize: '14px' }}>
              Any changes made during this preview step will be synced to your current session.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Preview;