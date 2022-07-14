/* eslint-disable react-hooks/exhaustive-deps */
import { default as React, useEffect, useRef } from 'react'
import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header' 
import { getDocument } from './editorRequests' 
import { useSelector, useDispatch } from 'react-redux'

const EDITTOR_HOLDER_ID = 'editorjs'

function Editor (props) {

  /*  EditorJS gets initialized once our component is rendered. 
      So we use the useEffects and useRef React Hooks to initialize this 
      editor just once and destroy it once our component is destroyed.*/

  const ejInstance = useRef()
  const [editorData, setEditorData] = React.useState(undefined)
  let userId = useSelector(state => state.userData.id)
  let token = useSelector(state => state.userData.token)

  // This will run only once
  useEffect(() => {
    getDocument("62bf0e459341700d56da9878", token, userId, setEditorData)
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
        //let content = await this.editorjs.saver.save()
        console.log("attempting save")
        //setEditorData(content)
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