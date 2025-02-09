const express = require("express");
const app = express();
const cors =require("cors")

app.use(express.json());
app.use(cors());
//Routes
const postRouter = require("./routes/username");
const tableDonor = require("./routes/tabledonor");
const donor = require("./routes/donor")

app.use("/username", postRouter);
app.use("/tabledonor", tableDonor);
app.use("/donor", donor)

const db = require("./models");

db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log("Servidor inicializado com sucesso na porta 3001");
    });
})






