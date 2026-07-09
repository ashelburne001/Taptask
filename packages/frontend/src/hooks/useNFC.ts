import { useState, useCallback } from 'react'

export interface NFCTagData {
  type: 'bin' | 'item'
  code: string
  name?: string
  quantity?: number
  timestamp: number
}

interface UseNFCReturn {
  isSupported: boolean
  reading: boolean
  writing: boolean
  error: string | null
  readTag: () => Promise<NFCTagData | null>
  writeTag: (data: NFCTagData) => Promise<boolean>
  clearError: () => void
}

export function useNFC(): UseNFCReturn {
  const [reading, setReading] = useState(false)
  const [writing, setWriting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isSupported = 'NDEFReader' in window

  const readTag = useCallback(async (): Promise<NFCTagData | null> => {
    if (!isSupported) {
      setError('NFC is not supported on this device/browser')
      return null
    }

    setReading(true)
    setError(null)

    try {
      const reader = new (window as any).NDEFReader()
      await reader.scan()

      return new Promise((resolve) => {
        reader.onreading = (event: any) => {
          try {
            const { message } = event
            let data: NFCTagData | null = null

            for (const record of message.records) {
              if (record.recordType === 'text') {
                const text = new TextDecoder().decode(record.data)
                data = JSON.parse(text)
                break
              }
            }

            setReading(false)
            resolve(data)
          } catch (err) {
            setError('Failed to parse NFC tag data')
            setReading(false)
            resolve(null)
          }
        }
      })
    } catch (err: any) {
      setError(err.message || 'Failed to read NFC tag')
      setReading(false)
      return null
    }
  }, [isSupported])

  const writeTag = useCallback(
    async (data: NFCTagData): Promise<boolean> => {
      if (!isSupported) {
        setError('NFC is not supported on this device/browser')
        return false
      }

      setWriting(true)
      setError(null)

      try {
        const reader = new (window as any).NDEFReader()
        const encoder = new TextEncoder()

        const records = [
          {
            recordType: 'text',
            mediaType: 'text/plain',
            data: encoder.encode(JSON.stringify(data)),
          },
        ]

        await reader.write({ records })

        setWriting(false)
        return true
      } catch (err: any) {
        setError(err.message || 'Failed to write to NFC tag')
        setWriting(false)
        return false
      }
    },
    [isSupported]
  )

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    isSupported,
    reading,
    writing,
    error,
    readTag,
    writeTag,
    clearError,
  }
}
