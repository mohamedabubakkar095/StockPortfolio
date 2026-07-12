import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function PortfolioChart({ stocks }) {
  const barData = {
    labels: stocks.map((stock) => stock.symbol),

    datasets: [
      {
        label: "Investment",
        data: stocks.map(
          (stock) => Number(stock.buy_price) * Number(stock.quantity)
        ),
      },
      {
        label: "Current Value",
        data: stocks.map(
          (stock) => Number(stock.current_price) * Number(stock.quantity)
        ),
      },
    ],
  };

  const pieData = {
    labels: stocks.map((stock) => stock.symbol),

    datasets: [
      {
        label: "Portfolio Allocation",
        data: stocks.map(
          (stock) => Number(stock.current_price) * Number(stock.quantity)
        ),
      },
    ],
  };

  const options = {
    responsive: true,

    plugins: {
      legend: {
        position: "top",
      },

      title: {
        display: true,
        text: "Stock Portfolio Overview",
      },
    },
  };

  return (
    <div className="row">
      <div className="col-md-8">
        <Bar data={barData} options={options} />
      </div>

      <div className="col-md-4">
        <Pie data={pieData} />
      </div>
    </div>
  );
}

export default PortfolioChart;