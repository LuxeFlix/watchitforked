'use client'

type ConfirmModalProps = {
  open: boolean
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  confirmDisabled?: boolean
  onConfirm: () => void | Promise<void>
  onCancel: () => void
}

export default function ConfirmModal({
  open,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmDisabled = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 px-3 py-3 backdrop-blur-[2px] sm:items-center sm:px-4 sm:py-6">
      <div className="admin-panel w-full max-w-md p-4 sm:p-6">
        <h2 className="text-base font-semibold text-text-primary sm:text-lg">{title}</h2>
        {description ? (
          <p className="mt-2 text-sm leading-6 text-text-secondary">{description}</p>
        ) : null}

        <div className="mt-5 grid gap-2 sm:flex sm:items-center sm:justify-end sm:gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="admin-btn-secondary w-full px-4 py-2 sm:w-auto"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={confirmDisabled}
            className="admin-btn-danger w-full px-4 py-2 sm:w-auto"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}