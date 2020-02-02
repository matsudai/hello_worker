const builder = require('electron-builder');
const fs = require('fs');
const package_json = JSON.parse(fs.readFileSync('./package.json'));

builder.build({
  config: {
    'appId': `${package_json.name}`,
    'win': {
      'target': 'zip'
    }
  }
});
