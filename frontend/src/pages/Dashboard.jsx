import { useEffect, useState } from "react";
import API from "../services/api";
import PortfolioChart from "../components/PortfolioChart";
import { toast } from "react-toastify";
import "./Dashboard.css";

import {
  FaWallet,
  FaChartLine,
  FaCoins,
  FaBriefcase,
  FaFilePdf,
  FaFileExcel,
  FaSyncAlt,
  FaSearch,
} from "react-icons/fa";

function Dashboard() {
  // ===========================
  // STATES
  // ===========================
  const [stocks, setStocks] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("company");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");
  const [formData, setFormData] = useState({
    company_name: "",
    symbol: "",
    quantity: "",
    buy_price: "",
    current_price: "",
  });

  // ===========================
  // LOAD STOCKS
  // ===========================
  useEffect(() => {
    fetchStocks();
  }, []);

  // ===========================
  // FETCH STOCKS
  // ===========================
  const fetchStocks = async () => {
    setLoading(true);
    try {
      const res = await API.get("stocks/");
      if (Array.isArray(res.data)) {
        setStocks(res.data);
        setLastUpdated(new Date().toLocaleString());

      } else if (Array.isArray(res.data.results)) {
        setStocks(res.data.results);
        setLastUpdated(new Date().toLocaleString());
      } else {
        setStocks([]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load stocks");
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // INPUT CHANGE
  // ===========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ===========================
  // ADD / UPDATE STOCK
  // ===========================
  const addStock = async (e) => {
    e.preventDefault();
    const payload = {
      company_name: formData.company_name,
      symbol: formData.symbol.toUpperCase(),
      quantity: Number(formData.quantity),
      buy_price: Number(formData.buy_price),
      current_price: Number(formData.current_price),
    };

    try {
      if (isEditing) {
        await API.put(`stocks/${editingId}/`, payload);
        toast.success("Stock Updated Successfully");
      } else {
        await API.post("stocks/", payload);
        toast.success("Stock Added Successfully");
      }

      setFormData({
        company_name: "",
        symbol: "",
        quantity: "",
        buy_price: "",
        current_price: "",
      });
      setEditingId(null);
      setIsEditing(false);
      fetchStocks();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  // ===========================
  // EDIT STOCK
  // ===========================
  const editStock = (stock) => {
    setEditingId(stock.id);
    setIsEditing(true);
    setFormData({
      company_name: stock.company_name,
      symbol: stock.symbol,
      quantity: stock.quantity,
      buy_price: stock.buy_price,
      current_price: stock.current_price,
    });
  };

  // ===========================
  // CANCEL EDIT
  // ===========================
  const cancelEdit = () => {
    setEditingId(null);
    setIsEditing(false);
    setFormData({
      company_name: "",
      symbol: "",
      quantity: "",
      buy_price: "",
      current_price: "",
    });
  };

  // ===========================
  // DELETE STOCK
  // ===========================
  const deleteStock = async (id) => {
    if (!window.confirm("Delete this stock?")) return;
    try {
      await API.delete(`stocks/${id}/`);
      toast.success("Stock Deleted Successfully");
      fetchStocks();
    } catch (error) {
      console.error(error);
      toast.error("Delete Failed");
    }
  };

  // ===========================
  // REFRESH LIVE PRICE
  // ===========================
  const refreshPrices = async () => {
    try {
      await API.post("refresh-prices/");
      setLastUpdated(new Date().toLocaleString());
      toast.info("Live Prices Updated");
      fetchStocks();
    } catch (error) {
      console.error(error);
      toast.error("Unable to Refresh Prices");
    }
  };

  // ===========================
  // EXPORT PDF
  // ===========================
  const exportPDF = async () => {
    try {
      const response = await API.get("export-pdf/", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = "portfolio.pdf";
      link.click();
    } catch (error) {
      console.error(error);
      toast.error("PDF Export Failed");
    }
  };

  // ===========================
  // EXPORT EXCEL
  // ===========================
  const exportExcel = async () => {
    try {
      const response = await API.get("export-excel/", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = "portfolio.xlsx";
      link.click();
    } catch (error) {
      console.error(error);
      toast.error("Excel Export Failed");
    }
  };

  // ===========================
  // DASHBOARD CALCULATIONS
  // ===========================
  const totalInvestment = stocks.reduce(
    (sum, stock) => sum + Number(stock.buy_price) * Number(stock.quantity),
    0
  );

  const currentValue = stocks.reduce(
    (sum, stock) => sum + Number(stock.current_price) * Number(stock.quantity),
    0
  );

  const totalProfit = currentValue - totalInvestment;

  const portfolioReturn =
  totalInvestment > 0
    ? ((totalProfit / totalInvestment) * 100).toFixed(2)
    : "0.00";
  

  const totalStocks = stocks.length;

const avgInvestment =
  totalStocks > 0 ? totalInvestment / totalStocks : 0;

const avgCurrentValue =
  totalStocks > 0 ? currentValue / totalStocks : 0;

const profitableStocks = stocks.filter(
  (stock) => Number(stock.current_price) > Number(stock.buy_price)
).length;

const lossStocks = stocks.filter(
  (stock) => Number(stock.current_price) < Number(stock.buy_price)
).length;


<div className="card shadow border-0 rounded-4">
  <div className="card-body">
    <h6>📈 Portfolio Growth</h6>
    <h3>{portfolioReturn}%</h3>
  </div>
</div>



  const bestStock =
    stocks.length > 0
      ? [...stocks].sort(
          (a, b) =>
            (Number(b.current_price) - Number(b.buy_price)) * Number(b.quantity) -
            (Number(a.current_price) - Number(a.buy_price)) * Number(a.quantity)
        )[0]
      : null;

  const worstStock =
    stocks.length > 0
      ? [...stocks].sort(
          (a, b) =>
            (Number(a.current_price) - Number(a.buy_price)) * Number(a.quantity) -
            (Number(b.current_price) - Number(b.buy_price)) * Number(b.quantity)
        )[0]
      : null;

  const highestInvestment =
    stocks.length > 0
      ? [...stocks].sort(
          (a, b) =>
            Number(b.buy_price) * Number(b.quantity) -
            Number(a.buy_price) * Number(a.quantity)
        )[0]
      : null;

  const bestStockProfit = bestStock
    ? (Number(bestStock.current_price) - Number(bestStock.buy_price)) * Number(bestStock.quantity)
    : 0;

  const worstStockLoss = worstStock
    ? (Number(worstStock.current_price) - Number(worstStock.buy_price)) * Number(worstStock.quantity)
    : 0;

  const highestInvestmentAmount = highestInvestment
    ? Number(highestInvestment.buy_price) * Number(highestInvestment.quantity)
    : 0;

  // ===========================
  // FILTER & SORT
  // ===========================
  const filteredStocks = stocks
    .filter((stock) => {
      const matchesSearch =
        stock.company_name?.toLowerCase().includes(search.toLowerCase()) ||
        stock.symbol?.toLowerCase().includes(search.toLowerCase());

      if (filterStatus === "profit") {
        return matchesSearch && Number(stock.current_price) > Number(stock.buy_price);
      }
      if (filterStatus === "loss") {
        return matchesSearch && Number(stock.current_price) < Number(stock.buy_price);
      }
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "company") {
        return a.company_name.localeCompare(b.company_name);
      }
      if (sortBy === "investment") {
        return (
          Number(b.buy_price) * Number(b.quantity) -
          Number(a.buy_price) * Number(a.quantity)
        );
      }
      if (sortBy === "profit") {
        const profitA = (Number(a.current_price) - Number(a.buy_price)) * Number(a.quantity);
        const profitB = (Number(b.current_price) - Number(b.buy_price)) * Number(b.quantity);
        return profitB - profitA;
      }
      return 0;
    });

  return (
    <div className="dashboard-page">
       <div className="container py-5">
      {/* Heading */}

      {/* Dashboard Header */}
<div className="dashboard-header d-flex justify-content-between align-items-center mb-4">

  <div>
    <h2 className="fw-bold mb-1">
      📈 My Stock Portfolio
    </h2>

    <p className="text-muted mb-0">
      Last Updated: {lastUpdated || "Never"}
    </p>
  </div>

  <div className="dashboard-actions">

    <button
      className="btn btn-success btn-sm me-2 px-3"
      onClick={exportExcel}
    >
      <FaFileExcel className="me-2" />
      Export Excel
    </button>

    <button
      className="btn btn-primary btn-sm me-2 px-3"
      onClick={refreshPrices}
    >
      <FaSyncAlt className="me-2" />
      Refresh Prices
    </button>

    <button
      className="btn btn-danger btn-sm px-3"
      onClick={exportPDF}
    >
      <FaFilePdf className="me-2" />
      Export PDF
    </button>

  </div>

</div>

     {/* Summary Cards */}
<div className="row g-4 mb-4">

  {/* Total Investment */}
  <div className="col-xl-3 col-md-6">
    <div className="summary-card investment-card h-100">
      <div className="summary-card-body">

        <div>
          <p className="summary-label">
            Total Investment
          </p>

          <h3 className="summary-value">
            ₹{totalInvestment.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
            })}
          </h3>

          <span className="summary-status">
            💰 Invested Capital
          </span>
        </div>

        <div className="summary-icon">
          <FaWallet />
        </div>

      </div>
    </div>
  </div>


  {/* Current Value */}
  <div className="col-xl-3 col-md-6">
    <div className="summary-card current-card h-100">
      <div className="summary-card-body">

        <div>
          <p className="summary-label">
            Current Value
          </p>

          <h3 className="summary-value">
            ₹{currentValue.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
            })}
          </h3>

          <span className="summary-status">
            📈 Market Value
          </span>
        </div>

        <div className="summary-icon">
          <FaChartLine />
        </div>

      </div>
    </div>
  </div>


  {/* Total Profit */}
  <div className="col-xl-3 col-md-6">
    <div
      className={`summary-card ${
        totalProfit >= 0
          ? "profit-card"
          : "loss-card"
      } h-100`}
    >

      <div className="summary-card-body">

        <div>
          <p className="summary-label">
            Total Profit / Loss
          </p>

          <h3 className="summary-value">
            {totalProfit >= 0 ? "+" : "-"}₹
            {Math.abs(totalProfit).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
            })}
          </h3>

          <span className="summary-status">
            {totalProfit >= 0
              ? "📈 Portfolio Gain"
              : "📉 Portfolio Loss"}
          </span>
        </div>

        <div className="summary-icon">
          <FaCoins />
        </div>

      </div>

    </div>
  </div>


  {/* Total Stocks */}
  <div className="col-xl-3 col-md-6">
    <div className="summary-card stocks-card h-100">

      <div className="summary-card-body">

        <div>
          <p className="summary-label">
            Total Stocks
          </p>

          <h3 className="summary-value">
            {stocks.length}
          </h3>

          <span className="summary-status">
            📊 Active Holdings
          </span>
        </div>

        <div className="summary-icon">
          <FaBriefcase />
        </div>

      </div>

    </div>
  </div>

</div>
     

      {/* Performers Cards */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card border-0 shadow rounded-4 bg-success text-white">
            <div className="card-body">
              <h6>🏆 Best Performing Stock</h6>
              <h5 className="mb-1">{bestStock ? bestStock.company_name : "-"}</h5>
              <small className="text-white-50">
                {bestStock ? `Profit: ₹${bestStockProfit.toFixed(2)}` : "No Data"}
              </small>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card border-0 shadow rounded-4 bg-danger text-white">
            <div className="card-body">
              <h6>📉 Worst Performing Stock</h6>
              <h5 className="mb-1">{worstStock ? worstStock.company_name : "-"}</h5>
              <small className="text-white-50">
                {worstStock ? `Loss: ₹${worstStockLoss.toFixed(2)}` : "No Data"}
              </small>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card border-0 shadow rounded-4 bg-warning text-dark">
            <div className="card-body">
              <h6>💰 Highest Investment</h6>
              <h5 className="mb-1">{highestInvestment ? highestInvestment.company_name : "-"}</h5>
              <small className="text-dark-50">
                {highestInvestment ? `Invested: ₹${highestInvestmentAmount.toFixed(2)}` : "No Data"}
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Chart rendering point */}
      <div className="mb-4">
        <PortfolioChart stocks={filteredStocks} />
      </div>

      <div className="row mb-4">

  <div className="col-md-4 mb-3">
    <div className="card shadow border-0 rounded-4">
      <div className="card-body text-center">
        <h6 className="text-muted">Average Investment</h6>
        <h3>
          ₹
          {stocks.length
            ? (totalInvestment / stocks.length).toFixed(2)
            : "0.00"}
        </h3>
      </div>
    </div>
  </div>

  <div className="col-md-4 mb-3">
    <div className="card shadow border-0 rounded-4">
      <div className="card-body text-center">
        <h6 className="text-muted">Average Current Value</h6>
        <h3>
          ₹
          {stocks.length
            ? (currentValue / stocks.length).toFixed(2)
            : "0.00"}
        </h3>
      </div>
    </div>
  </div>

  <div className="col-md-4 mb-3">
    <div className="card shadow border-0 rounded-4">
      <div className="card-body text-center">
        <h6 className="text-muted">Portfolio Growth</h6>
        <h3 className={totalProfit >= 0 ? "text-success" : "text-danger"}>
          {totalInvestment
            ? ((totalProfit / totalInvestment) * 100).toFixed(2)
            : 0}
          %
        </h3>
      </div>
    </div>
  </div>

</div>

      {/* Add / Edit Form */}
      <div className="card shadow border-0 rounded-4 mb-4">
        <div className="card-body">
          <h4 className="mb-4">{isEditing ? "✏️ Edit Stock" : "➕ Add New Stock"}</h4>
          <form onSubmit={addStock}>
            <div className="row g-3">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Company Name"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Symbol"
                  name="symbol"
                  value={formData.symbol}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Buy Price"
                  name="buy_price"
                  value={formData.buy_price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Current Price"
                  name="current_price"
                  value={formData.current_price}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <button className={`btn ${isEditing ? "btn-warning" : "btn-success"}`} type="submit">
                {isEditing ? "Update Stock" : "Add Stock"}
              </button>
              {isEditing && (
                <button type="button" className="btn btn-secondary ms-2" onClick={cancelEdit}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Search & Filtering Bars */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="input-group">
            <span className="input-group-text"><FaSearch /></span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by name or symbol..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-4">
          <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="company">Sort by: Company Name</option>
            <option value="investment">Sort by: Investment Value</option>
            <option value="profit">Sort by: Highest Profit</option>
          </select>
        </div>
        <div className="col-md-4">
          <select className="form-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">Filter: All Stocks</option>
            <option value="profit">Filter: Profit Making</option>
            <option value="loss">Filter: Loss Making</option>
          </select>
        </div>
      </div>

      {/* Stocks Table Display with Loading State handled correctly */}
      
      <div className="d-flex justify-content-between mb-3">
    <h5>Total Stocks : {filteredStocks.length}</h5>
    </div>

      <div className="card shadow border-0 rounded-4 mb-5">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-3">Loading Portfolio...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">Company</th>
                    <th>Symbol</th>
                    <th>Qty</th>
                    <th>Buy Price</th>
                    <th>Current Price</th>
                    <th>Total Profit/Loss</th>
                    <th className="pe-4 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                 {filteredStocks.length === 0 ? (
  <tr>
    <td colSpan="7">
      <div className="text-center py-5">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
          width="170"
          alt="No Data"
        />

        <h4 className="mt-3">
          No Stocks Added
        </h4>

        <p className="text-muted">
          Start by adding your first investment.
        </p>
      </div>
    </td>
  </tr>
) : (
  filteredStocks.map((stock) => {
                      const stockProfit = (Number(stock.current_price) - Number(stock.buy_price)) * Number(stock.quantity);
                      return (
                        <tr key={stock.id}>
                          <td className="ps-4 fw-semibold">{stock.company_name}</td>
                          <td><span className="badge bg-secondary">{stock.symbol}</span></td>
                          <td>{stock.quantity}</td>
                          <td>₹{Number(stock.buy_price).toFixed(2)}</td>
                          <td>₹{Number(stock.current_price).toFixed(2)}</td>
                          <td className={stockProfit >= 0 ? "text-success fw-bold" : "text-danger fw-bold"}>
                            ₹{stockProfit.toFixed(2)}
                          </td>
                          <td className="pe-4 text-end">
                            <button className="btn btn-outline-warning btn-sm me-2" onClick={() => editStock(stock)}>Edit</button>
                            <button className="btn btn-outline-danger btn-sm" onClick={() => deleteStock(stock.id)}>Delete</button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>

                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
  <div className="card-body p-0">

    <div className="table-responsive">
     
    </div>

  </div>
</div>

              </table>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}

export default Dashboard;