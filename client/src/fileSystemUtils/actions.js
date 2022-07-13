import { defineFileAction, ChonkyIconName } from 'chonky'

export const CreateDocument = defineFileAction({
    id: 'create_document',
    button: {
        name: 'Create document',
        toolbar: true,
        tooltip: 'Create a document',
        icon: ChonkyIconName.text
    },
})