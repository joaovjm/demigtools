import React from "react";
import pdfMake, { fonts } from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { imagesInBase64 } from "../../assets/imagesInBase64";
import { barCodeGenerator } from "../../services/barCodeGenerator";

pdfMake.vfs = pdfFonts.vfs;

// Função para gerar código de barras em base64 no navegador

const GenerateReceiptPDF = ({ cards }) => {
  
  const gerarPDF = async () => {
    const recibos = await Promise.all(
      cards.map(async (data) => {
        const barcode = await barCodeGenerator(data.recibo);
        return {
          stack: [
            {
              columns: [
                {
                  width: 290,
                  stack: [
                    {
                      columns: [
                        { image: barcode, width: 70, margin: [0, 0, 0, 5] },
                        { text: "MANANCIAL", style: "title" },
                      ],
                      columnGap: 32,
                    },
                    { text: "", margin: [0, 5] },
                    {
                      text: `DOADOR: ${data.nome}`,
                      margin: [0, 0, 0, 2],
                      style: "label",
                    },
                    {
                      canvas: [
                        {
                          type: "line",
                          x1: 0,
                          y1: 0,
                          x2: 250,
                          y2: 0,
                          lineWidth: 0.5,
                          lineColor: "#000000",
                        },
                      ],
                    },
                    {
                      text: `TEL: ${data.telefone}`,
                      style: "label",
                      margin: [0, 0, 0, 2],
                    },
                    {
                      text: `ENDEREÇO: ${data.endereco}`,
                      style: "title",
                      margin: [0, 0, 0, 2],
                    },
                    {
                      text: `BAIRRO: ${data.bairro}  CIDADE: ${data.cidade}`,
                      style: "label",
                      margin: [0, 0, 0, 2],
                    },
                    {
                      canvas: [
                        {
                          type: "line",
                          x1: 0,
                          y1: 0,
                          x2: 250,
                          y2: 0,
                          lineWidth: 0.5,
                          lineColor: "#000000",
                        },
                      ],
                    },
                    {
                      text: `VALOR: R$${data.valor} - TIPO: ${data.tipo}`,
                      style: "title",
                      margin: [0, 0, 0, 2],
                    },
                    {
                      text: `RECIBO: ${data.recibo} | DT.REC: ${data.dataRecibo}`,
                      style: "label",
                      margin: [0, 0, 0, 2],
                    },
                    {
                      canvas: [
                        {
                          type: "line",
                          x1: 0,
                          y1: 0,
                          x2: 250,
                          y2: 0,
                          lineWidth: 0.5,
                          lineColor: "#000000",
                        },
                      ],
                    },
                    {
                      text: `U.COL: ${data.ucol}${
                        data.rcol
                          ? ` | R.COL: ${data.rcol} ${data.nomeColetador}`
                          : ""
                      } | OP: ${data.operador} ${data.nomeOperador} | U: ${
                        data.dataUltima
                      }`,
                      style: "label",
                      margin: [0, 0, 0, 2],
                    },
                    {
                      canvas: [
                        {
                          type: "line",
                          x1: 0,
                          y1: 0,
                          x2: 250,
                          y2: 0,
                          lineWidth: 0.5,
                          lineColor: "#000000",
                        },
                      ],
                    },
                    { text: `OBS: ${data.observacao}`, style: "label" },
                    data.aviso && {
                      text: `AVISO: ${data.aviso}`,
                      style: "title",
                      margin: [0, 0, 0, 2],
                    },
                    "\n",
                  ],
                },
                {
                  width: "*",
                  stack: [
                    {
                      table: {
                        widths: [110],

                        body: [
                          [
                            {
                              image: imagesInBase64.manancialLogo,
                              width: 160,
                              height: 180,
                              alignment: "center",
                            },
                          ],
                        ],
                      },
                      layout: {
                        hLineWidth: function (i, node) {
                          return 0;
                        }, // Remove linhas horizontais
                        vLineWidth: function (i, node) {
                          return 0;
                        }, // Remove linhas verticais
                        paddingLeft: function (i) {
                          return 4;
                        }, // Ajuste de padding
                        paddingRight: function (i) {
                          return 4;
                        },
                      },
                    },
                    { text: "@cg.manancial", fontSize: 9 },
                    { text: "@centrogeriatrico.manancial", fontSize: 9 },
                    { text: "cgmanancial@gmail.com", fontSize: 9 },
                  ],
                },
              ],
              columnGap: -15,
            },
            {
              text: "",
              margin: [0, 50],
            },
            {
              columns: [
                {},
                {
                  widths: ["*"],
                  table: {
                    widths: [36, 50],
                    heights: [20, 20],
                    body: [
                      [
                        { text: "RECIBO:", style: "tableReceipt" },
                        {
                          text: data.recibo,
                          style: "label",
                          alignment: "center",
                          margin: [0, 5],
                        },
                      ],
                      [
                        { text: "VALOR:", style: "tableReceipt" },
                        {
                          text: data.valor,
                          style: "label",
                          alignment: "center",
                          margin: [0, 5],
                        },
                      ],
                    ],
                  },
                  layout: {
                    hLineWidth: function (i, node) {
                      return 1;
                    },
                    vLineWidth: function (i, node) {
                      return 1;
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
                  table: {
                    widths: [90],
                    heights: [50],
                    body: [
                      [
                        {
                          image: barcode,
                          width: 70,
                          margin: [0, 8],
                          alignment: "center",
                        },
                      ],
                    ],
                  },
                },
              ],
              columnGap: -30,
              margin: [0, 20],
              alignment: "center",
            },
            {
              stack: [
                {
                  text: `Recebemos de ${data.nome} | CPF: ${
                    data.cpf || "___________"
                  }.`,
                  style: "label",
                },
                {
                  text: `a importância de ${data.valorExtenso}`,
                  style: "label",
                },
                {
                  text: `que será destinada à campanha OBRAS ASSISTENCIAIS`,
                  style: "label",
                },
                {
                  text: `Rio de Janeiro, ${data.dataReciboExtenso}`,
                  style: "label",
                },
                "\n",
                {
                  text: "LAVEM AS MÃOS\nESTAMOS TODOS CONTRA O COVID-19",
                  style: "rodape",
                  alignment: "center",
                },
              ],
            },
          ],
          margin: [10, 10, 10, 10],
        };
      })
    );

    // Agrupar recibos em pares (2 por página A4 paisagem)
    const paginas = [];
    for (let i = 0; i < recibos.length; i += 2) {
      const par = [recibos[i], recibos[i + 1] || ""]; // um ou dois por página
      paginas.push({
        columns: par,
        columnGap: 0,
        ...(i + 2 < recibos.length ? { pageBreak: "after" } : {}),
      });
    }

    const docDefinition = {
      pageSize: "A4",
      pageOrientation: "landscape",
      pageMargins: [0, 0, 0, 0],
      content: paginas,
      styles: {
        label: { fontSize: 9, bold: false, fonts: "Courier" },
        title: { fontSize: 12, bold: true, margin: [0, 0, 0, 10] },
        rodape: { fontSize: 10, bold: true },
        tableReceipt: {
        fontSize: 9,
        margin: [0, 5]
      }
      },
      
    };
    pdfMake.createPdf(docDefinition).download("recibos.pdf");
  };
  return <button onClick={gerarPDF}>Gerar Recibos em PDF</button>;
};

export default GenerateReceiptPDF;