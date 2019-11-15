import config from '../../config/config';

export const illegalWalletAddresses = [
  '149w62rY42aZBox8fGcmqNsXUzSStKeq8C',
  '1AjZPMsnmpdK2Rv9KQNfMurTXinscVro9V',
].concat(config.illegalWalletAddresses || []);
