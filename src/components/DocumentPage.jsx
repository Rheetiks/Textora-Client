import React, { useEffect, useState, useRef } from "react";
import { useParams, Navigate } from "react-router-dom";
import { EditorContent } from "@tiptap/react";
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import * as Y from "yjs";
import { UndoManager } from "yjs";
import YPartyKitProvider from "y-partykit/provider";
import { faker } from "@faker-js/faker";
import MenuBar from "./MenuBar";
import ConnectedUsers from "./ConnectedUsers";
import Loader from "./Loader";
import "./styles.scss";
import randomColor from "randomcolor";
import { Link } from "react-router-dom";

const DocumentPage = () => {
  const { docId } = useParams();
  const [showMenu, setShowMenu] = useState(false);

  const PARTYKIT_URL = import.meta.env.VITE_PARTYKIT_HOST || "http://localhost:8080";

  const [editor, setEditor] = useState(null);
  const [username, setUsername] = useState(faker.internet.username());
  const [color] = useState(randomColor());
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [isDocNotFound, setIsDocNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copyButtonText, setCopyButtonText] = useState("Share");

  const providerRef = useRef(null);
  const yDocRef = useRef(new Y.Doc());

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopyButtonText("Copied!");
      setTimeout(() => setCopyButtonText("Share"), 2000);
    }).catch(err => console.error("Failed to copy URL: ", err));
  };

  const handleToggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleUsernameChange = (e) => {
    if (e.target.value.length <= 20) setUsername(e.target.value);
  };

  useEffect(() => {
    if (!docId) return;
    const wsProvider = new YPartyKitProvider(PARTYKIT_URL, docId, yDocRef.current, {
      maxReconnects: 1,
      reconnectDelay: 100000000,
      connect: false
    });
    let retryCount = 0;
    const MAX_RETRIES = 1;

    function attemptConnection() {
      if (retryCount < MAX_RETRIES) {
        wsProvider.once();
        wsProvider.connect();
        retryCount++;
        wsProvider.on("connection-error", () => {
          console.error(`Connection attempt ${retryCount} failed.`);
          setTimeout(attemptConnection, 2000 * retryCount);
        });
      } else {
        console.error("Max retries reached.  Connection failed permanently.");
        wsProvider.disconnect()
        wsProvider.destroy()
        wsProvider.disconnectBc()
        wsProvider.shouldConnect = false;
        wsProvider.off();
        wsProvider._WS = undefined;
        wsProvider.ws = null;
      }
    }
    attemptConnection();

    providerRef.current = wsProvider;

    const initializeEditor = () => {
      const editorInstance = new Editor({
        extensions: [
          StarterKit.configure({
            history: false,
            orderedList: false,
            blockquote: false,
            horizontalRule: false
          }),
          Underline,
          Collaboration.configure({ document: yDocRef.current }),
          CollaborationCaret.configure({
            provider: wsProvider,
            user: { name: username, color },
            render: (user) => {
              const cursor = document.createElement("span");
              cursor.classList.add("collaboration-cursor__caret");
              cursor.setAttribute("style", `border-color: ${user.color}`);
              const label = document.createElement("div");
              label.classList.add("collaboration-cursor__label");
              label.setAttribute("style", `background-color: ${user.color}`);
              label.insertBefore(document.createTextNode(user.name), null);
              cursor.insertBefore(label, null);
              return cursor;
            }
          })
        ],

      });

      setEditor(editorInstance);
      new UndoManager(yDocRef.current.get("default"));
      setLoading(false);
    };

    wsProvider.on("status", (event) => {
      setConnectionStatus(event.status);
      if (event.status === "connected" && !editor) {
        initializeEditor();
      }
    });

    const handleAwarenessChange = () => {
      if (wsProvider.awareness) {
        const states = Array.from(wsProvider.awareness.getStates().values());
        const users = states.map((state) => state.user).filter(Boolean);
        setConnectedUsers(users);
      }
    };

    wsProvider.awareness.on("change", handleAwarenessChange);
    wsProvider.awareness.setLocalStateField("user", { name: username, color });

    wsProvider.on("connection-error", () => {
      wsProvider.destroy();
      providerRef.current = null;
      setIsDocNotFound(true);
      setLoading(false);
    });

    return () => {
      providerRef.current?.destroy();
      editor?.destroy();
    };
  }, [docId]);

  useEffect(() => {
    if (providerRef.current && editor) {
      providerRef.current.awareness.setLocalStateField("user", { name: username, color });
      const caretExtension = editor.extensionManager.extensions.find(e => e.name === "collaborationCaret");
      if (caretExtension) caretExtension.options.user = { name: username, color };
    }
  }, [username, color, editor]);

  if (loading) return <Loader message="Connecting to document..." />;

  if (isDocNotFound) return <Navigate to="/document-not-found" replace />;

  if (!editor) return <Loader message="Initializing editor..." />;

  return (
    <>
      <div className="document-container">
        <header className="page-header">
          <Link to="/" className="logo-link">
            <div className="logo">Textora</div>
          </Link>
          <button className="toggle-button" onClick={handleToggleMenu}>
            {showMenu ? "Close" : "Menu"}
          </button>

          <div className={`header-right ${showMenu ? 'is-visible' : ''}`}>
            <div className="user-info">
              <input
                id="username"
                value={username}
                onChange={handleUsernameChange}
                maxLength="20"
                placeholder="Your Name"
              />
            </div>
            <ConnectedUsers users={connectedUsers} />
            <div className={`connection-status ${connectionStatus}`}>
              <span className="status-dot"></span>
              <span className="status-text">{connectionStatus}</span>
            </div>
            <button className="share-button" onClick={handleShare}>{copyButtonText}</button>
          </div>
        </header>


        <div className="editor-wrapper">
          <MenuBar editor={editor} />
          <EditorContent editor={editor} className="ProseMirror-wrapper" />
        </div>
      </div>
      <footer className="page-footer">Textora © 2025</footer>
    </>
  );
};

export default DocumentPage;
