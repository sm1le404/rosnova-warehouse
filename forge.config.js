require('dotenv').config({
  path: `.env`,
});

module.exports = {
  packagerConfig: {
    asar: true,
    icon: './images/icon',
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: () => ({
        noDelta: true,
      }),
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
      config: (arch) => ({
        // eslint-disable-next-line max-len
        macUpdateManifestBaseUrl: `${process.env.APP_STORE_URL}/${arch}`,
      }),
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-s3',
      config: {
        public: false,
        endpoint: process.env.S3_ENPOINT,
        bucket: process.env.S3_BUCKET,
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_ACCESS_KEY,
        folder: process.env.S3_FOLDER,
        region: process.env.S3_REGION,
      },
    },
  ],
};
