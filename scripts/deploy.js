const fs = require('fs');
const path = require('path');
const recursive = require('recursive-readdir');
const S3 = require('aws-sdk/clients/s3');
const CloudFront = require('aws-sdk/clients/cloudfront');

const customAWSRegion = process.env.AWS_CUSTOM_REGION;
const cloudfrontDistributionId = process.env.DISTRIBUTION_ID;

const s3 = customAWSRegion ? new S3({ apiVersion: '2006-03-01', region: customAWSRegion }) : new S3({ apiVersion: '2006-03-01' });
const cloudfront = new CloudFront();

const s3Bucket = getS3BucketName();
const buildDirectoryPath = path.join(__dirname, '../build');
const fingerprintedFilesPath = path.join(buildDirectoryPath, 'latest-fingerprinted-files.json');
const topLevelDirectoryPath = path.join(__dirname, '..');
const s3FileKeys = [];

const deployDirectoryPaths = [
  { [buildDirectoryPath]: '*.html' },
  { [path.join(topLevelDirectoryPath, 'images')]: '*.html' },
  { [path.join(topLevelDirectoryPath, 'lang')]: '*.html' },
];

startDeploy();

/**
 * Loads a JSON of all objects from the previous deploy
 * and passes this to the deploy function (if it exists).
 * The previous deploy objects will be tagged with
 * "latest=false" and the s3 bucket lifecycle policy
 * will clean them up after a certain amount of time.
 *
 * After these objects are tagged "latest=false", uploads
 * new objects and tags them as "latest=true" so they are
 * not cleaned up by the bucket lifecycle policy. Finally,
 * PUTs a JSON of the paths of the newly deployed objects.
 */
function startDeploy() {
  // If bucket exists, proceed
  s3.waitFor('bucketExists', { Bucket: s3Bucket })
    .promise()
    .then(() => {
      const getObjectParams = {
        Bucket: s3Bucket,
        Key: path.basename(fingerprintedFilesPath),
      };

      // Get JSON object containing paths of objects
      // from previous deploy. Continue deploy with these
      // paths if file exists.
      s3.getObject(getObjectParams)
        .promise()
        .then(values => tagDeployedS3ObjectsPromise(JSON.parse(values.Body.toString())))
        .catch((reason) => {
          console.log(reason);
        })
        .then(() => deployS3ObjectsPromise())
        .then((values) => {
          values.map((response) => {
            console.log(`Uploaded: ${response.$response.request.params.Key}`);
          });
          return invalidateCloudfrontPromise(cloudfrontDistributionId);
        })
        .then()
        .catch((reason) => {
          console.log(reason);
        });

      setS3BucketWebsite();
      setS3BucketLifecycleConfiguration();
    })
    .catch((reason) => {
      // Bucket does not exist, need to create it
      console.log(`Creating bucket ${s3Bucket}`);
      createS3Bucket();
    });
}

function createS3Bucket() {
  const params = { Bucket: s3Bucket };
  if (customAWSRegion) {
    params.CreateBucketConfiguration = { LocationConstraint: customAWSRegion };
  }

  s3.createBucket(params)
    .promise()
    .then(() => {
      startDeploy();
    })
    .catch((reason) => {
      console.log('Bucket creation fail: ', reason);
      process.exit(1);
    });
}

function getS3BucketName() {
  if (!process.env.TRAVIS_BRANCH) {
    console.log('Set "TRAVIS_BRANCH" env var to run deploy.');
    process.exit(1);
  }

  // Set the proper bucket from CI env vars.
  // TRAVIS_PULL_REQUEST is set to the pull request number if the
  // current job is a pull request build, or 'false' if it’s not.
  const domain = process.env.TRAVIS_BRANCH.replace('s3/', '');
  const pullRequest = process.env.TRAVIS_PULL_REQUEST;

  if (pullRequest !== 'false') {
    return `${domain}-${pullRequest}`;
  }

  if (domain === 'dev') {
    return 'v3.shiftcrypto-qa.com';
  }

  return domain;
}

function setS3BucketWebsite() {
  const staticHostParams = {
    Bucket: s3Bucket,
    WebsiteConfiguration: {
      ErrorDocument: {
        Key: 'index.html',
      },
      IndexDocument: {
        Suffix: 'index.html',
      },
    },
  };

  s3.putBucketWebsite(staticHostParams)
    .promise()
    .then()
    .catch((reason) => {
      console.log('Bucket website creation fail: ', reason);
    });
}

function setS3BucketLifecycleConfiguration() {
  const lifecycleConfigParams = {
    Bucket: s3Bucket,
    LifecycleConfiguration: {
      Rules: [
        {
          Status: 'Enabled',
          Expiration: {
            Days: '14',
          },
          Filter: {
            Tag: {
              Key: 'latest',
              Value: 'false',
            },
          },
          ID: 'ExpireOldDeployVersions',
        },
      ],
    },
  };

  s3.putBucketLifecycleConfiguration(lifecycleConfigParams)
    .promise()
    .then()
    .catch((reason) => {
      console.log('Bucket lifecycle configuration error: ', reason);
    });
}

function tagDeployedS3ObjectsPromise(previousDeployObjectFilePaths) {
  previousDeployObjectFilePaths.forEach((path) => {
    const putObjectTaggingParams = {
      Bucket: s3Bucket,
      Key: path,
      Tagging: {
        TagSet: [
          {
            Key: 'latest',
            Value: 'false',
          },
        ],
      },
    };
    return s3.putObjectTagging(putObjectTaggingParams).promise();
  });
}

function deployS3ObjectsPromise(paths = deployDirectoryPaths) {
  const deployDirectoryPromises = paths.map((deployDirectoryPathObject) => {
    const deployDirectoryPath = Object.keys(deployDirectoryPathObject)[0];
    return recursive(deployDirectoryPath, [deployDirectoryPathObject[deployDirectoryPath]]);
  });

  let putObjectPromises = [];

  return Promise.all(deployDirectoryPromises)
    .then((filePaths) => {
      putObjectPromises = putObjectPromises.concat(putS3KeysFromFilePathsPromises(filePaths));
      return recursive(buildDirectoryPath, [ignoreFuncForNonHtmlFiles]);
    })
    .then((values) => {
      // Upload all .html files after all other files in order to
      // avoid race conditions e.g. an index.html is uploaded
      // which references an as of yet uploaded fingerprinted .css
      putObjectPromises = putObjectPromises.concat(putS3KeysFromFilePathsPromises(values));
      fs.writeFileSync(fingerprintedFilesPath, JSON.stringify(s3FileKeys));
      putObjectPromises.push(putObjectPromise(fingerprintedFilesPath));
      return Promise.all(putObjectPromises);
    });
}

function isFileInBuildDir(filePath) {
  return filePath.includes(buildDirectoryPath);
}

function ignoreFuncForNonHtmlFiles(file, stats) {
  return path.extname(file).toLowerCase() != '.html';
}

function putS3KeysFromFilePathsPromises(filePaths) {
  const allFilePaths = Array.prototype.concat.apply([], filePaths);
  const promises = [];

  allFilePaths.forEach((filePath) => {
    promises.push(putObjectPromise(filePath));

    if (isFileInBuildDir(filePath)) {
      s3FileKeys.push(path.relative(buildDirectoryPath, filePath));
    } else {
      s3FileKeys.push(path.relative(topLevelDirectoryPath, filePath));
    }
  });

  return promises;
}

function getPutObjectParams(params = null) {
  if (params !== null) {
    return params;
  }
  return {
    ACL: 'public-read',
    Bucket: s3Bucket,
    CacheControl: 'max-age=604800',
    Tagging: 'latest=true',
    ContentDisposition: 'inline',
  };
}

function putObjectPromise(filePath, params = getPutObjectParams(), timeout = 5000) {
  const body = fs.readFileSync(filePath);
  let key = null;

  if (isFileInBuildDir(filePath)) {
    key = path.relative(buildDirectoryPath, filePath);
  } else {
    key = path.relative(topLevelDirectoryPath, filePath);
  }

  params.Body = body;
  params.Key = key;
  params.ContentType = getContentType(key);

  return s3.putObject(params).promise();
}

function getContentType(key) {
  const parts = key.split('.');
  const extension = parts[parts.length - 1];
  let type;

  switch (extension) {
    case 'html':
      type = 'text/html';
      break;
    case 'css':
      type = 'text/css';
      break;
    case 'js':
      type = 'application/javascript';
      break;
    case 'json':
      type = 'application/json';
      break;
    case 'svg':
      type = 'image/svg+xml';
      break;
    case 'eot':
      type = 'application/vnd.ms-fontobject';
      break;
    case 'woff':
      type = 'application/x-font-woff';
      break;
    case 'ico':
      type = 'image/vnd.microsoft.icon';
      break;
    case 'png':
      type = 'image/png';
      break;
    default:
      type = 'binary/octet-stream';
  }

  return type;
}

/**
 * The Cloudfront Distribution ID will be
 * set from the DISTRIBUTION_ID env var
 * when called from the startDeploy() function.
 */
function invalidateCloudfrontPromise(distributionId = null) {
  if (distributionId == null) {
    console.log('Please set env var DISTRIBUTION_ID to invalidate cloudfront cache after deploy.');
    return;
  }

  const params = {
    DistributionId: distributionId,
    InvalidationBatch: {
      CallerReference: `cointrader-deploy-invalidation-${new Date().getTime()}`,
      Paths: {
        Quantity: '1',
        Items: ['/*.html'],
      },
    },
  };

  return cloudfront.createInvalidation(params).promise();
}
