import { unixfs } from "@helia/unixfs";
import { createHelia } from "helia";
import React, { useState, useRef } from "react";

function Ipfs() {
  const [output, setOutput] = useState([]);
  const [helia, setHelia] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [fileName, setFileName] = useState("");
  const terminalEl = useRef(null);

  const COLORS = {
    active: "#357edd",
    success: "#0cb892",
    error: "#ea5037",
  };

  const showStatus = (text, color, id) => {
    setOutput((prev) => {
      return [
        ...prev,
        {
          content: text,
          color,
          id,
        },
      ];
    });

    terminalEl.current.scroll({
      top: window.terminal.scrollHeight,
      behavior: "smooth",
    });
  };

  const store = async (name, content) => {
    let node = helia;

    if (!helia) {
      showStatus("Creating Helia node...", COLORS.active);

      node = await createHelia();

      setHelia(node);
    }

    showStatus(
      `Connecting to ${node.libp2p.peerId}...`,
      COLORS.active,
      node.libp2p.peerId
    );

    const encoder = new TextEncoder();

    const fileToAdd = {
      path: `${name}`,
      content: encoder.encode(content),
    };

    const fs = unixfs(node);

    showStatus(`Adding file ${fileToAdd.path}...`, COLORS.active);
    const cid = await fs.addFile(fileToAdd, node.blockstore);

    showStatus(`Added to ${cid}`, COLORS.success, cid);

    if (isImage(name)) {
      showImagePreview(content);
    }
  };

  const showImagePreview = (content) => {
    const blob = new Blob([content], { type: "image/jpeg" });
    const imageUrl = URL.createObjectURL(blob);

    setFileContent(imageUrl);
  };

  const isImage = (name) => {
    return name.match(/\.(jpeg|jpg|gif|png)$/) != null;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target.result;
        setFileContent(content);
        setFileName(file.name);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (fileName == null || fileName.trim() === "") {
        throw new Error("File name is missing...");
      }

      if (fileContent == null) {
        throw new Error("File content is missing...");
      }

      await store(fileName, fileContent);
    } catch (err) {
      showStatus(err.message, COLORS.error);
    }
  };

  return (
    <>
      <header className="flex items-center pa3 bg-navy">
        <a href="https://github.com/ipfs/helia" title="home">
          <img
            alt="Helia logo"
            src="https://unpkg.com/@helia/css@1.0.1/logos/outlined/helia-wordmark.svg"
            style={{ height: 60 }}
            className="v-top"
          />
        </a>
      </header>

      <main className="pa4-l bg-snow mw7 mv5 center pa4">
        <h1 className="pa0 f2 ma0 mb4 navy tc">Add data to Helia</h1>

        <form id="upload-file" onSubmit={handleSubmit}>
          <label htmlFor="file" className="f5 ma0 pb2 navy fw4 db">
            Upload Image
          </label>
          <input
            className="input-reset bn black-80 bg-white pa3 w-100 mb3"
            id="file"
            name="file"
            type="file"
            accept="image/*" // Accept only image files
            onChange={handleFileChange}
          />

          <button
            className="button-reset pv3 tc bn bg-animate bg-black-80 hover-bg-aqua white pointer w-100"
            id="upload-submit"
            type="submit"
          >
            Upload Image
          </button>
        </form>
        {/* Display uploaded image */}
        {fileContent && (
          <div className="uploaded-image">
            <img src={fileContent} alt="Uploaded" />
          </div>
        )}

        <h3>Output</h3>

        <div className="window">
          <div className="header"></div>
          <div id="terminal" className="terminal" ref={terminalEl}>
            {output.length > 0 && (
              <div id="output">
                {output.map((log, index) => (
                  <p key={index} style={{ color: log.color }} id={log.id}>
                    {log.content}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default Ipfs;
