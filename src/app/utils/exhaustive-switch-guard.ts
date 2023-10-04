export const exhaustiveSwitchGuard = (value: never): never => {
  throw new Error(`Unreachable case executed with value: ${value}`);
};
