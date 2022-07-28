import { default as React, useEffect } from 'react'
import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import Link from '@editorjs/link'
import SimpleImage from '@editorjs/simple-image'
import Checklist from '@editorjs/checklist'
import Quote from '@editorjs/quote'

import { getDocument, saveDocument } from './editorRequests'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

const EDITTOR_HOLDER_ID = 'editorjs'

function Editor() {
  const [editorData, setEditorData] = React.useState(undefined)
  let userId = useSelector(state => state.userData.id)
  let token = useSelector(state => state.userData.token)
  const documentId = useLocation().state.documentId

  if (editorData === undefined) getDocument(documentId, token, userId, setEditorData)
  useEffect(() => {
    if (editorData !== undefined) initEditor()
  }, [editorData])

  // Editor configuration
  const initEditor = () => {
    const editor = new EditorJS({
      holder: EDITTOR_HOLDER_ID,
      logLevel: "ERROR",
      onChange: async () => {
        let content = await editor.saver.save();
        console.log(content)
        // Logic to save this data to DB
        saveDocument(userId, documentId, token, content.blocks)
      },
      autofocus: true,
      tools: {
        header: {
          class: Header,
          inlineToolbar: true
        },
        list: {
          class: List,
          inlineToolbar: true
        },
        link: {
          class: Link,
          inlineToolbar: true
        },
        image: {
          class: SimpleImage,
          inlineToolbar: true
        },
        checklist: {
          class: Checklist,
          inlineToolbar: true
        },
        quote: {
          class: Quote,
          inlineToolbar: true
        }
      }
    })

    editor.isReady
      .then(() => {
        if (editorData.blocks.length) {
          // If there is data to render, call render 
          editor.render(editorData)
        }
      })
      .catch((reason) => {
        console.log(`Editor.js initialization failed because of ${reason}`)
      })
  }

  return (
    <React.Fragment>
      <div id={EDITTOR_HOLDER_ID}> </div>
    </React.Fragment>
  )
}

export default Editor