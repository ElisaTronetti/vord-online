import React, { useState, useEffect, useContext } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
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
import { SocketContext } from '../util/socketContext'
import { documentLockLeave } from '../util/resourcesLock'

import './Editor.css'

const EDITTOR_HOLDER_ID = 'editorjs'

function Editor() {
  const [editorData, setEditorData] = useState(undefined)
  const user = {
    id: useSelector(state => state.userData.id),
    token: useSelector(state => state.userData.token)
  }
  const document = useLocation().state.document
  const socket = useContext(SocketContext)

  if (editorData === undefined && document.isShared) {
    // Retrieve shared file
    getSharedDocument(document.id, user.id, setEditorData)
  } else if (editorData === undefined && !document.isShared) {
    // Retrieve local file
    getDocument(document.id, user, setEditorData)
  }
  useEffect(() => {
    if (editorData !== undefined) initEditor()
  }, [editorData])

  // Editor closing effect
  useEffect(() => {
    return () => {
      // Unlock document resource on editor closing
      if (document.isShared) documentLockLeave(socket, document.id)
    }
  }, [document, socket])

  // Editor configuration
  const initEditor = () => {
    const editor = new EditorJS({
      holder: EDITTOR_HOLDER_ID,
      logLevel: "ERROR",
      readOnly: document.role === 1,
      onChange: async () => {
        let content = await editor.saver.save()
        // Logic to save this data to DB
        if (document.isShared) {
          // Save shared document
          saveSharedDocument(user.id, document.id, content.blocks)
        } else {
          // Save local document
          saveDocument(user, document.id, content.blocks)
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
    <div className='editor-component'>
      <div className='editor-container'>
        <div className='editor-page'>
          <div id={EDITTOR_HOLDER_ID} className='editor'> </div>
        </div>
      </div>
    </div>

  )
}

export default Editor