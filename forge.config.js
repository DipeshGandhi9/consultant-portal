module.exports = {
  packagerConfig: {},
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: "first-angular-electron-app"
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        name: "first-angular-electron-app"
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        name: "first-angular-electron-app"
      },
    },
    {
      name: '@electron-forge/maker-wix',
      config: {
        language: 1033,
        manufacturer: 'Jyoti Technosoft LLP'
      }
    },
  ],
};
