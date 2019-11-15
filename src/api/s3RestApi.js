import AWS from 'aws-sdk/global';
import S3 from 'aws-sdk/clients/s3';
import uuidv1 from 'uuid';

class S3RestApi {
  constructor(
    region = 'us-east-1',
    bucketName = 'crypto-kyc-dev',
    identityPoolId = 'us-east-1:674a8a5a-86b3-4013-a4c6-797d90f31802',
  ) {
    // Updates config
    AWS.config.update({
      region,
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: identityPoolId,
      }),
    });

    /**
     * @param {Array} files - An array of JavaScript file objects containing
     *    files to be uploaded
     */
    this.uploadFiles = (files, siteName) => new Promise((resolveAll, rejectAll) => {
      AWS.config.credentials.get((error) => {
        if (!error) {
          const s3 = new S3({
            apiVersion: '2006-03-01',
            Bucket: bucketName,
            correctClockSkew: true,
          });

          // TODO: add user ID to file key?
          const fileExtensionRegEx = /(?:\.([^.]+))?$/;
          const fileKeys = files.map((file) => {
            const timestamp = +new Date();
            const fileExtension = fileExtensionRegEx.exec(file.name)[0];
            return `${siteName}/000000-${timestamp}-${uuidv1()}${fileExtension}`;
          });

          const fileUploadPromises = files.map((file, index) => uploadFile(file, fileKeys[index], s3));
          Promise.all(fileUploadPromises).then(() => {
            resolveAll();
          });
        } else {
          rejectAll(error);
        }
      });
    });

    const uploadFile = (file, fileKey, s3) => new Promise((resolve, reject) => {
      s3.upload(
        {
          Key: fileKey,
          Body: file,
          Bucket: bucketName,
          ACL: 'public-read-write',
        },
        (uploadError, _) => {
          if (!uploadError) {
            resolve();
          } else {
            reject(uploadError);
          }
        },
      );
    });
  }
}

export default S3RestApi;
