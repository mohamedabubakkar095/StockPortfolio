import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Pie, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function PortfolioChart({ stocks }) {
  const labels = stocks.map((stock) => stock.symbol);

  const investmentData = stocks.map(
    (stock) => Number(stock.buy_price) * Number(stock.quantity)
  );

  const currentValueData = stocks.map(
    (stock) => Number(stock.current_price) * Number(stock.quantity)
  );

  const profitData = stocks.map(
    (stock) =>
      (Number(stock.current_price) - Number(stock.buy_price)) *
      Number(stock.quantity)
  );

  const colors = [
    "#0d6efd",
    "#198754",
    "#dc3545",
    "#ffc107",
    "#6f42c1",
    "#20c997",
    "#fd7e14",
    "#6610f2",
  ];

  // =====================
  // BAR CHART
  // =====================
  const barData = {
    labels,
    datasets: [
      {
        label: "Investment",
        data: investmentData,
        backgroundColor: "#0d6efd",
      },
      {
        label: "Current Value",
        data: currentValueData,
        backgroundColor: "#198754",
      },
    ],
  };

  // =====================
  // PIE CHART
  // =====================
  const pieData = {
    labels,
    datasets: [
      {
        data: currentValueData,
        backgroundColor: colors,
      },
    ],
  };

  // =====================
  // LINE CHART
  // =====================
  const lineData = {
    labels,
    datasets: [
      {
        label: "Profit / Loss",
        data: profitData,
        borderColor: "#dc3545",
        backgroundColor: "#dc3545",
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <>
      <div className="row mb-4">

        <div className="col-lg-8 mb-4">
          <div className="card shadow border-0 rounded-4">
            <div className="card-body">
              <h5 className="mb-3">
                📊 Investment vs Current Value
              </h5>

              <Bar data={barData} options={options} />
            </div>
          </div>
        </div>

        <div className="col-lg-4 mb-4">
          <div className="card shadow border-0 rounded-4">
            <div className="card-body">
              <h5 className="mb-3">
                🥧 Portfolio Allocation
              </h5>

              <Pie data={pieData} />
            </div>
          </div>
        </div>

      </div>

      <div className="card shadow border-0 rounded-4">
        <div className="card-body">
          <h5 className="mb-3">
            📈 Profit / Loss Trend
          </h5>

          <Line data={lineData} options={options} />
        </div>
      </div>
    </>
  );
}

export default PortfolioChart;