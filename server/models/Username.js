module.exports = (sequelize, DataTypes) => {
    const Username = sequelize.define("Username", {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        usertype: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        timestamps: false
    });

    

    return Username;
}