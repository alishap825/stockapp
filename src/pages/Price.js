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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Move fetchWithRetry OUTSIDE the component to avoid redefinition on every render
function fetchWithRetry(url, retries = 3, delay = 1000) {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        if (response.status === 429 && retries > 0) {
          return new Promise(resolve => setTimeout(resolve, delay)).then(() =>
            fetchWithRetry(url, retries - 1, delay * 2)
          );
        }
        throw new Error(`API error: ${response.status}`);
      }
      return response.json();
    });
}

export default function Price() {
  const { symbol = "" } = useParams();
  const chartRef = useRef(null);
  const FMP_API_KEY = process.env.REACT_APP_API_KEY_2;
  const historicalChartUrl = `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?apikey=${FMP_API_KEY}`;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (symbol) {
      setLoading(true);
      fetchWithRetry(historicalChartUrl)
        .then(result => {
          setData(result);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [symbol, historicalChartUrl]);

  const options = {
    responsive: true,
    aspectRatio: 2,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Historical Data" },
    },
  };

  let _data = { labels: [], datasets: [] };

  if (data?.historical) {
    const historicalData = data.historical.slice(-50);
    const labels = historicalData.map(x => x.date);
    let mainData = {};

    historicalData.forEach(x => {
      mainData[x.date] = { low: x.low, high: x.high };
    });

    _data = {
      labels,
      datasets: [
        {
          label: "Low",
          data: labels.map(label => mainData[label]?.low || 0),
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
        {
          label: "High",
          data: labels.map(label => mainData[label]?.high || 0),
          backgroundColor: "rgba(0, 255, 0, 0.5)",
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
