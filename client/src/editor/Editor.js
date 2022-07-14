/* eslint-disable react-hooks/exhaustive-deps */
import { default as React, useEffect, useRef } from 'react'
import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header' 
import { getDocument, saveDocument } from './editorRequests' 
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

const EDITTOR_HOLDER_ID = 'editorjs'

function Editor(props) {

  /*  EditorJS gets initialized once our component is rendered. 
      So we use the useEffects and useRef React Hooks to initialize this 
      editor just once and destroy it once our component is destroyed.*/

  const ejInstance = useRef()
  const [editorData, setEditorData] = React.useState(undefined)
  let userId = useSelector(state => state.userData.id)
  let token = useSelector(state => state.userData.token)
  const documentId = useLocation().state.documentId

  // This will run only once
  useEffect(() => {
    getDocument(documentId, token, userId, setEditorData)
    if (!ejInstance.current) {
      initEditor()
    }
    return () => {
      ejInstance.current.destroy()
      ejInstance.current = null
    }
  }, []);

  //  Editor configuration
  const initEditor = () => {
    const editor = new EditorJS({
      holder: EDITTOR_HOLDER_ID,
      logLevel: "ERROR",
      data: editorData,
      onReady: () => {
        ejInstance.current = editor;
      },
      
      onChange: async () => {
        let content = await editor.saver.save();
        // Put your logic here to save this data to your DB
        saveDocument(userId, documentId, token, content.blocks)
        //console.log("attempting save")
        
        setEditorData(content)
      },
      autofocus: true,
      tools: { 
        header: Header, 
      }, 
    });
  };

  return (
    <React.Fragment>
      <div id={EDITTOR_HOLDER_ID}> </div>
    </React.Fragment>
  );
}

export default Editor