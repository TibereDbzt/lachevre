import { watch, type Ref } from 'vue'
import { Tournament } from '@/entities/Tournament'

const STORAGE_KEY = 'lachevre-tournament'

export function useTournamentStorage(tournament: Ref<Tournament>): {
    saveTournament: () => void
    loadTournament: () => Tournament | null
    clearTournament: () => void
    startAutoSave: () => void
} {
    const saveTournament = () => {
        try {
            const tournamentJSON = tournament.value.toJSON()
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tournamentJSON))
            console.log('Tournoi sauvegardé avec succès')
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du tournoi:', error)
        }
    }

    const loadTournament = (): Tournament | null => {
        try {
            const savedTournament = localStorage.getItem(STORAGE_KEY)
            if (!savedTournament) return null

            const tournamentJSON = JSON.parse(savedTournament)
            
            const loadedTournament = Tournament.fromJSON(tournamentJSON)
            console.log('Tournoi chargé avec succès')
            return loadedTournament
        } catch (error) {
            console.error('Erreur lors du chargement du tournoi:', error)
            return new Tournament()
        }
    }

    const clearTournament = () => {
        try {
            localStorage.removeItem(STORAGE_KEY)
            console.log('Sauvegarde supprimée avec succès')
        } catch (error) {
            console.error('Erreur lors de la suppression du tournoi:', error)
        }
    }

    const startAutoSave = () => {
        watch(
            tournament,
            () => {
                saveTournament()
            },
            { deep: true, flush: 'post' }
        )
    }

    return {
        saveTournament,
        loadTournament,
        clearTournament,
        startAutoSave
    }
}
