import React, { useState, useEffect } from 'react'
import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import SimpleImage from '@editorjs/simple-image'
import Checklist from '@editorjs/checklist'
import Quote from '@editorjs/quote'
import Delimiter from '@editorjs/delimiter'
import NestedList from '@editorjs/nested-list'
import Table from '@editorjs/table'
import CodeTool from '@editorjs/code'
import Underline from '@editorjs/underline'
import Marker from '@editorjs/marker'
import InlineCode from '@editorjs/inline-code'
import Paragraph from 'editorjs-paragraph-with-alignment'

import { getDocument, saveDocument } from './localDocumentEditorRequests'
import { getSharedDocument, saveSharedDocument } from './sharedDocumentEditorRequests'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

const EDITTOR_HOLDER_ID = 'editorjs'

function Editor() {
  const [editorData, setEditorData] = useState(undefined)
  let userId = useSelector(state => state.userData.id)
  let token = useSelector(state => state.userData.token)
  const document = useLocation().state.document

  if (editorData === undefined && document.isShared) {
    // Retrieve shared file
    getSharedDocument(document.id, userId, setEditorData)
  } else if (editorData === undefined && !document.isShared) {
    // Retrieve local file
    getDocument(document.id, token, userId, setEditorData)
  }
  useEffect(() => {
    if (editorData !== undefined) initEditor()
  }, [editorData])

  // Editor configuration
  const initEditor = () => {
    const editor = new EditorJS({
      holder: EDITTOR_HOLDER_ID,
      logLevel: "ERROR",
      onChange: async () => {
        let content = await editor.saver.save()
        // Logic to save this data to DB
        if (document.isShared) {
          // Save shared document
          saveSharedDocument(userId, document.id, content.blocks)
        } else {
          // Save local document
          saveDocument(userId, document.id, token, content.blocks)
        }
      },
      autofocus: true,
      tools: {
        header: {
          class: Header,
          inlineToolbar: true
        },
        paragraph: {
          class: Paragraph,
          inlineToolbar: true
        },
        list: {
          class: NestedList,
          inlineToolbar: true
        },
        image: SimpleImage,
        checklist: {
          class: Checklist,
          inlineToolbar: true
        },
        quote: {
          class: Quote,
          inlineToolbar: true
        },
        marker: {
          class: Marker,
          shortcut: 'CMD+SHIFT+M',
        },
        inlineCode: {
          class: InlineCode
        },
        delimiter: Delimiter,
        table: Table,
        code: CodeTool,
        underline: Underline,
      },
      defaultBlock: 'paragraph',
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