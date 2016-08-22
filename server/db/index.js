let Sequelize = require('sequelize');
let sequelize = new Sequelize('rally', 'root', null, {
  dialect: 'mysql',
  host: 'localhost',
  port: 3306,
  pool: {
    max: 5,
    min: 0,
    idle: 1000
  },
  define: {
    timestamps: false
  },
  logging: false
});

/************************************************
// Define project schema
************************************************/
var Project = sequelize.define('Project', {
  projectId: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  projectType: {
    type: Sequelize.STRING(255),
    allowNull: true
  },
  title: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  complete: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  projectTime: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  dataSet: {
    type: Sequelize.TEXT('long'),
    allowNull: true
  },
  generateDataSet: {
    type: Sequelize.TEXT('long'),
    allowNull: true
  },
  completedJobs: {
    type: Sequelize.TEXT('long'),
    allowNull: false
  },
  mapData: {
    type: Sequelize.TEXT('long'),
    allowNull: false
  },
  reduceResults: {
    type: Sequelize.TEXT('long'),
    allowNull: false
  },
  finalResult: {
    type: Sequelize.TEXT('long'),
    allowNull: true
  }
});

/************************************************
// Define pending project schema
************************************************/
var PendingProject = sequelize.define('PendingProject', {
  projectId: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  title: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  dataSet: {
    type: Sequelize.TEXT('long'),
    allowNull: true
  },
  generateDataSet: {
    type: Sequelize.TEXT('long'),
    allowNull: true
  },
  mapData: {
    type: Sequelize.TEXT('long'),
    allowNull: false
  },
  reduceResults: {
    type: Sequelize.TEXT('long'),
    allowNull: false
  }
});

Project.sync();
PendingProject.sync();
sequelize.authenticate()
  .then((err) => {
    if (err) {
      console.log('Unable to connect to the database :(');
    } else {
      console.log('Connection to db successful.');
    }
});

exports.Project = Project;
exports.PendingProject;

