const Sequelize = require('sequelize');


module.exports = (sequelize) => (
  sequelize.define('report', {
    id: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    comment: {
      type: Sequelize.STRING
    },
    long: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    lat: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    mediaURL: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }, {
    // options
  })
);
