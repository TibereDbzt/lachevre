import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'
import { Tournament } from '@/entities/Tournament'

const STORAGE_KEY = 'lachevre-tournament'

export const useTournamentStore = defineStore('tournament', () => {
  const tournamentOrNull = ref<Tournament | null>(null)

  const tournament = computed(() => {
    if (!tournamentOrNull.value) throw new Error('Tournament not initialized.')
    return tournamentOrNull.value
  })

  const addPlayer = (playerName: string) => {
    tournament.value.addPlayer(playerName)
  }

  const removePlayer = (playerName: string) => {
    tournament.value.removePlayer(playerName)
  }

  const start = () => {
    tournament.value.start()
  }

  const toNextRound = () => {
    tournament.value.toNextRound()
  }

  const deleteRound = () => {
        tournament.value.deleteRound()
  }

  // Gestion de la persistance
  const saveTournament = () => {
    try {
      const tournamentJSON = tournament.value.toJSON()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tournamentJSON))
      console.log('Tournoi sauvegardé avec succès')
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du tournoi:', error)
    }
  }

  const loadTournament = (): void => {
    try {
        console.log('Chargement du tournoi...')
      const savedTournament = localStorage.getItem(STORAGE_KEY)
      if (savedTournament) {
        const tournamentJSON = JSON.parse(savedTournament)
        const loadedTournament = Tournament.fromJSON(tournamentJSON)
        
        tournamentOrNull.value = loadedTournament
      } else {
        tournamentOrNull.value = new Tournament()
      }
      console.log('Tournoi chargé avec succès')
    } catch (error) {
      console.error('Erreur lors du chargement du tournoi:', error)
    }
  }

  const clearTournament = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      tournamentOrNull.value = new Tournament()
      console.log('Tournoi supprimé avec succès')
    } catch (error) {
      console.error('Erreur lors de la suppression du tournoi:', error)
    }
  }

  const startAutoSave = () => {
    watch(
      tournamentOrNull,
      () => {
        saveTournament()
      },
      { deep: true, flush: 'post' }
    )
  }

  return {
    // État
    tournament,
    
    // Actions sur l'entité
    addPlayer,
    removePlayer,
    start,
    toNextRound,
    deleteRound,
    
    // Actions de persistance
    saveTournament,
    loadTournament,
    clearTournament,
    startAutoSave
  }
})
