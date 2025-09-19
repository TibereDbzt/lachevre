<template>
    <div>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>
                        <div class="flex items-center gap-1">
                            <span>Joueur</span>
                            <TooltipProvider asChild :delayDuration="600">
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Button variant="ghost" size="icon" class="h-6 w-6" @click="openSeatingDialog">
                                            <Shuffle class="size-3" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent :sideOffset="-5">
                                        <span>Placer les joueurs aléatoirement</span>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </TableHead>
                    <TableHead class="pl-5" v-for="_, index in pool.games" :key="index">P{{ index + 1 }}</TableHead> 
                    <TableHead class="text-right">Total</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow v-for="player, rank in pool.ranking" :key="player.name" class="pool_playerRow" :class="{ 'is-selected': rank < props.nbOfSelectedPlayers }">
                    <TableCell>
                       <span>{{ player.name }}</span>
                    </TableCell>
                    <TableCell v-for="game, index in pool.games" :key="`${player.name}-${index}`">
                        <input 
                            type="number"
                            min="0"
                            v-model="game[player.name]"
                            :ref="(el) => createInputRef(el as HTMLInputElement, player.name, index)"
                            class="pool_inputNumber flex h-6 w-10 rounded-md border border-input bg-transparent py-1 text-sm text-center shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            @focus="setFocusedInput(player.name, index)"
                        >
                    </TableCell>
                    <TableCell class="text-right">
                        <span class="bg-gray-900 text-white px-1 rounded">{{ pool.getTotalOfPlayer(player.name) }}</span>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </div>

    <Dialog v-model:open="isSeatingDialogOpen">
        <DialogContent class="max-w-md">
            <DialogHeader>
                <DialogTitle>Va te placeeeeer</DialogTitle>
                <DialogDescription>
                    C'est un ordre aléatoire Jerem casse pas les couilles.
                </DialogDescription>
            </DialogHeader>
            <div class="mt-4">
                <PlayersList :players="shuffle(props.pool.players)" :is-editable="false" class="h-auto"/>
            </div>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import type { Pool } from '@/entities/Pool';
import { ref, watch } from 'vue';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Shuffle } from 'lucide-vue-next'
import PlayersList from '@/components/PlayersList.vue'
import { shuffle } from '@/utils/array';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

const props = defineProps<{ pool: Pool, nbOfSelectedPlayers: number }>()

const focusedInputKey = ref<{playerName: string, gameIndex: number} | null>(null)
const inputRefs = ref<Map<string, HTMLInputElement>>(new Map())
const isSeatingDialogOpen = ref(false)

const createInputRef = (el: HTMLInputElement, playerName: string, gameIndex: number) => {
    const key = `${playerName}-${gameIndex}`
    inputRefs.value.set(key, el)
}

const setFocusedInput = (playerName: string, gameIndex: number) => {
    focusedInputKey.value = { playerName, gameIndex }
}

const openSeatingDialog = () => {
    isSeatingDialogOpen.value = true
}

watch(() => props.pool.ranking, () => {
    const key = `${focusedInputKey.value?.playerName}-${focusedInputKey.value?.gameIndex}`
    const inputElement = inputRefs.value.get(key)
    if (inputElement) inputElement.focus()
}, { flush: 'post' })
</script>

<style scoped lang="scss">
.pool {

    &_playerRow {

        &.is-selected {
            background-color: rgb(250, 250, 250);
        }
    }

    &_inputNumber {
        -moz-appearance:textfield;

        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
    }
}
</style>
