import type React from "react";
import { useMemo, useState } from "react";
import Editor from "@monaco-editor/react";

import { program as defaultProgram } from "./savedCalcs";

import { calcValidate, calcRun } from "../lib/calc";
import type { CalcProgram, ProgramOutput } from "../lib/calc";
import ProgramEditor from "./ProgramEditor";
import OutputVisualizer from "./OutputVisualizer";

import ExpressionTester from "./ExpressionTester";

import "./CalcTest.css";

export const CalcTest: React.FC = () => {
  const [programText, setProgramText] = useState<string>(() =>
    JSON.stringify(defaultProgram, null, 2)
  );
  // editor-managed input values (name -> number|boolean)
  const [values, setValues] = useState<Record<string, number | boolean>>(() => {
    const m: Record<string, number | boolean> = {};
    for (const inp of defaultProgram.inputs) m[inp.name] = inp.default as any;
    return m;
  });

  const programParsed = useMemo<CalcProgram | null>(() => {
    try {
      return JSON.parse(programText) as CalcProgram;
    } catch {
      return null;
    }
  }, [programText]);

  const calcProgramValidation = useMemo<any>(() => {
    if (!programParsed) return { ok: false, error: { message: "Program JSON parse error: Invalid program" } };
    return calcValidate(programParsed);
  }, [programText]);

  const calcOutputs = useMemo<ProgramOutput[] | null>(() => {
    if (!calcProgramValidation.ok || !programParsed) return null;
    // create a program copy whose inputs.defaults are overridden by editor values
    const patched: CalcProgram = {
      ...programParsed,
      inputs: programParsed.inputs.map((inp) => ({ ...inp, default: (values[inp.name] ?? inp.default) as any })),
    };
    return calcRun(patched as CalcProgram);
  }, [programParsed, values, calcProgramValidation.ok]);

  const handleFormatProgram = () => {
    if (!programParsed) return;
    setProgramText(JSON.stringify(programParsed, null, 2));
  };

  const handleResetProgram = () =>
    setProgramText(JSON.stringify(defaultProgram, null, 2));

  return (
    <div className="calc-container">
      <div className="calc-root">
        <div className="calc-left">
          <div className="calc-toolbar">
            <h2 className="calc-title">Editors</h2>
          </div>

          <div className="calc-section">
            <h3 className="calc-section-title">Inputs</h3>
            <ProgramEditor program={programParsed ?? defaultProgram} values={values} onChange={setValues} />
          </div>

          <div className="calc-section">
            <div className="calc-section-header">
              <h3 className="calc-section-title">Program</h3>
              <div className="calc-actions">
                <button className="btn" onClick={handleFormatProgram} disabled={!programParsed}>
                  Format
                </button>
                <button className="btn" onClick={handleResetProgram}>
                  Reset
                </button>
              </div>
            </div>
            <Editor
              height="80vh"
              defaultLanguage="json"
              value={programText}
              onChange={(v) => setProgramText(v ?? "")}
              options={{
                minimap: { enabled: false },
                wordWrap: "on",
                tabSize: 2,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                fontSize: 13,
              }}
              theme="vs"
            />
            <div className={`hint ${calcProgramValidation.ok ? "error" : "ok"}`}>
              {calcProgramValidation.error ? `Program error: ${calcProgramValidation.error?.message ?? "unknown error"}` : "Program OK"}
            </div>
          </div>
        </div>

        <div className="calc-right">
          {/* <MathFieldTest /> */}
          <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
            <h2>MathJSON Field Demo</h2>
            <ExpressionTester />
          </div>
          <div className="calc-toolbar">
            <h2 className="calc-title">Live Result</h2>
          </div>

          <div className="calc-section">
            <h3 className="calc-section-title">Calculation Result</h3>
            <OutputVisualizer outputs={calcOutputs} suppressZeroes />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalcTest;
