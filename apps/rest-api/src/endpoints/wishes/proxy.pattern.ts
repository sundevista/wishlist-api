interface IntegrationScannerInterface {
  scan(): string;
}

class IntegrationScanner implements IntegrationScannerInterface {
  private data = 'data result';

  scan(): string {
    // Do some scanning work...
    console.log('Scan finished!');
    return `///scan result: ${this.data}///`;
  }
}

class SafeIntegrationScanner implements IntegrationScannerInterface {
  private realIntegrationScanner: IntegrationScanner;

  constructor(realIntegrationScanner: IntegrationScanner) {
    this.realIntegrationScanner = realIntegrationScanner;
  }

  scan(): string {
    if (this.checkDatabaseAccess()) {
      const result = this.realIntegrationScanner.scan();
      this.logIntegrationData(result);
      return result;
    }
    console.log('data is corrupted, check your settings!');
    return '';
  }

  checkDatabaseAccess(): boolean {
    // Checking database availability...
    console.log('database is active');
    return true;
  }

  logIntegrationData(data: string): void {
    console.log(`: Logged data = {${data}}`);
  }
}

// Code Usage
const commonIntegrationScanner = new IntegrationScanner();
console.log(commonIntegrationScanner.scan());

const proxyIntegrationScanner = new SafeIntegrationScanner(
  commonIntegrationScanner,
);
console.log(proxyIntegrationScanner.scan());
