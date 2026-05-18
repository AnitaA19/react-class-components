const CrashTester = (): never => {
  throw new Error("Manual crash triggered by test button.");
};

export default CrashTester;
