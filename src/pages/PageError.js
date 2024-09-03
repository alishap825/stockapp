import Error from "../components/Error";


import { Container } from "react-bootstrap";

export default function PageError() {
  const error = "This page was not found!";

  return (
    <Container fluid className="vh-100" id="background">
      <Error data={error} alt="Page not found" />;
    </Container>
  );
}
