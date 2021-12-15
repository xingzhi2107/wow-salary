const errs: Record<number, string> = {};

export function registerModuleErrors(errConf: Record<number, string>) {
  Object.entries(errConf).forEach(([code, msg]) => {
    if (errs[code]) {
      throw new DieException(
        `[err] register duplicate business error, code: ${code}`,
      );
    } else {
      errs[code] = msg;
    }
  });
}

export class DieException extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

export class OPException extends Error {
  public readonly errcode: number;
  constructor(code: number, extMsg = '') {
    let errmsg = errs[code];
    if (extMsg) {
      errmsg = errmsg + ' ' + extMsg;
    }
    super(errmsg);
    this.errcode = code;
  }
}
