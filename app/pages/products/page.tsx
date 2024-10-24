'use client'
import BarChart from './BarChart';
import Statistics from './Statistics';

export default function Home() {
  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div style={{ flex: 3 }}>
        <BarChart />
      </div>
      <div style={{ flex: 1 }}>
        <Statistics />
      </div>
    </div>
  );
}
