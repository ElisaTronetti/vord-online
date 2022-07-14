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