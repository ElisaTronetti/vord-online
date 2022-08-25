import { toast } from 'react-toastify'

const toastConfiguration = {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'colored'
}

export const createSuccessToast = (message) => {
    toast.success(message, toastConfiguration);
}

export const createErrorToast = (message) => {
    toast.error(message, toastConfiguration);
}

export const createWarningToast = (message) => {
    toast.warn(message, toastConfiguration);
}