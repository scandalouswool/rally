let Sequelize = require('sequelize');

var sequelize = new Sequelize('legacy', null, null, {
   protocol: 'postgres',
   dialect: 'postgres',
   host: 'localhost',
   define: {
     timestamps: false,
   }
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
    allowNull: true
  },
  projectTime: {
    type: Sequelize.INTEGER,
    allowNull: true
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
    allowNull: true
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
exports.PendingProject = PendingProject;
