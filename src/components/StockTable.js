import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Badge from 'react-bootstrap/Badge';
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { SearchBar } from "./../components/SearchBar";

export default function StockTable({ data }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [rowData, setRowData] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);

  useEffect(() => {
    // If data is undefined or not an array, avoid setting state
    if (!Array.isArray(data)) {
      setRowData([]);
      setTableLoading(false);
      return;
    }
    setRowData(getRowData(data));
    setTableLoading(false);
  }, [data]);

  // Memoize columns so they don't change on every render
  const columnDefs = useMemo(() => [
    {
      headerName: "Symbol",
      field: "symbol",
      cellRendererFramework: (params) => (
        <Link to={`/Price/${params.value}`}>{params.value}</Link>
      ),
      filter: true,
    },
    {
      headerName: "Name",
      field: "name",
      cellRendererFramework: (params) => {
        let linkSymbol = locateSymbol(params, data);
        return <Link to={`/Price/${linkSymbol}`}>{params.value}</Link>;
      },
    },
  ], [data]);

  // Filtered data using useMemo for performance
  const searchData = useMemo(() => {
    if (!searchQuery) return rowData;
    return rowData.filter(
      (r) =>
        r.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [rowData, searchQuery]);

  if (tableLoading) {
    return (
      <Container>
        <Row className="justify-content-md-center">
          <Col sm="auto" id="skinny">
            <p>Loading Table...</p>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container>
      <div className="StockTable" style={{
        width: "70%",
        marginInline: "auto"
      }}>
        <Row style={{ textAlign: "center", marginBlock: "20px" }}>
          <Col>
            <h1>Stocks</h1>
          </Col>
          <Col style={{ marginTop: "15px" }}>
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </Col>
        </Row>
        <Badge bg="secondary" style={{
          "padding": "10px",
          "margin-block": "10px",
        }}>Found {searchData.length} results</Badge>
        <Row>
          <div
            className="ag-theme-alpine"
            style={{
              height: "500px",
              width: "100%",
              marginBottom: "150px",
              marginInline: "auto",
            }}
          >
            <AgGridReact
              columnDefs={columnDefs}
              rowData={searchData}
              pagination={true}
              rowSelection="single"
              suppressColumnVirtualisation={true}
              suppressRowVirtualisation={true}
              domLayout="autoHeight"
              defaultColDef={{
                flex: 1,
                resizable: true,
                filter: true,
                columnHoverHighlight: true,
              }}
              sideBar={'filters'}
            />
          </div>
        </Row>
      </div>
    </Container>
  );
}

function locateSymbol(params, data) {
  if (!Array.isArray(data)) return "NA";
  let rowLength = data.length;
  let count = 0;
  let notFound = `NA`;
  while (count < rowLength) {
    if (data[count].name === params.value) return data[count].symbol;
    count++;
  }
  return notFound;
}

function getRowData(stockData) {
  if (!Array.isArray(stockData)) return [];
  return stockData.map((s) => {
    return {
      symbol: s.symbol,
      name: s.name,
    };
  });
}