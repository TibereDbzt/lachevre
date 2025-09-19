<template>
    <div v-if="tournament" class="min-h-screen pl-8 pr-8 pt-18 pb-24 flex flex-col gap-6">
        <div class="fixed top-0 left-0 w-full pl-8 pr-8 pt-2 z-50 pointer-events-none">
            <div class="w-50 ml-auto flex justify-between pl-4 pt-1 pr-1 pb-1 flex items-center gap-2 bg-secondary rounded-lg border pointer-events-auto">
                <EditableText v-model="tournament.name" class="text-l font-bold" />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <Menu :size="16" :stroke-width="0.75" absoluteStrokeWidth />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent :align="'end'" :alignOffset="-5" class="mt-2">
                        <DropdownMenuGroup>
                            <DropdownMenuItem @click="clearAndRestart">
                                <span>Supprimer le tournoi</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>

        <div class="grow flex flex-col items-center">
            <div v-if="!tournament.hasRounds" class="flex flex-col items-center gap-4">
                <PlayersList
                    :players="tournament.players"
                    isEditable
                    @add-player="tournament.addPlayer($event)"
                    @remove-player="tournament.removePlayer($event)"
                />

                <Button :disabled="!tournament.hasEnoughPlayers" class="w-full" @click="tournament.start()">
                    {{ tournament.hasEnoughPlayers ? 'Lesgoooo' : `frère on va pas jouer à ${tournament.players.length}` }}
                </Button>
            </div>
            <Tabs v-else v-model="tournament.currentRoundIndex" :default-value="0" class="w-full">
                <TabsList class="mb-2">
                    <TabsTrigger v-for="_, i in tournament.rounds" :value="i" :key="i">
                        Tour {{ i + 1 }}
                        <Button v-if="tournament.currentRoundIndex === i && i === tournament.rounds.length - 1" size="icon" class="p-0 w-5 h-5" variant="ghost" @click="tournament.deleteRound()">
                            <span class="text-xs w-[9px]">❌</span>
                        </Button>
                    </TabsTrigger>
                </TabsList>
                <TabsContent v-for="round, i in tournament.rounds" :value="i">
                    <div class="grid gap-4 grid-cols-[repeat(auto-fit,minmax(370px,1fr))]">
                        <Round :round="round" />
                    </div>
                    <Button v-if="tournament.hasRounds && tournament.hasPools && tournament.isOnLastRound" @click="tournament.toNextRound()" class="w-60 fixed left-0 bottom-4 right-0 m-auto">Passer au tour suivant</Button>
                </TabsContent>
            </Tabs>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { Tournament } from '@/entities/Tournament'
import PlayersList from '@/components/PlayersList.vue'
import Round from '@/components/Round.vue'
import { useTournamentStorage } from '@/composables/useTournamentStorage'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import EditableText from '@/components/ui/EditableText.vue'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Menu } from 'lucide-vue-next'

const tournament = ref<Tournament | undefined>(undefined)
const { loadTournament, clearTournament, startAutoSave } = useTournamentStorage(tournament)

onBeforeMount(() => {
    const loadedTournament = loadTournament()
    tournament.value = loadedTournament ?? new Tournament()

    console.log(tournament.value)
    
    startAutoSave()
})

const clearAndRestart = () => {
    if (confirm('Êtes-vous sûr de vouloir effacer le tournoi actuel et en créer un nouveau ?')) {
        clearTournament()
        tournament.value = new Tournament()
    }
}
</script>
