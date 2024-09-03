import useAPI from "./API";
import Error from "./Error";

import { Container, Row, Col } from "react-bootstrap";

export default function CompanyInfo(symbol) {
  const FMP_API_KEY = `8KVX9RRKBNGTO09C`;
  const companyInfoURL = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol.data}&apikey=${FMP_API_KEY}`;
  const { loading, data, error } = useAPI(companyInfoURL);

  if (loading) {
    return (
      <Container>
        <Row className="justify-content-md-center">
          <Col sm="auto" id="skinny">
            <p>Loading Company Info...</p>
          </Col>
        </Row>
      </Container>
    );
  }

  if (error !== null) {
    return <Error data={"Failed to get data from API"} />;
  }

  return (
    <div className="CompanyInfo">
      <div className="container">
        <h1>Description</h1>
       
        <p>{data.Description}</p>
      </div>
    </div>
  );
}
