import ReactLoading from "react-loading";
import { Container } from "react-bootstrap";


export default function LoadingSpinner() {
  return (
    <Container alt="Loading Spinner">
        <div style={{
          marginLeft: "34vw",
          marginTop: "14vw"
        }}>
          <ReactLoading
            type={"spinningBubbles"}
            color={"#7393B3"}
            height={200}
            width={200}
            id="LoadingSymbol"
            />
            </div>
    </Container>
  );
}
