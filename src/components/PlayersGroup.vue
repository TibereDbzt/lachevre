<template>
    <div v-if="!playerGroup.poolsHasBeenCreated" class="h-full flex flex-col gap-4">
        <PlayersList :players="playerGroup.players" />
        <div class="mt-auto flex items-center gap-2">
            Répartir ces {{ playerGroup.players.length }} joueurs dans
            <NumberField v-model="nbOfPools" :min="1" :max="playerGroup.players.length" class="w-16">
                <NumberFieldContent>
                    <NumberFieldDecrement />
                    <NumberFieldInput />
                    <NumberFieldIncrement />
                </NumberFieldContent>
            </NumberField>
            {{ pl('poule', nbOfPools) }}
        </div>
        <Button @click="playerGroup.createPools(nbOfPools)">Créer {{ nbOfPools }} {{ pl('poule', nbOfPools) }}</button>
    </div>
    <div v-else class="grid gap-4 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
        <Pool v-for="pool, i in playerGroup.pools" :pool="pool" :nbOfSelectedPlayers="playerGroup.nbOfSelectedPlayers" :key="i"/>
    </div>
</template>

<script setup lang="ts">
import type { PlayerGroup } from '@/entities/PlayerGroup';
import PlayersList from '@/components/PlayersList.vue';
import Pool from '@/components/Pool.vue';
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import { NumberField, NumberFieldContent, NumberFieldDecrement, NumberFieldIncrement, NumberFieldInput } from '@/components/ui/number-field';
import { pl } from '@/lib/utils';

defineProps<{
    playerGroup: PlayerGroup
}>()

const nbOfPools = ref<number>(2)
</script>