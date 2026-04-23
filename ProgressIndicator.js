import React from 'react';

const ProgressIndicator = ({ currentStep }) => {
  const steps = [
    { number: 1, name: 'Import', completed: currentStep >= 1, active: currentStep === 1 },
    { number: 2, name: 'Preview', completed: currentStep >= 2, active: currentStep === 2 },
    { number: 3, name: 'Generate', completed: currentStep >= 3, active: currentStep === 3 },
  ];

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          {/* Step Circle */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: step.completed ? '#27ae60' : step.active ? '#3498db' : '#ecf0f1',
                color: step.completed || step.active ? 'white' : '#95a5a6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '16px',
                border: step.active ? '2px solid #3498db' : 'none'
              }}
            >
              {step.completed ? '✓' : step.number}
            </div>
            <span
              style={{
                marginTop: '8px',
                fontSize: '14px',
                color: step.active ? '#3498db' : step.completed ? '#27ae60' : '#95a5a6',
                fontWeight: step.active ? 'bold' : 'normal'
              }}
            >
              {step.name}
            </span>
          </div>

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div
              style={{
                flex: 1,
                height: '2px',
                backgroundColor: steps[index + 1].completed ? '#27ae60' : '#ecf0f1',
                margin: '0 20px',
                marginTop: '-20px'
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProgressIndicator;
