let Sequelize = require('sequelize');

if (process.env.DATABASE_URL) {
  var sequelize = new Sequelize(process.env.DATABASE_URL, {
    protocol: 'postgres',
    dialect: 'postgres',
    host: process.env.DATABASE_URL.split(':')[2]
  });
} else {
  //Change the arguments to sequelize as neccessary ('Database', 'username', 'password')
  var sequelize = new Sequelize('rally', null, null, {
    protocol: 'postgres', // or mysql
    dialect: 'postgres', // or mysql
    host: 'localhost'
  });
}

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
