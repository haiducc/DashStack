// components/Statistics.js
const Statistics = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' , alignItems: "end"}}>
        <div style={statBoxStyle}>
          <h3>Lợi Nhuận</h3>
          <h1>40,689,012.235</h1>
          <span>8.5% Ngày hôm qua</span>
        </div>
        <div style={statBoxStyles}>
          <h3>Số Dư Hiện Tại</h3>
          <h1>40,689,012.235</h1>
          <span>8.5% Ngày hôm qua</span>
        </div>
      </div>
    );
  };
  
  const statBoxStyle = {
    backgroundColor: "#67B173",
    color: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    width: "fit-content"
  };
  const statBoxStyles = {
    backgroundColor: "#8667B1",
    color: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    width: "fit-content"
  };
  
  export default Statistics;
  