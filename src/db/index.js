const ReportDAOInit = require('./models/Report');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;

let ReportDAO;

const initDB = async () => {
  const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'mariadb',
    port: DB_PORT,
  });
  ReportDAO = ReportDAOInit(sequelize);
  await ReportDAO.sync();
};

const addReport = async (data) => {
  return await ReportDAO.create({
    comment: data.comment,
    long: data.long,
    lat: data.lat,
    mediaURL: data.mediaURL,
    platesNumber: data.platesNumber,
  });
};

const getReports = async (skip, limit, search) => {
  const result = await ReportDAO.findAndCountAll({
    order: [['updatedAt', 'DESC']],
    where: {
      platesNumber: {
        [Op.like]: `%${search}%`,
      },
    },
    limit,
    offset: skip,
  });
  console.log('result is ', result);
  return {
    result: result.rows.map(i=>i.get()),
    total: result.count,
  };
};

const removeReport = async (id) => {
  const result =  await ReportDAO.destroy({
    where: {
      id,
    }
  });

  if ( result === 0 ) {
    throw {
      resCode: 400,
      message: 'Invalid ID',
    };
  } else {
    return id;
  }
};

module.exports = {
  addReport,
  getReports,
  initDB,
  removeReport,
};
