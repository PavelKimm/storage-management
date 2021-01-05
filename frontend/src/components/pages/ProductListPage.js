import React, { useState, useEffect } from "react";
import { Link, NavLink, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import { getActiveProductList } from "../../api/dataParsing/dataParsingApi";

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    maxWidth: 1000,
    margin: "auto",
    marginTop: "40px",
  },
  table: {
    minWidth: 650,
  },
  link: { color: "inherit", textDecoration: "none" },
}));

export default function ProductListPage() {
  const classes = useStyles();

  const [products, setProducts] = useState({});

  useEffect(() => {
    async function fetchData() {
      const activeProducts = (await getActiveProductList()).data;
      console.log(activeProducts);
      setProducts(activeProducts);
    }
    fetchData();
  }, []);

  return (
    <TableContainer className={classes.tableContainer} component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Num in stock</TableCell>
            <TableCell align="center">Due to</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(products).map(function (productId, index) {
            return (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  <Link to={`/products/` + productId} className={classes.link}>
                    {products[productId]["name"]}
                  </Link>
                </TableCell>
                <TableCell>{products[productId]["num_in_stock"]}</TableCell>
                <TableCell align="center">N/A</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
