module.exports = (sequelize, DataTypes) => {
    const TableDonor = sequelize.define("TableDonor", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: false,
            unique: true,
        },
        recibo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        operador: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        valor: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        contato: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        receber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        recebida: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        impresso: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        recebido: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        mesref: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        coletador: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        timestamps: false
    });

    return TableDonor;
}


