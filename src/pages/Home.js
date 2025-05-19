

import { Container, Row } from "react-bootstrap";
import bgimg from  "../image/banner.jpg";
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <Container fluid className="vh-100" id="width" style={{ padding: 0 }}>
      <img src={bgimg} alt="banner" style={{
      width: '100%',
      height: 'auto',
      objectFit: 'cover',
      maxHeight: '300px',
      display: 'block'
    }}/>
      <div className="Home">
  <Row id="flexWrap">
    <Row className="mt-4 mb-3">
      <h3 className="text-center">Stock Daily</h3>
    </Row>
    <Row className="mb-4">
      <p>
        StockDaily is a website for users who want to see stock information.
        Please select any link from the navbar or click the "Stock Info" link. The Stocks page will display a list of the Nasdaq-100. It includes a list of each
        company's symbol, name, and corresponding industry. If you would like
        to see a particular stock in more detail, you can click on the
        name or symbol of that stock within the table.
      </p>
      <p>
        Visit the <Link to="/stocks">Stocks</Link> page to see the list of stocks and learn more.
      </p>
    </Row>
  </Row>
</div>

    </Container>
  );
}
