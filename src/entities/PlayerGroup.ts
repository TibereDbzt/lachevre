import { Pool } from "@/entities/Pool"
import { Player } from "@/entities/Player"
import { shuffle } from "@/utils/array"
import type { WinLossHistoryString } from "@/entities/Player"

export class PlayerGroup {
    public pools: Pool[] = []
    public nbOfSelectedPlayers: number = 3
    public customTitle?: string
    
    constructor(
        public readonly winLossHistory: WinLossHistoryString,
        public readonly players: Player[]
    ) {}

    public createPools(nbOfPools: number): void {
        const pools: Pool[] = Array.from({ length: nbOfPools }, () => new Pool([]))
        const shuffledPlayers = shuffle([...this.players])

        shuffledPlayers.forEach((player, index) => {
            const poolIndex = index % nbOfPools
            pools[poolIndex].addPlayer(player)
        })

        this.pools = pools
        this.nbOfSelectedPlayers = Math.floor(this.pools.length / 2)
    }

    public finishRound(): void {
        this.pools.forEach(pool => {
            pool.finishRound(this.nbOfSelectedPlayers)
        })
    }

    public get maxOfSelectedPlayers(): number {
        if (this.pools.length === 0) throw new Error('Pools have not been created yet.')
        const smallestPool = this.pools.reduce((smallestPool, pool) => pool.players.length < smallestPool.players.length ? pool : smallestPool)
        return smallestPool.players.length - 1;
    }

    public get poolsHasBeenCreated(): boolean {
        return this.pools.length > 0
    }

    public get displayTitle(): string {
        return this.customTitle || this.winLossHistory
    }

    public setCustomTitle(title: string): void {
        this.customTitle = title.trim() || undefined
    }

    public toJSON(): Record<any, any> {
        return {
            winLossHistory: this.winLossHistory,
            players: this.players.map(player => player.toJSON()),
            pools: this.pools.map(pool => pool.toJSON()),
            nbOfSelectedPlayers: this.nbOfSelectedPlayers,
            customTitle: this.customTitle
        }
    }

    public static fromJSON(data: Record<any, any>, allPlayers: Player[]): PlayerGroup {
        const groupPlayers = data.players.map((playerData: Record<any, any>) => 
            allPlayers.find(p => p.name === playerData.name) || Player.fromJSON(playerData)
        )
        
        const group = new PlayerGroup(data.winLossHistory, groupPlayers)
        group.nbOfSelectedPlayers = data.nbOfSelectedPlayers
        group.pools = data.pools.map((poolData: any) => Pool.fromJSON(poolData, allPlayers))
        group.customTitle = data.customTitle
        
        return group
    }
}
