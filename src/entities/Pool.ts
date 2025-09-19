import { Player } from "@/entities/Player"

export interface IGame {
    [Player.name]: number | null
}

export class Pool {
    public games: IGame[] = []

    constructor(public players: Player[]) {
        this.createGames(3)
    }

    private createGames(nbOfGames: number) {
        this.games = Array.from({ length: nbOfGames }, () => {
            const game: IGame = {}
            this.players.forEach(player => {
                game[player.name] = null
            })
            return game
        })
    }

    public addPlayer(player: Player): void {
        this.players.push(player)
    }

    public get ranking(): Player[] {
        return [...this.players].sort((playerA, playerB) => {
            const aPoints = this.getTotalOfPlayer(playerA.name)
            const bPoints = this.getTotalOfPlayer(playerB.name)
            return aPoints - bPoints
        })
    }

    public getTotalOfPlayer(playerName: Player['name']): number {
        return this.games.reduce((acc, game) => acc + (game[playerName] || 0), 0)
    }

    public updateScore(playerName: Player['name'], gameIdx: number, score: number): void {
        this.games[gameIdx][playerName] = score
    }

    public getWinners(nbOfSelectedPlayers: number): Player[] {
        return this.ranking.slice(0, nbOfSelectedPlayers)
    }

    public getLosers(nbOfSelectedPlayers: number): Player[] {
        return this.ranking.slice(nbOfSelectedPlayers)
    }

    public finishRound(nbOfSelectedPlayers: number): void {
        const winners = this.getWinners(nbOfSelectedPlayers)
        const losers = this.getLosers(nbOfSelectedPlayers)
        
        winners.forEach(player => player.addVictory())
        losers.forEach(player => player.addDefeat())
    }

    public toJSON(): Record<any, any> {
        return {
            players: this.players.map(player => player.toJSON()),
            games: this.games
        }
    }

    public static fromJSON(data: Record<any, any>, allPlayers: Player[]): Pool {
        const poolPlayers = data.players.map((playerData: Record<any, any>) => 
            allPlayers.find(p => p.name === playerData.name) || Player.fromJSON(playerData)
        )
        
        const pool = new Pool(poolPlayers)
        pool.games = data.games
        
        return pool
    }
}
