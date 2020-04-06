const ReportDAOInit = require('./models/Report');
const Sequelize = require('sequelize');

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;

let ReportDAO;

const initDB = async () => {
  const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql',
    port: DB_PORT,
  });
  ReportDAO = ReportDAOInit(sequelize);
  await ReportDAO.sync();
};

const addReport = async () => {
  return await ReportDAO.create({
    comment: 'test',
    long: 12.3,
    lat: 12.0,
    mediaURL: 'https://plates-reviewer-storage-2.s3.amazonaws.com/car-images/e0c20ff2-3a5b-4cd7-a49f-e3b7c79c50ed-35285831_2190705280956701_1595269940292616192_o.jpg',
  });
};

const getReports = () => {
  return ReportDAO.findAll();
};

module.exports = {
  addReport,
  getReports,
  initDB
};
