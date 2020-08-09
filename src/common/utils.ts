export const areEqualObjects = (first: {[key: string]: any},
																second: {[key: string]: any}): boolean => {
	for (const key in first) {
		if (first[key] !== second[key]) {
			return false;
		}
	}

	return true;
}

export const areEqualArrays = (first: Array<any>, second: Array<any>): boolean => {
  if (first === second) {
		return true;
	}

	if (first === null || second === null ||
		  first.length !== second.length) {
		return false;
	}

  for (let i = 0; i < first.length; i++) {
    if (!areEqualObjects(first[i], second[i])) {
			return false;
		}
  }

	return true;
}

export const debounce = (callback: Function, ms: number): Function => {
  let timeout: number | undefined;

  function wrapped(this: typeof wrapped) {
    if (timeout !== undefined) {
      return;
    }

		callback.apply(this, arguments);

    timeout = window.setTimeout(() => {
      timeout = undefined;
    }, ms)
  }

  return wrapped;
}

export const throttle = (callback: Function, ms: number): Function => {
  let timeout: number | undefined;
  let nextArgs: IArguments | undefined;
  let nextContext: typeof wrapped | undefined;

  function wrapped(this: typeof wrapped) {
    if (timeout !== undefined) {
      nextArgs = arguments;
      nextContext = this;

      return;
    }

		callback.apply(this, arguments);

    timeout = window.setTimeout(() => {
      timeout = undefined;
      if (nextArgs && nextContext) {
        callback.apply(nextContext, nextArgs);
        nextArgs = undefined;
        nextContext = undefined;
      }
    }, ms)
  }

  return wrapped;
}