<template>
    <div class="w-full h-100 flex flex-col gap-4">
        <div class="h-[calc(100%-50px)]">
            <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>{{ pl('Joueur', players.length) }} ({{ players.length }})</TableHead>
                <TableHead />
            </TableRow>
            </TableHeader>
            <div v-if="players.length === 0" class="w-full text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">Aucune 🐐 pour le moment.</div>
            <TableBody v-else>
                <TableRow v-for="player in players" :key="player.name">
                    <TableCell>{{ player.name }}</TableCell>
                    <TableCell class="text-right">
                        <Button v-if="isEditable" size="sm" variant="secondary" @click="emit('removePlayer', player.name)" class="w-2 h-6 mr-2">
                            <span class="text-xs">🗑️</span>
                        </Button>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
        </div>
        <form v-if="isEditable" @submit.prevent="onSubmit" class="w-full flex gap-2">
            <Input v-model="newPlayerName" class="playerList_input" />
            <Button :variant="isPlayerNameAvailable(newPlayerName) ? 'default' : 'destructive'" type="submit" :disabled="isButtonDisabled">
                <Plus v-if="isPlayerNameAvailable(newPlayerName)" :size="16" />
                <span v-else>Il existe déjà ce pélo</span>
            </Button>
        </form>
    </div>
</template>

<script lang="ts" setup>
import type { Player } from '@/entities/Player'
import { ref, computed } from 'vue';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { Trash } from 'lucide-vue-next'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus } from 'lucide-vue-next'
import { pl } from '@/lib/utils';

const props = defineProps<{ players: Player[], isEditable?: boolean }>()

const newPlayerName = ref('')

const emit = defineEmits<{
    addPlayer: [playerName: string]
    removePlayer: [playerName: string]
}>()

const onSubmit = () => {
    if (trimmedPlayerName.value && isPlayerNameAvailable(trimmedPlayerName.value)) {
        emit('addPlayer', trimmedPlayerName.value)
        newPlayerName.value = ''
    }
}

const isButtonDisabled = computed(() => {
    return !trimmedPlayerName.value || !isPlayerNameAvailable(trimmedPlayerName.value)
})

const trimmedPlayerName = computed(() => newPlayerName.value.trim())

const isPlayerNameAvailable = (playerName: string) => props.players.findIndex(player => player.name === playerName) === -1
</script>
