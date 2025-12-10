import type React from "react";
import {
  useState,
} from "react";

import { Box } from "@chakra-ui/react";
import { program as defaultProgram } from "./savedCalcs";

import ExpressionTester from "./ExpressionTester";

import "./CalcTest.css";

export const CalcTest: React.FC = () => {
  const [program, setProgram] = useState(defaultProgram);

  return (
    <div className="calc-container">
      <div className="calc-root">
        <div className="calc-left">
          <div className="calc-toolbar">
            <h2 className="calc-title">Editors</h2>
            <Box border="1px" borderColor="gray.300" borderRadius="md" padding="4" marginTop="4">
              <pre>{JSON.stringify(program.steps, null, 2)}</pre>
            </Box>
          </div>
        </div>

        <div className="calc-right">
          {/* <MathFieldTest /> */}
          <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
            <h2>MathJSON Field Demo</h2>
            <ExpressionTester program={program} setProgram={setProgram} />
          </div>
          <div className="calc-toolbar">
            <h2 className="calc-title">Live Result</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalcTest;
