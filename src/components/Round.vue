<template>
    <Card v-for="playerGroup, i in round.playerGroups" :key="i" class="relative w-full">
        <CardHeader v-if="playerGroup.winLossHistory" class="flex items-center justify-between">
            <CardTitle>
                <EditableText 
                    :model-value="playerGroup.displayTitle"
                    @update:model-value="(newTitle) => playerGroup.setCustomTitle(newTitle)"
                    :placeholder="playerGroup.winLossHistory"
                />
            </CardTitle>
            <Popover v-if="playerGroup.poolsHasBeenCreated">
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" class="h-6 w-6 p-0">
                        <MoreHorizontal :size="14" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent :align="'end'" class="w-81">
                    <div class="flex items-center gap-2 text-sm">
                        Nombre de joueurs sélectionnés
                        <NumberField v-model="playerGroup.nbOfSelectedPlayers" :min="1" :max="playerGroup.maxOfSelectedPlayers" class="w-16 inline-block">
                            <NumberFieldContent>
                                <NumberFieldDecrement />
                                <NumberFieldInput />
                                <NumberFieldIncrement />
                            </NumberFieldContent>
                        </NumberField>
                    </div>
                </PopoverContent>
            </Popover>
        </CardHeader>
        <CardContent class="h-full">
            <PlayerGroup :playerGroup="playerGroup" />
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import PlayerGroup from '@/components/PlayersGroup.vue';
import EditableText from '@/components/ui/EditableText.vue';
import type { Round } from '@/entities/Round';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NumberField, NumberFieldContent, NumberFieldDecrement, NumberFieldIncrement, NumberFieldInput } from '@/components/ui/number-field';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MoreHorizontal } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';

defineProps<{
    round: Round
}>()
</script>
