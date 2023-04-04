import React, { useEffect, useState } from "react";
import { TextareaAutosize } from "@mui/material";
import { useDispatch } from "react-redux";
import { SetModifiedText } from "../reducers/correctionTable/CorrectionTableActions";

const SuggestionContent = ({ paragraphs, selectedNaratives, parasContent }) => {
  const dispatch = useDispatch();
  const [modifiedOutput, setModifiedOutput] = useState("");

  let output = "";
  let wordsIndices = [];
  let wordStartIndex = 0;
  let wordEndIndex = 0;
  for (let i = 0; i < parasContent.length; i++) {
    let paragraph = parasContent[i].endsWith(" ")
      ? parasContent[i]
      : parasContent[i] + " ";
    let offset = 0;
    for (let j = 0; j < paragraphs.length; j++) {
      let para = paragraphs[j];
      if (
        para.ParagraphNum === i + 1 &&
        selectedNaratives.includes(para.id) &&
        para.FrontendAction.includes("Replace")
      ) {
        let suggestion = para.suggestion;

        if (Array.isArray(suggestion)) {
          suggestion = suggestion.join("");
          suggestion = suggestion.split("/")[0];
        } else {
          suggestion = suggestion.split("/")[0];
        }
        let start = para.StartPos + offset;
        let end = para.EndPos + offset;
        paragraph =
          paragraph.slice(0, start) + suggestion + paragraph.slice(end);
        offset += suggestion.length - (para.EndPos - para.StartPos);
        wordStartIndex = output.length + start;
        wordEndIndex = output.length + start + suggestion.trim().length - 1;
        wordsIndices.push({ start: wordStartIndex, end: wordEndIndex });
      }
    }
    output += paragraph;
  }

  const onModifiedOutputChange = (e) => {
    setModifiedOutput(e.target.value);
    dispatch(SetModifiedText(e.target.value));
  };
  useEffect(() => {
    setModifiedOutput(output);
    dispatch(SetModifiedText(output));
  }, [output]);
  return (
    <div className="max-h-96 overflow-auto">
      <TextareaAutosize
        value={modifiedOutput}
        onChange={onModifiedOutputChange}
        style={{ width: "100%" }}
      />{" "}
    </div>
  );
};

export default SuggestionContent;
