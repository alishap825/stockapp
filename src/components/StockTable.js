import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Badge from 'react-bootstrap/Badge';
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { SearchBar, searchQueryFilter } from "./../components/SearchBar";

export default function StockTable({ data }) {
  const [dataUpdate, setDataUpdate] = useState();
  const [searchResult, setSearchResult] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [coloumnData, setColumnData] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);

  // check for updated data then set rerender
  setTimeout(() => {
    setDataUpdate(data);
  }, 100);


  useEffect(() => {
    (async () => {
      try {
        console.log(`Processing: ${JSON.stringify(data)}`)
        let rows = await getRowData(data);
        setRowData(rows);
        setSearchData(rows);
        setColumnData(await getTableColumnsData(data));
        setTableLoading(false);
      } catch (e) {
        console.log(`Caught error: ${e}`);
        console.log(`Stock Table still being constucted.`);
      }
    })();
  }, [dataUpdate, searchResult]);

  useEffect(() => {
    (async () => {
      setSearchData(
        await searchQueryFilter(rowData, searchResult)
      );
    })();
  }, [searchResult]);

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
        <Row style={{ textAlign: "center", marginBlock: "20px"}}>
          <Col>
            <h1>Stocks</h1>
          </Col>
          <Col style={{marginTop: "15px"}}>
            <SearchBar onChange={setSearchResult} />
          </Col>
        </Row>
        <Badge bg="secondary" style={{
          "padding": "10px",
          "margin-block": "10px",
        }}>Found {rowData.length} results</Badge>
        <Row>
          <div
            className="ag-theme-alpine"
            style={{ 
              height: "500px", 
              width: "100%", 
              marginBottom: "150px", 
              marginInline: "auto" ,
            }}
          >
            <AgGridReact
              columnDefs={coloumnData}
              rowData={searchData}
              pagination={true}
              rowSelection="single"
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

async function getTableColumnsData(data) {
  return [
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
    
  ];
}

function locateSymbol(params, data) {
  let rowLength = data.length;
  let count = 0;
  let notFound = `NA`;
  while (count < rowLength) {
    if (data[count].name === params.value) return data[count].symbol;
    count++;
  }
  return notFound;
}

async function getRowData(stockData) {
  return stockData.map((s) => {
    return {
      symbol: s.symbol,
      name: s.name,
    };
  });
}
