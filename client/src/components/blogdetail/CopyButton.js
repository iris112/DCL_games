import React, { useEffect, useState } from "react";
import { Button } from "semantic-ui-react";

const CopyButton = ({ data = "" }) => {
  const [value, setValue] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setValue(data);
  }, [data]);

  if (typeof window === "undefined") {
    return null;
  }

  const onCopy = () => {
    const textArea = document.createElement("textarea");
    textArea.value = value;

    document.body.appendChild(textArea);

    textArea.select();
    document.execCommand("copy");

    document.body.removeChild(textArea);
    setCopied(true);
  };

  if (copied) {
    return <Button id="copy-button" content="copied" icon="copy" labelPosition="left" onClick={onCopy} />;
  }
  return <Button id="copy-button" content="copy code" icon="copy" labelPosition="left" onClick={onCopy} />;
};

export default CopyButton;
