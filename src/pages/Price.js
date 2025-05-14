import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Container, Row } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import CompanyDetails from "../components/Company.js";
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
} from "chart.js";

// Register Chart.js modules
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Function to fetch API with retry logic for 429 errors
function fetchWithRetry(url, retries = 3, delay = 1000) {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        if ((response.status === 429 || response.status >= 500) && retries > 0) {
          return new Promise(resolve => setTimeout(resolve, delay)).then(() =>
            fetchWithRetry(url, retries - 1, delay * 2)
          );
        }
        throw new Error(`API error: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      if (retries > 0) {
        return new Promise(resolve => setTimeout(resolve, delay)).then(() =>
          fetchWithRetry(url, retries - 1, delay * 2)
        );
      }
      throw error;
    });
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
    setLoading(true);

    fetchWithRetry(historicalChartUrl)
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
    aspectRatio: 2,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: `Historical Price Data for ${symbol} (Last 50 Days)` },
    },
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
      <div className="StockHistory">
        <Row>
          <CompanyDetails data={symbol} />
        </Row>
        <Row id="marginTop">
          <Line ref={chartRef} options={options} data={_data} style={{ marginInline: "auto" }} />
        </Row>
      </div>
    </Container>
  );
}
