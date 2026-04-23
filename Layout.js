import React from 'react';

const Layout = ({ children, currentStep }) => {
  const menuItems = [
    { name: 'Dashboard', icon: '📊' },
    { name: 'Offer Letters', icon: '📝', active: true },
    { name: 'Templates', icon: '📄' },
    { name: 'Directory', icon: '👥' },
    { name: 'Settings', icon: '⚙️' },
  ];

  const bottomMenuItems = [
    { name: 'Help Center', icon: '❓' },
    { name: 'Log Out', icon: '🚪' },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Sidebar */}
      <div style={{
        width: '250px',
        backgroundColor: '#2c3e50',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px'
      }}>
        {/* Logo */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>LetterCraft HR</h2>
          <p style={{ margin: '5px 0 0 0', fontSize: '12px', opacity: 0.8 }}>INSTITUTIONAL PORTAL</p>
        </div>

        {/* Navigation Menu */}
        <div style={{ flex: 1 }}>
          {menuItems.map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 15px',
                marginBottom: '5px',
                borderRadius: '8px',
                backgroundColor: item.active ? '#34495e' : 'transparent',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
            >
              <span style={{ marginRight: '12px', fontSize: '18px' }}>{item.icon}</span>
              <span style={{ fontSize: '14px' }}>{item.name}</span>
            </div>
          ))}
        </div>

        {/* Bottom Menu */}
        <div>
          {bottomMenuItems.map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 15px',
                marginBottom: '5px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
            >
              <span style={{ marginRight: '12px', fontSize: '18px' }}>{item.icon}</span>
              <span style={{ fontSize: '14px' }}>{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, backgroundColor: '#f5f6fa', overflow: 'auto' }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px 30px',
          borderBottom: '1px solid #e1e8ed',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#2c3e50' }}>Offer Letter Generator</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '20px', cursor: 'pointer' }}>🔔</span>
            <span style={{ fontSize: '20px', cursor: 'pointer' }}>❓</span>
            <div style={{
              width: '35px',
              height: '35px',
              borderRadius: '50%',
              backgroundColor: '#3498db',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              U
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ padding: '30px' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
