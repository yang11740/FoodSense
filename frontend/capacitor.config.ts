import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.foodsense.app',
  appName: 'FoodSense',
  webDir: 'dist',
  "plugins": {
    "CapacitorNodeJS": {
      "nodeDir": "nodejs"
    }
  }
};

export default config;
