<template>
    <div>
        <div class="my-20">
            <span class="text-6xl font-bold">{{ tournament.rankingByStage[0].name }} est la 🐐 !!!</span>
        </div>
        <div>
            <Table>
                <TableHeader class="bg-primary">
                    <TableRow>
                        <TableHead class="px-6 py-4">
                            <Button variant="ghost" :class="useTotalPointsOrder ? '' : 'text-primary'" @click="useTotalPointsOrder = false">Position</Button>
                        </TableHead>
                        <TableHead class="px-6 py-4">Joueur</TableHead>
                        <TableHead class="px-6 py-4">Phase atteinte</TableHead>
                        <TableHead class="px-6 py-4">Position</TableHead>
                        <TableHead class="px-6 py-4 text-right">
                            <Button variant="ghost" :class="useTotalPointsOrder ? 'text-primary' : ''" @click="useTotalPointsOrder = !useTotalPointsOrder">Total de points</Button>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow v-for="(player, i) in ranking" :key="player.name" class="resultsRow" :class="i === 0 ? 'isWinner' : ''">
                        <TableCell class="position px-6 text-center">{{ i===0 ? '🐐' : i + 1 }}</TableCell>
                        <TableCell class="name px-6">{{ player.name }}</TableCell>
                        <TableCell class="px-6">{{ formatWinLossHistory(player.winLossHistory) }}</TableCell>
                        <TableCell class="px-6">{{ player.lastPosition }}</TableCell>
                        <TableCell class="px-6 text-center">{{ player.totalPoints }}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { Tournament } from '@/entities/Tournament';
import { computed, ref } from 'vue';
import { Button } from '@/components/ui/button'

const props = defineProps<{ tournament: Tournament }>()

const useTotalPointsOrder = ref<boolean>(false)

const ranking = computed(() => {
    if (useTotalPointsOrder.value) return props.tournament.rankingByTotalPoints
    else return props.tournament.rankingByStage
})
    

const formatWinLossHistory = (winLossHistory: string) => {
    const firstLossIndex = winLossHistory.indexOf('L')
    const roundsCount = props.tournament.rounds.length
    if (firstLossIndex === -1) return 'Finale'
    if (firstLossIndex === roundsCount - 2) return 'Demi-finale'
    else return 'Qualifs'
}
</script>

<style lang="scss" scoped>
.results {

    &Row {
        .name {
            font-weight: bold;
        }
        
        &.isWinner {
            background-color: var(--secondary);
            color: var(--primary);
        }
    }
}
</style>
