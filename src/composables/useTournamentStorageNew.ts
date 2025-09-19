import { watch, type Ref } from 'vue'
import { Tournament } from '@/entities/Tournament'

const STORAGE_KEY = 'lachevre-tournament'

export function useTournamentStorage(tournament: Ref<Tournament>): {
    saveTournament: () => void
    loadTournament: () => Tournament | null
    clearTournament: () => void
    startAutoSave: () => void
} {
    // Sauvegarder le tournoi dans localStorage
    const saveTournament = () => {
        try {
            // Utilise la méthode toJSON() du Tournament pour sérialiser automatiquement
            const tournamentData = tournament.value.toJSON()
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tournamentData))
            console.log('Tournoi sauvegardé avec succès')
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du tournoi:', error)
        }
    }

    // Charger le tournoi depuis localStorage
    const loadTournament = (): Tournament | null => {
        try {
            const savedData = localStorage.getItem(STORAGE_KEY)
            if (!savedData) return null

            const tournamentData = JSON.parse(savedData)
            
            // Utilise la méthode fromJSON() du Tournament pour restaurer automatiquement
            // toutes les instances de classe avec leurs méthodes
            const loadedTournament = Tournament.fromJSON(tournamentData)
            console.log('Tournoi chargé avec succès')
            return loadedTournament
        } catch (error) {
            console.error('Erreur lors du chargement du tournoi:', error)
            return new Tournament()
        }
    }

    // Effacer la sauvegarde
    const clearTournament = () => {
        try {
            localStorage.removeItem(STORAGE_KEY)
            console.log('Sauvegarde supprimée avec succès')
        } catch (error) {
            console.error('Erreur lors de la suppression du tournoi:', error)
        }
    }

    // Surveiller les changements et sauvegarder automatiquement
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
