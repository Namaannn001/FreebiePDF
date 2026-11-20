self.onmessage = async ({ data }) => {
  const { bytes, password, text, encrypt } = data;
  // qpdf interprets @ and - prefixes in positional password arguments.
  if (encrypt && /^[@-]/.test(text)) {
    self.postMessage({ error: 'The new password cannot start with @ or -.' });
    return;
  }
  const messages = [];
  const { log, warn, error: consoleError } = console;
  const capture = (...values) => messages.push(values.join(' '));
  try {
    // The runtime binds its console writers during initialization.
    console.log = console.warn = console.error = capture;
    importScripts('./qpdf.js');
    const runtime = await self.Module({
      noInitialRun: true,
      locateFile: () => new URL('qpdf.wasm', self.location.href).href,
      print: value => messages.push(value),
      printErr: value => messages.push(value),
    });
    runtime.FS.writeFile('/input.pdf', new Uint8Array(bytes));
    const args = [];
    const passwordFile = password && !/[\r\n]/.test(password);
    if (passwordFile) {
      runtime.FS.writeFile('/password.txt', password + '\n');
      args.push('--password-file=/password.txt');
    } else if (password) args.push('--password=' + password);
    args.push('/input.pdf');
    if (encrypt) {
      const owner = Array.from(crypto.getRandomValues(new Uint8Array(24)), byte =>
        byte.toString(16).padStart(2, '0'),
      ).join('');
      args.push('--encrypt', text, owner, '256', '--');
    } else args.push('--decrypt');
    args.push('/output.pdf');
    const status = runtime.callMain(args);
    if (passwordFile) runtime.FS.unlink('/password.txt');
    // Exit status 3 means qpdf produced output with warnings.
    if (status !== 0 && status !== 3) throw new Error('qpdf failed');
    const output = runtime.FS.readFile('/output.pdf');
    self.postMessage({ output }, [output.buffer]);
  } catch (error) {
    self.postMessage({
      error: messages.some(line => /invalid password|incorrect password/i.test(line))
        ? password
          ? 'Incorrect PDF password.'
          : 'This PDF is password protected. Enter its password.'
        : 'The browser could not process this PDF’s encryption.',
    });
  } finally {
    console.log = log;
    console.warn = warn;
    console.error = consoleError;
  }
};
