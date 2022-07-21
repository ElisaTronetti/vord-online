import { defineFileAction, ChonkyIconName } from 'chonky'

// Custom action used to capture the creation of a document from the toolbar
export const CreateDocument = defineFileAction({
    id: 'create_document',
    button: {
        name: 'Create document',
        toolbar: true,
        tooltip: 'Create a document',
        icon: ChonkyIconName.text
    },
})

// Custom action used to create the share document behavior only if a document is selected
export const ShareDocument =  defineFileAction({
    id: 'share_document',
    requiresSelection: true,
    fileFilter: file => file && !file.isDir,
    button: {
        name: 'Share document',
        toolbar: true,
        contextMenu: true,
        group: 'Actions',
        icon: ChonkyIconName.users,
    },
})