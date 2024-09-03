

import { Container, Row, Button } from "react-bootstrap";
import bgimg from  "../image/stockmarket.jpeg";

export default function Home() {
  return (
    <Container fluid className="vh-100" id="width">
      <img src={bgimg} alt="" />
      <div className="Home">
     
       
        <Row>
          <p>
            StockDaily is a website for users who wants to see the stock information.
            Please select any links from navbar or select "stocks Info" button.
          </p>
        </Row>
       
        
        <Row id="flexWrap">
          
            <Row>
              <h3>Stocks</h3>
            </Row>
            <Row>
              <p>
                The Stocks page will display a list of the Nasdaq-100. It includes a list of each
                companies symbol, name and corresponding industry. If you would like
                to see a particular stock in more detail, you can click on the
                name of the symbol of that stock within the Table.
              </p>
            </Row>
          
         
          
        </Row>
        <Row className="mb-2">
          <Button variant="success"  id="button" href="./stocks">
            Stock Info
          </Button>
        </Row>
      </div>
    </Container>
  );
}
