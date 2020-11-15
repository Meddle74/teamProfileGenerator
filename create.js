const inquirer = require('inquirer');
const fs = require('fs');
const Engineer = require('./lib/Engineer');
const Intern = require('./lib/Intern');
const Manager = require('./lib/Manager');

const teamMembers = [];

function startApp() {
  startHTML();
  addTeamMember();
}

function addTeamMember() {
  inquirer
    .prompt([
      {
        message: "What is the team members name?",
        name: 'name',
      },
      {
        type: 'list',
        message: "What is the team members role?",
        choices: ['Manager', 'Engineer', 'Intern'],
        name: 'role',
      },
      {
        message: "Enter team member's id",
        name: 'id',
      },
      {
        message: "Enter team member's email address",
        name: 'email',
      },
    ])
    .then(function ({ name, role, id, email }) {
      let roleType = '';
      if (role === 'Engineer') {
        roleType = 'GitHub username';
      } else if (role === 'Intern') {
        roleType = 'school name';
      } else {
        roleType = 'office phone number';
      }
      inquirer
        .prompt([
          {
            message: `Enter team member's ${roleType}`,
            name: 'roleType',
          },
          {
            type: 'list',
            message: 'Would you like to add more team members?',
            choices: ['Yes', 'No'],
            name: 'additionalMembers',
          },
        ])
        .then(function ({ roleType, additionalMembers }) {
          let newMember;
          if (role === 'Engineer') {
            newMember = new Engineer(name, id, email, roleType);
          } else if (role === 'Intern') {
            newMember = new Intern(name, id, email, roleType);
          } else {
            newMember = new Manager(name, id, email, roleType);
          }
          teamMembers.push(newMember);
          memberHTML(newMember).then(function () {
            if (additionalMembers === 'Yes') {
              addTeamMember();
            } else {
              endHTML();
            }
          });
        });
    });
}

function startHTML() {
  const html = `
                <!DOCTYPE html>
                <html lang="en-us">
                
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <title>Team Member Listings</title>
                  <!-- Bootstrap CDN -->
                  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
                  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css" />
                </head>
                
                <body>
                  <nav class="navbar navbar-dark bg-dark mb-5">
                    <span class="navbar-brand mb-0 h1 w-100 text-center">Team Profile</span>
                  </nav>
                  <div class="container">
                    <div class="row">
            `;
  fs.writeFile('./output/team.html', html, function (err) {
    if (err) {
      console.log(err);
    }
  });
  console.log('start');
}

function memberHTML(memberType) {
  return new Promise(function (resolve, reject) {
    const name = memberType.getName();
    const role = memberType.getRole();
    const id = memberType.getId();
    const email = memberType.getEmail();
    let teamMemberHTML = '';

    switch (role) {
      case 'Manager':
        const officePhone = memberType.getOfficeNumber();
        teamMemberHTML = `
        <div class="col-6">
            <div class="card mx-auto mb-3" style="width: 400px">
              <h5 class="card-header">${name} <i class="fas fa-users"></i><br><br>Manager</h5>
                <ul class="list-group list-group-flush">
                <li class="list-group-item">ID <i class="far fa-id-badge"></i> : ${id}</li>
                  <li class="list-group-item">Email Address <i class="far fa-envelope"></i> : ${email}</li>
                  <li class="list-group-item">Office Phone <i class="fas fa-phone"></i> : ${officePhone}</li>
                  </ul>
              </div>
          </div>
          `;
        break;

      case 'Engineer':
        const gitHub = memberType.getGithub();
        teamMemberHTML = `
              <div class="col-6">
                <div class="card mx-auto mb-3" style="width: 400px">
                  <h5 class="card-header">${name} <i class="fas fa-cogs"></i><br><br>Engineer</h5>
                    <ul class="list-group list-group-flush">
                      <li class="list-group-item">ID <i class="far fa-id-badge"></i> : ${id}</li>
                      <li class="list-group-item">Email Address <i class="far fa-envelope"></i> : ${email}</li>
                      <li class="list-group-item">GitHub <i class="fab fa-github"></i></i> : ${gitHub}</li>
                      </ul>
                  </div>
              </div>
          `;
        break;
      case 'Intern':
        const school = memberType.getSchool();
        teamMemberHTML = `
            <div class="col-6">
              <div class="card mx-auto mb-3" style="width: 400px">
                <h5 class="card-header">${name} <i class="fas fa-user-graduate"></i><br><br>Intern</h5>
                  <ul class="list-group list-group-flush">
                  <li class="list-group-item">ID <i class="far fa-id-badge"></i> : ${id}</li>
                    <li class="list-group-item">Email Address <i class="far fa-envelope"></i> : ${email}</li>
                    <li class="list-group-item">School <i class="fas fa-university"></i> : ${school}</li>
                    </ul>
                </div>
            </div>
          `;
        break;
      case 'None':
        break;
    }

    console.log('Team Member has been added!!');
    fs.appendFile('./output/team.html', teamMemberHTML, function (err) {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
}

function endHTML() {
  const html = ` </div></div></body></html>`;

  fs.appendFile('./output/team.html', html, function (err) {
    if (err) {
      console.log(err);
    }
  });
  console.log('Team Profile HMTL has been generated!!');
}

startApp();
