import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

function Generate({ sessionId, setError, onBack }) {
  const [format, setFormat] = useState("txt");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        `${API_BASE_URL}/api/generate`,
        { session_id: sessionId, format },
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/zip" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `offer_letters_${format}.zip`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(link.href);
    } catch (err) {
      let message = "Failed to generate offer letters.";
      if (err?.response?.data) {
        try {
          const parsed = JSON.parse(await err.response.data.text());
          message = parsed.error || message;
        } catch (_ignored) {
          message = "Failed to generate offer letters.";
        }
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ margin: '0 0 5px 0', color: '#2c3e50', fontSize: '24px' }}>Generate Offer Letters</h2>
          <p style={{ margin: 0, color: '#7f8c8d', fontSize: '16px' }}>
            Choose your preferred format and generate personalized offer letters for all employees
          </p>
        </div>
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
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px' }}>
        {/* Format Selection Card */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#2c3e50', fontSize: '18px' }}>Output Format</h3>
          
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '10px', color: '#2c3e50', fontWeight: 'bold' }}>
              Select Format:
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '15px',
                  border: `2px solid ${format === 'txt' ? '#3498db' : '#ecf0f1'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: format === 'txt' ? '#f8f9fa' : 'white',
                  transition: 'all 0.3s ease'
                }}
              >
                <input
                  type="radio"
                  value="txt"
                  checked={format === 'txt'}
                  onChange={(event) => setFormat(event.target.value)}
                  style={{ marginRight: '12px' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', color: '#2c3e50' }}>Text Format (.txt)</div>
                  <div style={{ fontSize: '12px', color: '#7f8c8d', marginTop: '2px' }}>
                    Plain text files - Compatible with all systems
                  </div>
                </div>
                <span style={{ fontSize: '20px' }}>📄</span>
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '15px',
                  border: `2px solid ${format === 'pdf' ? '#3498db' : '#ecf0f1'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: format === 'pdf' ? '#f8f9fa' : 'white',
                  transition: 'all 0.3s ease'
                }}
              >
                <input
                  type="radio"
                  value="pdf"
                  checked={format === 'pdf'}
                  onChange={(event) => setFormat(event.target.value)}
                  style={{ marginRight: '12px' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', color: '#2c3e50' }}>PDF Format (.pdf)</div>
                  <div style={{ fontSize: '12px', color: '#7f8c8d', marginTop: '2px' }}>
                    Professional PDF documents - Print-ready
                  </div>
                </div>
                <span style={{ fontSize: '20px' }}>📑</span>
              </label>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: loading ? '#bdc3c7' : '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            {loading ? (
              <>
                <span>⏳</span>
                <span>Generating Letters...</span>
              </>
            ) : (
              <>
                <span>🚀</span>
                <span>Generate & Download ZIP</span>
              </>
            )}
          </button>
        </div>

        {/* Summary Card */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#2c3e50', fontSize: '18px' }}>Generation Summary</h3>
          
          <div style={{ marginBottom: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span style={{ color: '#7f8c8d' }}>Total Employees:</span>
              <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>Ready to process</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span style={{ color: '#7f8c8d' }}>Output Format:</span>
              <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>{format.toUpperCase()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span style={{ color: '#7f8c8d' }}>Template:</span>
              <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>Standard Contract v4.2</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#7f8c8d' }}>Estimated Size:</span>
              <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>~2-5 MB</span>
            </div>
          </div>

          <div style={{
            padding: '15px',
            backgroundColor: '#e8f5e8',
            borderRadius: '8px',
            border: '1px solid #27ae60',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', color: '#27ae60' }}>
              <span style={{ marginRight: '10px', fontSize: '20px' }}>✓</span>
              <span>All records validated and ready for generation</span>
            </div>
          </div>

          <div style={{
            padding: '15px',
            backgroundColor: '#fff3cd',
            borderRadius: '8px',
            border: '1px solid #f39c12'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', color: '#f39c12' }}>
              <span style={{ marginRight: '10px', fontSize: '20px' }}>💡</span>
              <span style={{ fontSize: '14px' }}>
                Generated files will be downloaded as a ZIP archive containing individual offer letters for each employee.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Generate;