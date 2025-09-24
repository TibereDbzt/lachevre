import { Player } from "@/entities/Player"
import { shuffle } from "@/utils/array"

export interface IGame {
    [Player.name]: number | null
}

export class Pool {
    public games: IGame[] = []

    constructor(public players: Player[]) {
        this.createGames(3)
    }

    public createGames(nbOfGames: number) {
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

    public setGameScore(player: Player, gameIdx: number, score: number): void {
        this.games[gameIdx][player.name] = score
        player.setCurrentRoundPoints(this.getTotalOfPlayer(player.name))
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

        this.ranking.forEach((player, idx) => player.addPosition(idx + 1))
    }

    public endTournament(): void {
        this.ranking.forEach((player, idx) => player.addPosition(idx + 1))
    }

    public fillScoresRandomly(): void {
        // Distribute 12 points per game randomly between players
        this.games.forEach((game, gameIndex) => {
            let totalPoints = 12
            const players = shuffle([...this.players])
            players.forEach(player => {
                const score = Math.floor(Math.random() * (totalPoints + 1))
                this.setGameScore(player, gameIndex, score)
                totalPoints -= score
            })
        })
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
