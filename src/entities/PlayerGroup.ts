import { Pool } from "@/entities/Pool"
import { Player } from "@/entities/Player"
import { shuffle } from "@/utils/array"
import type { WinLossHistoryString } from "@/entities/Player"

export class PlayerGroup {
    // À la création des poules, les joueurs ayant fini dans ces positions
    // seront séparés les uns des autres autant que possible
    public static readonly PRIORITY_POSITIONS: number[] = [1, 2]
    
    public pools: Pool[] = []
    public nbOfSelectedPlayers: number = 3
    public customTitle?: string
    
    constructor(
        public readonly winLossHistory: WinLossHistoryString,
        public readonly players: Player[]
    ) {}

    public createPools(nbOfPools: number): void {
        const pools: Pool[] = Array.from({ length: nbOfPools }, () => new Pool([]))
        const playersNotPrioritized: Player[] = this.players.filter(player => !PlayerGroup.PRIORITY_POSITIONS.includes(player.lastPosition))
        const prioritizedPlayersPerPosition: { [position: number]: Player[] } = {}
        
        this.players.forEach(player => {
            const position = player.lastPosition
            if (PlayerGroup.PRIORITY_POSITIONS.includes(position)) {
                if (!prioritizedPlayersPerPosition[position]) prioritizedPlayersPerPosition[position] = []
                prioritizedPlayersPerPosition[position].push(player)
            }
        })

        // Priorité aux positions importantes (1, 2, 3) pour maximiser leur séparation
        PlayerGroup.PRIORITY_POSITIONS.forEach(position => {
            if (prioritizedPlayersPerPosition[position]) {
                const players = shuffle([...prioritizedPlayersPerPosition[position]])

                players.forEach((player, index) => {
                    const poolIndex = index % pools.length
                    pools[poolIndex].addPlayer(player)
                })
            }
        })

        // Répartir les autres joueurs aléatoirement en faisant en sorte que les poules aient le même nombre de joueurs
        shuffle([...playersNotPrioritized]).forEach((player) => {
            // Trouver le pool avec le moins de joueurs
            const poolWithLeastPlayers = pools.reduce((poolWithLeastPlayers, pool) => 
                pool.players.length < poolWithLeastPlayers.players.length ? pool : poolWithLeastPlayers
            )
            poolWithLeastPlayers.addPlayer(player)
        })

        this.pools = pools
        this.nbOfSelectedPlayers = Math.floor(this.pools.length / 2)
    }

    public finishRound(): void {
        this.pools.forEach(pool => {
            pool.finishRound(this.nbOfSelectedPlayers)
        })
    }

    public endTournament(): void {
        this.pools.forEach(pool => {
            pool.endTournament()
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

    public fillScoresRandomly(): void {
        this.pools.forEach(pool => {
            pool.fillScoresRandomly()
        })
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
