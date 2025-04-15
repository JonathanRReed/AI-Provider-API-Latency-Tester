import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export type Metric = 'latency';

export interface ChartResponse {
  provider: string;
  model: string;
  latency: number | null;
}

interface Props {
  responses: ChartResponse[];
}

const METRIC_LABELS: Record<Metric, string> = {
  latency: 'Latency (ms)',
};

const TABS: Metric[] = ['latency'];

const getMetricValue = (r: ChartResponse, metric: Metric): number | null => {
  if (metric === 'latency') return r.latency;
  return null;
};

const formatMetric = (val: number | null, metric: Metric) => {
  if (val == null) return '-';
  if (metric === 'latency') return `${val} ms`;
  return val;
};

const ComparisonCharts: React.FC<Props> = ({ responses }) => {
  const [selected, setSelected] = useState<Metric>('latency');

  // Filter responses with valid metric values
  const filtered = responses.filter(r => getMetricValue(r, selected) !== null);
  const chartData = {
    labels: filtered.map(r => `${r.provider} (${r.model})`),
    datasets: [
      {
        label: METRIC_LABELS[selected],
        data: filtered.map(r => getMetricValue(r, selected)),
        backgroundColor: '#00f0ffcc',
        borderRadius: 6,
        maxBarThickness: 36,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: { callbacks: {
        label: (ctx: any) => `${formatMetric(ctx.parsed.y, selected)}`,
      } },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#00f0ff',
        },
        grid: { color: '#444' },
      },
      x: {
        ticks: { color: '#fff' },
        grid: { color: '#333' },
      },
    },
  };

  // Leaderboard: sorted descending for cost, ascending for latency
  const sorted = [...filtered].sort((a, b) => {
    const va = getMetricValue(a, selected);
    const vb = getMetricValue(b, selected);
    if (va == null) return 1;
    if (vb == null) return -1;
    if (selected === 'latency') return va - vb;
    return vb - va;
  });

  return (
    <div className="bg-oled/90 rounded-xl border border-cyan p-6 mt-8 shadow-lg transition-all duration-200 hover:shadow-[0_0_16px_4px_rgba(0,255,247,0.25)] hover:ring-2 hover:ring-cyan-400/80">
      <div className="flex gap-2 mb-6 justify-center">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`px-4 py-1 rounded-full font-semibold transition text-sm focus:outline-none focus:ring-2 ring-cyan ring-offset-2 ring-offset-oled
              ${selected === tab ? 'bg-cyan text-oled shadow' : 'bg-oled text-cyan border border-cyan hover:bg-cyan/20'}`}
            onClick={() => setSelected(tab)}
            aria-pressed={selected === tab}
          >
            {METRIC_LABELS[tab]}
          </button>
        ))}
      </div>
      <div className="w-full max-w-2xl mx-auto flex justify-center items-center min-h-[340px]">
        <Bar data={chartData} options={chartOptions} height={260} />
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-bold text-cyan mb-2 text-center">Leaderboard ({METRIC_LABELS[selected]})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-cyan">
                <th className="pr-4">Rank</th>
                <th className="pr-4">Provider</th>
                <th className="pr-4">Model</th>
                <th>{METRIC_LABELS[selected]}</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r, i) => (
                <tr key={r.provider + r.model} className="bg-card hover:bg-cyan/10 rounded">
                  <td className="pr-4 font-bold">{i + 1}</td>
                  <td className="pr-4">{r.provider}</td>
                  <td className="pr-4">{r.model}</td>
                  <td>{formatMetric(getMetricValue(r, selected), selected)}</td>
                </tr>
              ))}
              {sorted.length === 0 && (
                <tr><td colSpan={4} className="italic text-text/50">No data to display.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComparisonCharts;
