import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import ReactApexChart from "react-apexcharts";

import { getProductStatistics } from "../../api/dataParsing/dataParsingApi";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: 10,
    fontSize: 18,
    width: "70vw",
    flexGrow: 1,
  },
}));

export default function ProductDetailPage() {
  const classes = useStyles();

  const { productId } = useParams();

  const [productName, setProductName] = useState("");
  const [categories, setCategories] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [entriesQuantity, setEntriesQuantity] = useState([]);
  const [entriesPrice, setEntriesPrice] = useState([]);
  const [numInStock, setNumInStock] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const productStatistics = (await getProductStatistics(productId)).data;
      console.log(productStatistics);
      setProductName(productStatistics.name);
      setCategories(productStatistics.dates);
      setPurchases(productStatistics.purchase_values);
      setEntriesQuantity(productStatistics.entry_values_quantity);
      setEntriesPrice(productStatistics.entry_values_price);
      setNumInStock(productStatistics.num_in_stock);
    }
    fetchData();
  }, []);

  return (
    <Container className={classes.container} maxWidth="lg">
      <div className="chart">
        <ReactApexChart
          options={{
            chart: {
              type: "line",
              stacked: false,
            },
            dataLabels: {
              enabled: false,
            },
            stroke: {
              width: [2.5, 2.5, 1, 1.5],
            },
            title: {
              text: productName,
              align: "center",
              offsetX: 20,
            },
            xaxis: {
              categories: categories,
            },
            yaxis: [
              {
                seriesName: "Покупки",
                axisTicks: {
                  show: true,
                },
                axisBorder: {
                  show: true,
                  color: "#d63c24",
                },
                labels: {
                  style: {
                    colors: "#d63c24",
                  },
                },
                title: {
                  text: "Покупки",
                  style: {
                    color: "#d63c24",
                  },
                },
                tooltip: {
                  enabled: true,
                },
              },
              {
                seriesName: "Продажи (кол-во)",
                axisTicks: {
                  show: true,
                },
                axisBorder: {
                  show: true,
                  color: "#67DF9C",
                },
                labels: {
                  style: {
                    colors: "#67DF9C",
                  },
                },
                title: {
                  text: "Продажи (кол-во)",
                  style: {
                    color: "#67DF9C",
                  },
                },
                tooltip: {
                  enabled: true,
                },
              },
              {
                seriesName: "Цена продажи",
                axisTicks: {
                  show: false,
                },
                axisBorder: {
                  show: false,
                },
                labels: {
                  show: false,
                },
              },
              {
                seriesName: "Количество на складе",
                axisTicks: {
                  show: true,
                },
                axisBorder: {
                  show: true,
                  color: "#008FFB",
                },
                labels: {
                  style: {
                    colors: "#008FFB",
                  },
                },
                title: {
                  text: "Количество на складе",
                  style: {
                    color: "#008FFB",
                  },
                },
                tooltip: {
                  enabled: true,
                },
              },
            ],
            tooltip: {
              fixed: {
                enabled: true,
                position: "bottomLeft", // topRight, topLeft, bottomRight, bottomLeft
                offsetY: -50,
                offsetX: -180,
              },
            },
            legend: {
              horizontalAlign: "right",
              offsetX: 40,
            },
          }}
          series={[
            {
              name: "Покупки",
              type: "bar",
              data: purchases,
              color: "#d63c24",
            },
            {
              name: "Продажи (кол-во)",
              type: "bar",
              data: entriesQuantity,
            },
            {
              name: "Цена продажи",
              type: "line",
              data: entriesPrice,
            },
            {
              name: "Количество на складе",
              type: "line",
              data: numInStock,
              color: "#008FFB",
            },
          ]}
          type="line"
          width="1000"
          height="450"
        />
      </div>
    </Container>
  );
}
