import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Container, Row } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import CompanyInfo from "../components/Company.js";
import Error from "../components/Error.js";
import LoadingSpinner from "../components/LoadingSymbol.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Register Chart.js modules
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// Helper: Cache API responses in localStorage for 10 minutes
function getCachedData(key) {
  const cached = localStorage.getItem(key);
  if (!cached) return null;
  try {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < 10 * 60 * 1000) { // 10 minutes
      return data;
    }
    return null;
  } catch {
    return null;
  }
}

function setCachedData(key, data) {
  localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
}

// Function to fetch API with retry logic for 429 errors
async function fetchWithRetryAndCache(url, cacheKey, retries = 3, delay = 1000) {
  // Try cache first
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        if ((response.status === 429 || response.status >= 500) && i < retries) {
          await new Promise(res => setTimeout(res, delay * (i + 1)));
          continue;
        }
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      if (i === retries) throw error;
      await new Promise(res => setTimeout(res, delay * (i + 1)));
    }
  }
  throw new Error("API failed after retries.");
}

export default function Price() {
  const { symbol = "" } = useParams();
  const chartRef = useRef(null);
  const FMP_API_KEY = process.env.REACT_APP_API_KEY_2;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
   
  useEffect(() => {
    if (!symbol) {
      setError("Stock symbol is required.");
      setLoading(false);
      return;
    }
    if (!FMP_API_KEY) {
      setError("API key missing. Check environment variables.");
      setLoading(false);
      return;
    }
    const historicalChartUrl = `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?apikey=${FMP_API_KEY}`;
    const cacheKey = `price-history-${symbol}`;

    setLoading(true);
    setError(null);

    fetchWithRetryAndCache(historicalChartUrl, cacheKey)
      .then(result => {
        if (!result?.historical || result.historical.length === 0) {
          throw new Error(`No historical data found for "${symbol}". (404)`);
        }
        setData(result);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [symbol, FMP_API_KEY]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: `Historical Price Data for ${symbol} (Last 50 Days)` },
    },
    scales: {
      x: { ticks: { maxTicksLimit: 8, autoSkip: true } }
    }
  };

  let _data = { labels: [], datasets: [] };

  if (data?.historical) {
    const historicalData = data.historical.slice(-50).reverse();
    const labels = historicalData.map(x => x.date);
    const lows = historicalData.map(x => x.low);
    const highs = historicalData.map(x => x.high);

    _data = {
      labels,
      datasets: [
        {
          label: "Low",
          data: lows,
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          fill: true,
        },
        {
          label: "High",
          data: highs,
          borderColor: "rgba(0, 255, 0, 1)",
          backgroundColor: "rgba(0, 255, 0, 0.2)",
          fill: true,
        },
      ],
    };
  }

  if (!symbol) {
    return <Error data={"You must select a company from the Stocks page to view its Price History!"} />;
  }

  if (loading) return <LoadingSpinner />;
  if (error) return <Error data={`API failed: ${error}`} />;

  return (
    <Container fluid className="vh-100" id="background">
      <div className="StockHistory" style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
        <Row>
          <CompanyInfo data={symbol} />
        </Row>
        <Row id="marginTop" style={{ minHeight: 350 }}>
          <div style={{ width: "100%", height: "350px" }}>
            <Line ref={chartRef} options={options} data={_data} />
          </div>
        </Row>
      </div>
    </Container>
  );
}