import useAPI from "./API";
import Error from "./Error";
import { Container, Row, Col } from "react-bootstrap";

export default function CompanyInfo({ data: symbol }) {
  const AV_API_KEY = process.env.REACT_APP_API_KEY_1;
  const companyInfoURL = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${AV_API_KEY}`;
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

  // Hide API error details from users
  if (
    error ||
    !data ||
    data["Note"] ||
    data["Error Message"] ||
    !data.Description
  ) {
    return (
      <Container>
        <Row className="justify-content-md-center">
          <Col sm="auto" id="skinny">
            <h1>Description</h1>
            <p>No description available for this company.</p>
          </Col>
        </Row>
      </Container>
    );
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