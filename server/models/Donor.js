module.exports = (sequelize, DataTypes) => {
    const Donor = sequelize.define("Donor", {        
        nome: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        tipo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cpf: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        endereco: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cidade: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        bairro: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        telefone1: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: false,
            unique: true,
        },
        telefone2: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },
        telefone3: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },
        dia: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        mensalidade: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        media: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        observacao: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        timestamps: false
    });

    return Donor;
}


