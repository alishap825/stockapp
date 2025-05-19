import useAPI from "../components/API";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import LoadingSpinner from "../components/LoadingSymbol";
import Error from "../components/Error";
import StockTable from "../components/StockTable";
import { Container } from "react-bootstrap";

export default function Stocks() {
  const FMPTWO_API_KEY = process.env.REACT_APP_API_KEY_2;
  const stockURL = `https://financialmodelingprep.com/api/v3/nasdaq_constituent?apikey=${FMPTWO_API_KEY}`;
  const api = useAPI(stockURL);
  const { loading, error } = api;
  let data = api.data;

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || (data && data["Error Message"])) {
    const prev_data = localStorage.getItem("stock-data");
    if (!prev_data) {
      return <Error data={"API failed to retrieve data"} />;
    } else {
      data = JSON.parse(prev_data);
    }
  } else if (data && !data["Error Message"]) {
    // In case the API key runs out of limits, will use data from local storage
    localStorage.setItem("stock-data", JSON.stringify(data));
  }

  return (
    <Container fluid className="vh-100" id="background">
      <div
        className="Stocks"
        alt="Table containing Nasdaq 100 company performance"
      >
        <StockTable data={data} />
      </div>
    </Container>
  );
}