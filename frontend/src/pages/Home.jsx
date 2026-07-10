import { useEffect, useState } from "react";
import api from "../services/api";

function Home() {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    api.get("stocks/")
      .then((response) => {
        setStocks(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>📈 Stock Portfolio Dashboard</h1>

      {stocks.map((stock) => (
        <div key={stock.id}>
          <h3>{stock.symbol}</h3>
          <p>{stock.company_name}</p>
          <p>₹ {stock.current_price}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default Home;