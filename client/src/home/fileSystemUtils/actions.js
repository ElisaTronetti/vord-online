import { defineFileAction, ChonkyIconName } from 'chonky'

// Custom action used to capture the creation of a folder
export const CreateFolder = defineFileAction({
    id: 'create_folder',
    button: {
        name: 'Create folder',
        contextMenu: true,
        toolbar: true,
        tooltip: 'Create a folder',
        group: 'Create',
        icon: ChonkyIconName.folderCreate,
    },
})

// Custom action used to capture the creation of a document
export const CreateDocument = defineFileAction({
    id: 'create_document',
    button: {
        name: 'Create document',
        contextMenu: true,
        toolbar: true,
        tooltip: 'Create document',
        group: 'Create',
        icon: ChonkyIconName.text,
    },
})

// Custom action used to copy documents
export const CopyDocument = defineFileAction({
    id: 'copy_document',
    requiresSelection: true,
    fileFilter: file => file && !file.isDir && !file.isShared,
    hotkeys: ['ctrl+c'],
    button: {
        name: 'Copy selection',
        toolbar: true,
        contextMenu: true,
        group: 'Actions',
        icon: ChonkyIconName.copy,
    },
})

// Custom action used to create the share document behavior only if a document is selected
export const ShareDocument = defineFileAction({
    id: 'share_document',
    requiresSelection: true,
    fileFilter: file => (file && !file.isDir) && (!file.isShared || (file.isShared && file.role === 3)) ,
    button: {
        name: 'Share document',
        toolbar: true,
        contextMenu: true,
        group: 'Actions',
        icon: ChonkyIconName.users,
    },
})

// Custom action used to manage the shared group of a document
export const ManageSharedGroup = defineFileAction({
    id: 'manage_shared_group',
    requiresSelection: true,
    fileFilter: file => file && !file.isDir && file.isShared,
    button: {
        name: 'Manage shared group',
        toolbar: true,
        contextMenu: true,
        group: 'Actions',
        icon: ChonkyIconName.config,
    },
})

// Custom action used to rename an element in the file system
export const RenameElement =  defineFileAction({
    id: 'rename_element',
    requiresSelection: true,
    button: {
        name: 'Rename',
        toolbar: true,
        contextMenu: true,
        group: 'Actions',
        icon: ChonkyIconName.terminal,
    },
})