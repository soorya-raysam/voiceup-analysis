import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const COLORS = ['#4caf50', '#f44336', '#ff9800'];

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [emotionFilter, setEmotionFilter] = useState('All');
  const [analysisCount, setAnalysisCount] = useState(0);
  const [resetMessage, setResetMessage] = useState('');

  const fetchAnalytics = () => {
    axios.get('http://127.0.0.1:5000/api/analytics-summary')
      .then((res) => {
        setData(res.data);
        setAnalysisCount(res.data.compliance.compliant + res.data.compliance.non_compliant);
      })
      .catch((err) => {
        console.error('Analytics fetch error', err);
        setData(null);
      });
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const resetAnalysis = async () => {
    await axios.post('http://127.0.0.1:5000/api/reset-analysis');
    setResetMessage('Analysis data has been reset.');
    setData(null);
    setAnalysisCount(0);
  };

  if (!data) return <div style={{ paddingTop: '100px', textAlign: 'center' }}>You have not analysed any conversations yet. Go to Chats page</div>;

  const complianceData = [
    { name: 'Compliant', value: data.compliance.compliant },
    { name: 'Non-Compliant', value: data.compliance.non_compliant },
  ];

  const filteredEmotions = emotionFilter === 'All'
    ? data.emotions
    : { [emotionFilter.toLowerCase()]: data.emotions[emotionFilter.toLowerCase()] };

  const emotionData = Object.entries(filteredEmotions).map(([emotion, value]) => ({
    name: emotion,
    value,
  }));

  const violationsData = Object.entries(data.violations).map(([rule, count]) => ({
    rule,
    count,
  }));

  return (
    <div 
      style={{
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '100px',
        paddingLeft: '1rem',
        paddingRight: '1rem',
      }}
    >
      <div style={{ maxWidth: '900px', width: '100%' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Analytics Dashboard
        </h1>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <button
            onClick={resetAnalysis}
            style={{
              backgroundColor: '#ef4444',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Reset Analysis
          </button>
          <span style={{ fontSize: '0.9rem' }}>
            Total Conversations Analyzed: <strong>{analysisCount}</strong>
          </span>
        </div>

        {resetMessage && (
          <p style={{ color: 'green', fontSize: '0.9rem', marginBottom: '1rem' }}>{resetMessage}</p>
        )}

        {/* Charts */}
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {/* Compliance Chart */}
          <div style={{ flex: 1, minWidth: '300px', background: '#fff', padding: '1rem', borderRadius: '8px' }}>
            <h2 style={{ fontWeight: '600', marginBottom: '1rem', color: '#000' }}>Compliance Overview</h2>
            <PieChart width={300} height={250}>
              <Pie
                data={complianceData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {complianceData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>

          {/* Emotion Chart */}
          <div style={{ flex: 1, minWidth: '300px', background: '#fff', padding: '1rem', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontWeight: '600', color: '#000' }}>Emotion Distribution</h2>
              <select
                value={emotionFilter}
                onChange={(e) => setEmotionFilter(e.target.value)}
                style={{ padding: '4px 8px', borderRadius: '4px' }}
              >
                <option>All</option>
                <option>Happy</option>
                <option>Angry</option>
                <option>Neutral</option>
              </select>
            </div>
            <PieChart width={300} height={250}>
              <Pie
                data={emotionData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {emotionData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>

        {/* Violations */}
        <div style={{ marginTop: '2rem', background: '#fff', padding: '1rem', borderRadius: '8px' }}>
          <h2 style={{ fontWeight: '600', marginBottom: '1rem', color: '#000' }}>Compliance Violations</h2>
          <BarChart width={600} height={300} data={violationsData}>
            <XAxis dataKey="rule" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
