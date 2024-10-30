import { defineStore } from 'pinia'
import axios from 'axios'

interface Process {
  id: string
  name: string
  description: string
  xml: string
  createdAt?: string
  updatedAt?: string
}

interface ProcessState {
  processes: Process[]
  loading: boolean
  error: string | null
}

export const useProcessStore = defineStore('process', {
  state: (): ProcessState => ({
    processes: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchProcesses() {
      this.loading = true
      try {
        const response = await axios.get('/api/processes')
        this.processes = response.data
      } catch (error) {
        console.error('Failed to fetch processes:', error)
        this.error = 'Failed to load processes'
      } finally {
        this.loading = false
      }
    },

    async saveProcess(processData: Partial<Process>) {
      try {
        if (processData.id) {
          const response = await axios.put(`/api/processes/${processData.id}`, processData)
          const index = this.processes.findIndex(p => p.id === processData.id)
          if (index !== -1) {
            this.processes[index] = response.data
          }
        } else {
          const response = await axios.post('/api/processes', processData)
          this.processes.push(response.data)
        }
        return true
      } catch (error) {
        console.error('Failed to save process:', error)
        throw error
      }
    },

    async deleteProcess(id: string) {
      try {
        await axios.delete(`/api/processes/${id}`)
        this.processes = this.processes.filter(p => p.id !== id)
        return true
      } catch (error) {
        console.error('Failed to delete process:', error)
        throw error
      }
    }
  }
})