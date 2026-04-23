import React, { useState } from "react";
import Layout from "./Layout";
import ProgressIndicator from "./ProgressIndicator";
import Upload from "./Upload";
import Preview from "./Preview";
import Generate from "./Generate";

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [sessionId, setSessionId] = useState("");
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  const handlePreviewReady = ({ session_id, columns: incomingColumns, rows: incomingRows }) => {
    setSessionId(session_id);
    setColumns(incomingColumns || []);
    setRows(incomingRows || []);
    setCurrentStep(2);
    setError("");
  };

  const handleBackToUpload = () => {
    setCurrentStep(1);
  };

  const handleProceedToGenerate = () => {
    setCurrentStep(3);
  };

  const handleBackToPreview = () => {
    setCurrentStep(2);
  };

  const resetFlow = () => {
    setSessionId("");
    setColumns([]);
    setRows([]);
    setError("");
    setCurrentStep(1);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <Upload onPreviewReady={handlePreviewReady} setError={setError} />;
      case 2:
        return (
          <Preview 
            columns={columns} 
            rows={rows} 
            onBack={handleBackToUpload}
            onProceed={handleProceedToGenerate}
          />
        );
      case 3:
        return (
          <Generate 
            sessionId={sessionId} 
            setError={setError} 
            onBack={handleBackToPreview}
          />
        );
      default:
        return <Upload onPreviewReady={handlePreviewReady} setError={setError} />;
    }
  };

  return (
    <Layout currentStep={currentStep}>
      {/* Error Display */}
      {error && (
        <div style={{
          backgroundColor: '#ffe6e6',
          border: '1px solid #ff9999',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '20px',
          color: '#cc0000'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Progress Indicator */}
      <ProgressIndicator currentStep={currentStep} />

      {/* Current Step Content */}
      {renderCurrentStep()}

      {/* Reset Button (shown only when not on first step) */}
      {currentStep > 1 && (
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <button
            onClick={resetFlow}
            style={{
              padding: '10px 20px',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease'
            }}
          >
            🔄 Start Over
          </button>
        </div>
      )}
    </Layout>
  );
}

export default App;