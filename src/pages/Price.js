import CompanyDetails from "../components/Company.js";
import useAPI from "../components/API";
import Error from "../components/Error.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import { useParams } from "react-router-dom";
import { Container, Row } from "react-bootstrap";
import { useRef } from "react";
import LoadingSpinner from "../components/LoadingSymbol.js";

export default function Price() {
  const { symbol = "" } = useParams();
  const chartRef = useRef(null);
  const FMP_API_KEY = process.env.REACT_APP_API_KEY_2;
  const historicalChartUrl = `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?apikey=${FMP_API_KEY}`;
  const { loading, data, error } = useAPI(historicalChartUrl);

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    aspectRatio: 2,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Historical Data',
      },
    },
  };

  let _data = { labels: [], datasets: [] };

  if (data?.historical) {
    data.historical = data.historical.slice(-50);

    const labels = data.historical.map(x => x.date);
    let mainData = {};

    data.historical.forEach((x) => {
      mainData[x.date] = {
        low: x.low,
        high: x.high,
      };
    });

    _data = {
      labels,
      datasets: [
        {
          label: 'Low',
          data: labels.map(label => mainData[label]?.low || 0),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: 'High',
          data: labels.map(label => mainData[label]?.high || 0),
          backgroundColor: 'rgba(0, 255, 0, 0.5)',
        },
      ],
    };
  }

  if (symbol === "") {
    return (
      <Error data={"You must select a company from the Stocks page to view its Price History!"} />
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Error data={"API failed to retrieve data"} />;
  }

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
