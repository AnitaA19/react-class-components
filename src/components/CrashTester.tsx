import { Component } from "react";

class CrashTester extends Component {
  render(): never {
    throw new Error("Manual crash triggered by test button.");
  }
}

export default CrashTester;
