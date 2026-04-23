import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

function Upload({ onPreviewReady, setError }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError("Please select a .csv or .xlsx file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setError("");
      const response = await axios.post(`${API_BASE_URL}/api/preview`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      onPreviewReady(response.data);
    } catch (err) {
      const message = err?.response?.data?.error || "Preview failed.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && (droppedFile.type === 'text/csv' || droppedFile.name.endsWith('.xlsx'))) {
      setFile(droppedFile);
    }
  };

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ margin: '0 0 10px 0', color: '#2c3e50', fontSize: '24px' }}>Import Employee Data</h2>
      <p style={{ margin: '0 0 30px 0', color: '#7f8c8d', fontSize: '16px' }}>
        Upload your employee data file to begin generating offer letters
      </p>
      
      <form onSubmit={handleSubmit}>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${isDragOver ? '#3498db' : '#bdc3c7'}`,
            borderRadius: '8px',
            padding: '40px',
            textAlign: 'center',
            backgroundColor: isDragOver ? '#f8f9fa' : '#fafbfc',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onClick={() => document.getElementById('fileUpload').click()}
        >
          <div style={{ fontSize: '48px', marginBottom: '20px', color: '#3498db' }}>📁</div>
          <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>
            {file ? file.name : 'Drop your file here or click to browse'}
          </h3>
          <p style={{ margin: '0', color: '#7f8c8d', fontSize: '14px' }}>
            Supports .csv and .xlsx files
          </p>
          <input
            id="fileUpload"
            type="file"
            accept=".csv,.xlsx"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
            style={{ display: 'none' }}
          />
        </div>

        {file && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#e8f5e8',
            borderRadius: '8px',
            border: '1px solid #27ae60'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', color: '#27ae60' }}>
              <span style={{ marginRight: '10px', fontSize: '20px' }}>✓</span>
              <span>File selected: {file.name}</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !file}
          style={{
            marginTop: '25px',
            padding: '12px 30px',
            backgroundColor: loading || !file ? '#bdc3c7' : '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: loading || !file ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s ease'
          }}
        >
          {loading ? "Uploading..." : "Upload & Preview Data"}
        </button>
      </form>
    </div>
  );
}

export default Upload;