import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage';
import compareVersions from 'compare-versions';

import makeRequest from '../utils/makeRequest';
import {GET_APP_VERSION} from '../apollo/queries/appInitialization';

class ForceUpdateService {
  private readonly localVersion: string = '';
  private remoteVersion: string;
  private isActual: boolean = true;
  private isForced: boolean = false;
  public failed: boolean = false;

  constructor() {
    this.localVersion = DeviceInfo.getVersion();
  }

  async ignoreVersion(callback) {
    await AsyncStorage.setItem('SKIP_UPDATE', this.remoteVersion);
    callback();
  }

  async compareVersions(onActual, onOutdated, onForced) {
    try {
      const skipped_version = await AsyncStorage.getItem('SKIP_UPDATE');
      await this.getLiveVersion();

      this.isActual = compareVersions.compare(this.localVersion, this.remoteVersion, '>=');

      if (skipped_version) {
        if (compareVersions.compare(skipped_version, this.remoteVersion, '=')) {
          return onActual();
        }
      }

      if (this.isActual) {
        return onActual();
      }

      if (this.isForced) {
        return onForced();
      }

      !this.isActual && onOutdated();
    } catch (e) {
      this.failed = true;
      console.log(`[ForceUpdateService]: %c${e.message}`, 'background: red; color: #000; font-size: medium');
    }
  }

  private async getLiveVersion() {
    const {
      data: {data, errors},
    } = await makeRequest(GET_APP_VERSION);

    if (errors) {
      const [error] = errors;
      throw new Error(error.message);
    }

    if (data) {
      this.isForced = data.versionCheck.isForced;
      this.remoteVersion = data.versionCheck.version;
    }
  }
}

export default new ForceUpdateService();
