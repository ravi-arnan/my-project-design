import data from '@/../product/sections/question-bank-and-import/data.json'
import { ImportModal } from './components/ImportModal'

export default function ImportModalPreview() {
  return (
    <div className="h-full flex items-center justify-center bg-slate-100 dark:bg-slate-950">
      <ImportModal
        importSession={data.importSession as any}
        onUploadFile={(file) => console.log('Upload file:', file)}
        onFixImportRow={(row, updates) => console.log('Fix row:', row, updates)}
        onReUploadFile={(file) => console.log('Re-upload:', file)}
        onConfirmImport={(id) => console.log('Confirm import:', id)}
        onCancelImport={(id) => console.log('Cancel import:', id)}
      />
    </div>
  )
}
