import { useState, useCallback } from 'react'

export default function usePipeline() {
  const [steps, setSteps] = useState([])

  const addStep = useCallback((toolId, label, result) => {
    setSteps(prev => [...prev, { toolId, label, result, timestamp: Date.now() }])
  }, [])

  const removeStep = useCallback((index) => {
    setSteps(prev => prev.filter((_, i) => i !== index))
  }, [])

  const clearPipeline = useCallback(() => {
    setSteps([])
  }, [])

  return { steps, addStep, removeStep, clearPipeline }
}
