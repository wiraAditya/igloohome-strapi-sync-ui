import JSZip from 'jszip'

export const useDownload = () => {
  /**
   * Download a single JSON file.
   */
  const downloadJson = (filename: string, data: any) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  /**
   * Download multiple locales as a ZIP file.
   */
  const downloadZip = async (filenamePrefix: string, localeMap: Record<string, any>) => {
    const zip = new JSZip()
    
    for (const [locale, data] of Object.entries(localeMap)) {
      zip.file(`${locale}.json`, JSON.stringify(data, null, 2))
    }
    
    const content = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(content)
    const link = document.createElement('a')
    link.href = url
    link.download = `${filenamePrefix}.zip`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return {
    downloadJson,
    downloadZip
  }
}
