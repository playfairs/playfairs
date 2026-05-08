if (typeof globalThis !== 'undefined') {
  interface ProcessPolyfill {
    env: {
      NODE_ENV: string;
      ENVIRONMENT: string;
    };
    stdout: {
      write: (message: string) => void;
    };
    stderr: {
      write: (message: string) => void;
    };
  }

  interface GlobalThisWithProcess {
    process?: ProcessPolyfill;
  }

  const g = globalThis as unknown as GlobalThisWithProcess;
  g.process = {
    env: {
      NODE_ENV: 'production',
      ENVIRONMENT: 'production',
    },
    stdout: {
      write: (message: string) => console.log(message),
    },
    stderr: {
      write: (message: string) => console.error(message),
    },
  };
}

export const polyfills = '/app/polyfills.js';
