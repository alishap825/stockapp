import useAPI from "../components/API";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";

import LoadingSpinner from "../components/LoadingSymbol";
import Error from "../components/Error";
import StockTable from "../components/StockTable";
import { Container } from "react-bootstrap";
  export default function Stocks() {

    const FMP_API_KEY = `e25ee6f07a20300466042dc2892848eb`;
    const stockURL = `https://financialmodelingprep.com/api/v3/nasdaq_constituent?apikey=${FMP_API_KEY}`;
    let { loading, data, error } = useAPI(stockURL);
  
    if (loading) {
      return (
          <LoadingSpinner />
      );
    }
  
    if (error || data["Error Message"]) {
      const prev_data = localStorage.getItem("stock-data");
      if(!prev_data){
        return <Error data={"API failed to retrieve data"} />;
      }else{
        data = JSON.parse(prev_data);
      }
    }else if(data && !data["Error Message"]){
      // In case the API key runs out of limits, will use data from local storage
      localStorage.setItem("stock-data", JSON.stringify(data));
    }
  
    return (
      <Container fluid className="vh-100" id="background">
        <div
          className="Stocks"
          alt="Table containing Naqsdaq 100 company performance"
        >
          <StockTable data={data} />
        </div>
      </Container>
    );
  }
  
 
  
