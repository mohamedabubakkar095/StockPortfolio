import { useEffect, useState } from "react";
import API from "../services/api";
import PortfolioChart from "../components/PortfolioChart";

function Dashboard() {
  const [stocks, setStocks] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    company_name: "",
    symbol: "",
    quantity: "",
    buy_price: "",
    current_price: "",
  });

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      const res = await API.get("stocks/");
      
      // சர்வர் அனுப்பும் உண்மையான டேட்டாவை கன்சோலில் பார்க்க (Debug செய்ய)
      console.log("SERVER RESPONSE DATA:", res.data);

      // சர்வர் டேட்டாவை ஆப்ஜெக்ட்டாகவோ அல்லது அரே ஆகவோ எப்படி அனுப்பினாலும் பாதுகாப்பாக கையாள்கிறது
      if (Array.isArray(res.data)) {
        setStocks(res.data);
      } else if (res.data && Array.isArray(res.data.results)) {
        setStocks(res.data.results);
      } else if (res.data && Array.isArray(res.data.data)) {
        setStocks(res.data.data);
      } else {
        setStocks([]);
      }
    } catch (err) {
      console.error("Fetch Stocks Error:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addStock = async (e) => {
    e.preventDefault();

    // 400 Bad Request எரர் வராமல் தடுக்க எண்களை முறையாக மாற்றி payload தயார் செய்கிறோம்
    const payload = {
      company_name: formData.company_name,
      symbol: formData.symbol,
      quantity: Number(formData.quantity),
      buy_price: Number(formData.buy_price),
      current_price: Number(formData.current_price),
    };

    try {
      if (isEditing) {
        await API.put(`stocks/${editingId}/`, payload);
        alert("Stock Updated Successfully");
      } else {
        await API.post("stocks/", payload);
        alert("Stock Added Successfully");
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
    } 
//     catch (err) {
//        console.error("Operation Error:", err);
//        console.log("Status:", err.response?.status);
//       console.log("Response:", err.response?.data);
//       alert(JSON.stringify(err.response?.data));
// }
catch (err) {
  console.error(err);

  console.log("STATUS:", err.response?.status);
  console.log("DATA:", err.response?.data);

  alert(
    JSON.stringify(err.response?.data || err.message, null, 2)
  );
}
  };

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

  const deleteStock = async (id) => {
    if (window.confirm("Are you sure you want to delete this stock?")) {
      try {
        await API.delete(`stocks/${id}/`);
        fetchStocks();
      } catch (err) {
        console.error("Delete Error:", err);
      }
    }
  };

  const refreshPrices = async () => {
    try {
      await API.post("refresh-prices/");
      alert("Live Prices Updated");
      fetchStocks();
    } catch (err) {
      console.error("Refresh Prices Error:", err);
      alert("Unable to Update Prices");
    }
  };
  const exportPDF = async () => {
  const response = await API.get("export-pdf/", {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));

  const link = document.createElement("a");
  link.href = url;
  link.download = "portfolio.pdf";
  link.click();
};

  const exportExcel = async () => {
  try {
    const response = await API.get("export-excel/", {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "portfolio.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error(err);
  }
};

  // கணக்கீடுகள் (Metrics)
  const totalInvestment = stocks.reduce(
    (sum, stock) => sum + Number(stock.buy_price || 0) * Number(stock.quantity || 0),
    0
  );

  const currentValue = stocks.reduce(
    (sum, stock) => sum + Number(stock.current_price || 0) * Number(stock.quantity || 0),
    0
  );

  const totalProfit = currentValue - totalInvestment;

  const filteredStocks = stocks.filter((stock) =>
    stock.company_name?.toLowerCase().includes(search.toLowerCase())
  );

 

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">📈 My Stock Portfolio</h2>
    
     <div className="text-end mb-3">
  <button
    className="btn btn-success me-2"
    onClick={exportExcel}
  >
    📥 Export Excel
  </button>

  <button
    className="btn btn-primary"
    onClick={refreshPrices}
  >
    🔄 Refresh Live Prices
  </button>
  <button
  className="btn btn-danger me-2"
  onClick={exportPDF}
>
  📄 Export PDF
</button>
</div>

      {/* கார்டுகள் லேஅவுட் */}
      <div className="row mb-4">
        <div className="col-md-3 mb-2">
          <div className="card bg-primary text-white p-3 shadow-sm">
            <h6>Total Investment</h6>
            <h3>₹{totalInvestment.toFixed(2)}</h3>
          </div>
        </div>

        <div className="col-md-3 mb-2">
          <div className="card bg-success text-white p-3 shadow-sm">
            <h6>Current Value</h6>
            <h3>₹{currentValue.toFixed(2)}</h3>
          </div>
        </div>

        <div className="col-md-3 mb-2">
          <div className={`card ${totalProfit >= 0 ? "bg-info" : "bg-danger"} text-white p-3 shadow-sm`}>
            <h6>Total Profit / Loss</h6>
            <h3>₹{totalProfit.toFixed(2)}</h3>
          </div>
        </div>

        <div className="col-md-3 mb-2">
          <div className="card bg-dark text-white p-3 shadow-sm">
            <h6>Total Stocks</h6>
            <h3>{stocks.length}</h3>
          </div>
        </div>
      </div>

      {/* புதிய மொபைல்-ரெஸ்பான்சிவ் படிவம் (Form Grid Fix) */}
      <div className="card p-4 mb-4 shadow">
        <h4>{isEditing ? "✏️ Edit Stock" : "➕ Add New Stock"}</h4>
        <form onSubmit={addStock}>
          <div className="row g-3 mb-3">
            <div className="col-12 col-md-4">
              <input
                type="text"
                name="company_name"
                className="form-control"
                placeholder="Company Name"
                value={formData.company_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-6 col-md-2">
              <input
                type="text"
                name="symbol"
                className="form-control"
                placeholder="Symbol"
                value={formData.symbol}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-6 col-md-2">
              <input
                type="number"
                name="quantity"
                className="form-control"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-6 col-md-2">
              <input
                type="number"
                step="0.01"
                name="buy_price"
                className="form-control"
                placeholder="Buy Price"
                value={formData.buy_price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-6 col-md-2">
              <input
                type="number"
                step="0.01"
                name="current_price"
                className="form-control"
                placeholder="Current Price"
                value={formData.current_price}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="d-flex gap-2">
            <button
              type="submit"
              className={`btn ${isEditing ? "btn-warning" : "btn-success"} flex-grow-1`}
            >
              {isEditing ? "Update Stock" : "Add Stock"}
            </button>

            {isEditing && (
              <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* தேடல் பாக்ஸ் */}
      <input
        type="text"
        className="form-control mb-3 shadow-sm"
        placeholder="🔍 Search Company..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* சார்ட் பகுதி */}
      <div className="card p-3 mb-4 shadow-sm">
        <PortfolioChart stocks={filteredStocks} />
      </div>

      {/* டேட்டா டேபிள் */}
      <div className="table-responsive shadow-sm rounded">
        <table className="table table-bordered table-hover mb-0">
          <thead className="table-dark">
            <tr>
              <th>Company</th>
              <th>Symbol</th>
              <th>Qty</th>
              <th>Buy Price</th>
              <th>Current Price</th>
              <th>Investment</th>
              <th>Current Value</th>
              <th>Profit/Loss</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStocks.map((stock) => {
              const investment = Number(stock.buy_price || 0) * Number(stock.quantity || 0);
              const current = Number(stock.current_price || 0) * Number(stock.quantity || 0);
              const profit = current - investment;

              return (
                <tr key={stock.id || stock.symbol}>
                  <td>{stock.company_name}</td>
                  <td>{stock.symbol}</td>
                  <td>{stock.quantity}</td>
                  <td>₹{Number(stock.buy_price || 0).toFixed(2)}</td>
                  <td>₹{Number(stock.current_price || 0).toFixed(2)}</td>
                  <td>₹{investment.toFixed(2)}</td>
                  <td>₹{current.toFixed(2)}</td>
                  <td className={profit >= 0 ? "text-success fw-bold" : "text-danger fw-bold"}>
                    ₹{profit.toFixed(2)}
                  </td>
                  <td>
                    <span className={`badge ${profit >= 0 ? "bg-success" : "bg-danger"}`}>
                      {profit >= 0 ? "Profit" : "Loss"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => editStock(stock)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteStock(stock.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}

            {filteredStocks.length === 0 && (
              <tr>
                <td colSpan="10" className="text-center text-muted py-3">
                  No Stocks Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;