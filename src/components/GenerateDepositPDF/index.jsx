import React from "react";
import { barCodeGenerator } from "../../services/barCodeGenerator";
import pdfMake from "pdfmake/build/pdfmake";
import { imagesInBase64 } from "../../assets/imagesInBase64";
import extenso from "extenso";

const GenerateDepositPDF = ({ data }) => {
 
  const generatePDF = async () => {
    const barcode = await barCodeGenerator(data.receipt_donation_id);
    const depositReceipt = [
      {
        columns: [
          {},
          {
            width: 224,
            margin: [0, 13],
            table: {
              widths: [58, 120],
              heights: [42, 8, 42],
              body: [
                [
                  {
                    text: "RECIBO:",
                    margin: [3, 15],
                    fontSize: 13,
                    fillColor: "#000000",
                    color: "#ffffff",
                    bold: true,
                  },
                  {
                    text: data.receipt_donation_id,
                    alignment: "center",
                    margin: [0, 15],
                    fontSize: 18,
                    bold: true,
                  },
                ],
                [
                  {
                    text: "", // Ajuste a altura para controlar o espaçamento
                    border: [false, true, false, false], // Borda apenas no topo
                    margin: [0, 0, 0, 0],
                  },
                  {
                    text: "",
                    border: [false, true, false, false], // Borda apenas no topo
                    margin: [0, 0, 0, 0],
                  },
                ],

                [
                  {
                    text: "VALOR:",
                    style: "tableReceipt",
                    margin: [4, 15],
                    fontSize: 13,
                    fillColor: "#000000",
                    color: "#ffffff",
                    bold: true,
                  },
                  {
                    text: data.donation_value?.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }),
                    alignment: "center",
                    margin: [0, 15],
                    fontSize: 18,
                    bold: true,
                  },
                ],
              ],
            },

            layout: {
              hLineWidth: function (i, node) {
                return 3;
              },
              vLineWidth: function (i, node) {
                return 3;
              },
              hLineColor: function (i, node) {
                return "#000000";
              },
              vLineColor: function (i, node) {
                return "#000000";
              },
            },
          },
          {
            width: 181,
            table: {
              widths: [208],
              heights: [146],
              body: [
                [
                  {
                    image: barcode,
                    width: 150,
                    height: 60,
                    margin: [-5, 42],
                    alignment: "center",
                  },
                ],
              ],
            },
          },
        ],
        margin: [0, -4],
      },
      {
        text: "",
        margin: [0, 19],
      },

      {
        margin: [36, 0, 0, 0],
        stack: [
          {
            columns: [
              {
                text: "Recebemos de",
                fontSize: 16,
                margin: [0, 0, 0, 16],
              },
              {
                text: data.donor?.donor_name.normalize("NFD").toUpperCase(),
                fontSize: 20,
                margin: [-120, -2, 0, 0],
                decoration: "underline",
              },
              /*{
                text: `| CPF: ${data[0].cpf}` || "___________",
                fontSize: 18,
                margin: [-70, 0, 0, 0],
              },*/
            ],
          },

          {
            columns: [
              {
                text: "a importância de",
                fontSize: 16,
                margin: [0, 0, 0, 16],
              },
              {
                text: `${extenso(Number(data.donation_value), {
                  mode: "currency",
                }).toUpperCase()}`,
                fontSize: 16,
                margin: [-224, 0, 0, 16],
                decoration: "underline",
              },
            ],
          },
          {
            text: `que será destinada à campanha ${data.donation_campain?.toUpperCase()}`,
            fontSize: 16,
            margin: [0, 0, 0, 24],
          },
          {
            text: `Rio de Janeiro,     ${new Date().toLocaleDateString(
              "pt-BR",
              {
                timeZone: "UTC",
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            )}`,
            fontSize: 16,
            margin: [0, 0, 0, 56],
          },
          "\n",
          {
            text: "LAVEM AS MÃOS\nESTAMOS TODOS CONTRA O COVID-19",
            alignment: "center",
            fontSize: 20,
          },
        ],
      },
    ];

    const docDefinition = {
      pageSize: "A4",
      pageOrientation: "landscape",
      pageMargin: [0, 0, 0, 0],
      content: depositReceipt,
      style: {
        values: {
          fontSize: 12,
          bold: true,
          fillColor: "#000000",
          color: "#ffffff",
        },
        label: { fontSize: 9, bold: false, fonts: "Courier" },
        title: { fontSize: 12, bold: true, margin: [0, 0, 0, 10] },
        rodape: { fontSize: 10, bold: true },
      },
      background: function (currentPage, pageSize) {
        return {
          image: imagesInBase64.receipt,
          width: pageSize.width,
          height: pageSize.height,
        };
      },
    };

    pdfMake.createPdf(docDefinition).download("deposito.pdf");
  };
  return <button onClick={generatePDF}>Enviar</button>;
};

export default GenerateDepositPDF;
